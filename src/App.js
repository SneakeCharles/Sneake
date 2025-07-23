
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";

const Card = ({ children }) => <div className="border rounded-lg shadow p-4">{children}</div>;
const CardContent = ({ children }) => <div>{children}</div>;
const Button = ({ children, ...props }) => <button className="bg-blue-500 text-white px-4 py-2 rounded" {...props}>{children}</button>;

const fakeSneakers = [
  { id: 1, name: "Jordan 1 Retro", price: 250, image: "/jordan1.jpg" },
  { id: 2, name: "Yeezy Boost 350", price: 300, image: "/yeezy350.jpg" },
  { id: 3, name: "Nike Dunk Low", price: 180, image: "/dunklow.jpg" }
];

const fakeApparel = [
  { id: 4, name: "Supreme Hoodie", price: 220, image: "/supreme.jpg" },
  { id: 5, name: "Bape Tee", price: 90, image: "/bape.jpg" }
];

const fakeAccessories = [
  { id: 6, name: "Sneaker Cleaning Kit", price: 30, image: "/cleaner.jpg" },
  { id: 7, name: "Sneaker Keychain", price: 15, image: "/keychain.jpg" }
];

function App() {
  const [user, setUser] = useState(() => localStorage.getItem("sneak-user"));
  const [cart, setCart] = useState([]);

  const login = (email) => {
    localStorage.setItem("sneak-user", email);
    setUser(email);
  };

  const logout = () => {
    localStorage.removeItem("sneak-user");
    setUser(null);
    setCart([]);
  };

  const addToCart = (item) => {
    setCart((prev) => [...prev, item]);
  };

  return (
    <Router>
      <nav className="flex justify-between p-4 bg-black text-white">
        <Link to="/" className="text-xl font-bold">Sneak</Link>
        <div className="flex gap-4 items-center">
          <Link to="/shoes">Shoes</Link>
          <Link to="/apparel">Apparel</Link>
          <Link to="/accessories">Accessories</Link>
          <Link to="/cart">Cart ({cart.length})</Link>
          {user ? (
            <>
              <span>Hi, {user}</span>
              <button onClick={logout} className="bg-red-500 px-2 py-1 rounded">Logout</button>
            </>
          ) : (
            <Link to="/login">Login / Signup</Link>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shoes" element={<Marketplace addToCart={addToCart} items={fakeSneakers} title="Shoes" />} />
        <Route path="/apparel" element={<Marketplace addToCart={addToCart} items={fakeApparel} title="Apparel" />} />
        <Route path="/accessories" element={<Marketplace addToCart={addToCart} items={fakeAccessories} title="Accessories" />} />
        <Route path="/login" element={<Login login={login} />} />
        <Route path="/cart" element={<Cart cart={cart} user={user} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

function Home() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to Sneak</h1>
      <p>Discover the latest drops you've been eyeing.</p>
    </div>
  );
}

function Marketplace({ addToCart, items, title }) {
  const navigate = useNavigate();
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Button onClick={() => navigate(-1)}>⬅ Back</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
              <h2 className="text-lg font-bold mt-2">{item.name}</h2>
              <p className="text-sm text-gray-600">${item.price}</p>
              <Button className="mt-2" onClick={() => addToCart(item)}>Add to Cart</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Login({ login }) {
  const [email, setEmail] = useState("");

  const handleLogin = () => {
    if (email.trim()) login(email);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl mb-4">Login or Signup</h1>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded w-64"
      />
      <Button className="mt-4" onClick={handleLogin}>Continue</Button>
    </div>
  );
}

function Cart({ cart, user }) {
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  useEffect(() => {
    if (!user) {
      alert("You must be signed in to view your cart and checkout.");
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item, index) => (
            <div key={index} className="border-b pb-2">
              {item.name} - ${item.price}
            </div>
          ))}
          <p className="font-bold mt-4">Total: ${total}</p>
          <Button>Checkout (coming soon)</Button>
        </div>
      )}
    </div>
  );
}

export default App;
