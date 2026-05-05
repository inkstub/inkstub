const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const PRICES = {
  1: 'price_1TTdMA8ebfnLadN0nSvfDgWE',
  3: 'price_1TTdLs8ebfnLadN0Q6LrW40q',
  5: 'price_1TTdLs8ebfnLadN0CA1FTTtv',
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { quantity, ticketData, userId, userEmail } = JSON.parse(event.body);

    if (![1, 3, 5].includes(quantity)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid quantity' }) };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: PRICES[quantity],
        quantity: 1,
      }],
      mode: 'payment',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU'],
      },
      success_url: `${process.env.URL || 'https://inkstub.com'}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL || 'https://inkstub.com'}/app.html`,
      customer_email: userEmail || undefined,
      metadata: {
        quantity: String(quantity),
        user_id: userId || '',
        ticket_data: JSON.stringify(ticketData).substring(0, 500),
      },
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error('Stripe error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
