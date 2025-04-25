import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const products = [
  {
    id: 1,
    name: "Coconut Ghee Luxury Soap",
    description: "A nourishing blend of coconut oil, buffalo ghee, and castor oil infused with vitamins A, D, and E.",
    price: "$18",
    image: "/images/soap1.jpg",
  },
];

export default function Home() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const handleCheckout = async () => {
    const stripe = await stripePromise;
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items: cart }),
    });

    const session = await response.json();
    console.log("Session:", session); // ✅ Log session

    if (!session.id) {
      alert("Stripe session failed. Check console.");
      return;
    }

    await stripe.redirectToCheckout({ sessionId: session.id });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-yellow-900">
        Mahi Lumière Soaps
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl shadow-md">
            <img
              src={product.image}
              alt={product.name}
              className="rounded-t-2xl w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-yellow-800">{product.name}</h2>
              <p className="text-sm text-gray-600 mb-2">{product.description}</p>
              <p className="text-lg font-bold text-yellow-700">{product.price}</p>
              <button
                className="mt-2 bg-yellow-600 text-white px-4 py-2 rounded-xl"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 p-4 border-t pt-6">
        <h3 className="text-2xl font-semibold text-yellow-900">Cart</h3>
        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            <ul className="list-disc ml-5">
              {cart.map((item, index) => (
                <li key={index} className="text-yellow-800">
                  {item.name} - {item.price}
                </li>
              ))}
            </ul>
            <button
              className="mt-4 bg-yellow-700 text-white px-4 py-2 rounded-xl"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
