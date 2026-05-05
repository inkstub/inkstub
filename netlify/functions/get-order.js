const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const sessionId = event.queryStringParameters?.session_id;
  if (!sessionId) return { statusCode: 400, body: 'Missing session_id' };

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });

    const shipping = session.shipping_details?.address;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quantity:  parseInt(session.metadata?.quantity || 1),
        amount:    session.amount_total,
        email:     session.customer_details?.email,
        shipping:  shipping ? {
          name:        session.shipping_details?.name,
          line1:       shipping.line1,
          city:        shipping.city,
          state:       shipping.state,
          postal_code: shipping.postal_code,
          country:     shipping.country,
        } : null,
      }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
