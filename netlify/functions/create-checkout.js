const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

function pricePerStub(totalStubs) {
  if (totalStubs >= 5) return 9.99;
  if (totalStubs >= 3) return 11.99;
  return 14.99;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const { quantity, cartItems, userId, userEmail } = JSON.parse(event.body);
    const totalStubs = Math.max(1, quantity || 1);
    const unitPrice = pricePerStub(totalStubs);
    const unitPriceCents = Math.round(unitPrice * 100);
    const tierLabel = `${totalStubs} stub${totalStubs > 1 ? 's' : ''} @ $${unitPrice.toFixed(2)} each`;

    // Store full cart as JSON in metadata (max 500 chars per value)
    const cartSummary = JSON.stringify(
      (cartItems || []).map(i => ({
        name: i.name,
        venue: i.venue,
        date: i.date,
        seat: i.seat,
        style: i.style,
        qty: i.qty,
        price: i.price,
        eventCode: i.eventCode,
        ticketNumber: i.ticketNumber,
        venueAddress: i.venueAddress,
      }))
    ).substring(0, 500);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'inkstub — Collectible Ticket Stubs',
            description: tierLabel,
          },
          unit_amount: unitPriceCents,
        },
        quantity: totalStubs,
      }],
      mode: 'payment',
      shipping_address_collection: { allowed_countries: ['US', 'CA', 'GB', 'AU'] },
      success_url: `${process.env.URL || 'https://inkstub.com'}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL || 'https://inkstub.com'}/app.html`,
      customer_email: userEmail || undefined,
      metadata: {
        quantity: String(totalStubs),
        user_id: userId || '',
        cart_summary: cartSummary,
      },
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error('Stripe error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
