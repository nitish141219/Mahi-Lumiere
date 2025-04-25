import Stripe from 'stripe';

export const config = {
  api: {
    bodyParser: true,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: req.body.items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: { name: item.name },
          unit_amount: parseInt(item.price.replace('$', '')) * 100,
        },
        quantity: 1,
      })),
      mode: 'payment',
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/cancel`,
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Stripe error:", error.message);
    res.status(500).json({ error: error.message });
  }
}
