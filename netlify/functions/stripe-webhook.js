const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  const sig = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;

    try {
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items'],
      });

      const shipping = fullSession.shipping_details?.address;
      const cartItems = JSON.parse(fullSession.metadata?.cart_summary || '[]');

      // Save to Supabase
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

      const orderData = {
        stripe_session_id: session.id,
        user_id: fullSession.metadata?.user_id || '',
        user_email: fullSession.customer_details?.email || '',
        quantity: parseInt(fullSession.metadata?.quantity || 1),
        amount_total: fullSession.amount_total,
        status: 'pending',
        shipping_name: fullSession.shipping_details?.name || '',
        shipping_line1: shipping?.line1 || '',
        shipping_city: shipping?.city || '',
        shipping_state: shipping?.state || '',
        shipping_postal: shipping?.postal_code || '',
        shipping_country: shipping?.country || '',
        cart_items: cartItems,
      };

      const res = await fetch(`${supabaseUrl}/rest/v1/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error('Supabase insert error:', err);
      }

      // Send email notification to hello@inkstub.com via Resend
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: 'inkstub <hello@inkstub.com>',
            to: ['hello@inkstub.com'],
            subject: `New Order — ${orderData.quantity} stub${orderData.quantity > 1 ? 's' : ''} — $${(orderData.amount_total / 100).toFixed(2)}`,
            html: `
              <div style="font-family:sans-serif;max-width:500px;padding:20px">
                <h2 style="color:#C8922A">New inkstub Order</h2>
                <p><strong>Order ID:</strong> ${session.id}</p>
                <p><strong>Customer:</strong> ${orderData.user_email}</p>
                <p><strong>Quantity:</strong> ${orderData.quantity} stub${orderData.quantity > 1 ? 's' : ''}</p>
                <p><strong>Amount:</strong> $${(orderData.amount_total / 100).toFixed(2)}</p>
                <hr>
                <h3>Ship To:</h3>
                <p>${orderData.shipping_name}<br>
                ${orderData.shipping_line1}<br>
                ${orderData.shipping_city}, ${orderData.shipping_state} ${orderData.shipping_postal}<br>
                ${orderData.shipping_country}</p>
                <hr>
                <h3>Tickets:</h3>
                ${cartItems.map(item => `<p>• ${item.name} (qty: ${item.qty || 1})</p>`).join('')}
                <hr>
                <p><a href="https://inkstub.com/admin.html" style="background:#C8922A;color:#000;padding:10px 20px;text-decoration:none;font-weight:bold">View in Admin Dashboard</a></p>
              </div>
            `,
          }),
        });
      }

    } catch (err) {
      console.error('Order processing error:', err);
      return { statusCode: 500, body: err.message };
    }
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
