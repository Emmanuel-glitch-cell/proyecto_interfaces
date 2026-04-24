import { useEffect, useState } from "react";
import api from "./api";
import Navbar from "./components/Navbar";
import DishCard from "./components/DishCard";
import CartDrawer from "./components/CartDrawer";
import ReservationForm from "./components/ReservationForm";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import Toast from "./components/Toast";

export default function App() {
  const [section, setSection] = useState("inicio");
  const [dishes, setDishes] = useState([]);
  const [cart, setCart] = useState([]);
  const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken") || "");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    api.get("/dishes").then((res) => setDishes(res.data));
  }, []);

  const notify = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3500);
  };

  const addToCart = (dish) => {
    const exists = cart.find((item) => item.id === dish.id);
    const currentQty = exists ? exists.quantity : 0;

    if (currentQty >= dish.stock) {
      notify("error", "No puedes agregar más de este plato. Ya no hay suficiente stock.");
      return;
    }

    if (exists) {
      setCart(cart.map((item) =>
        item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...dish, quantity: 1 }]);
    }

    notify("success", `Agregaste ${dish.name} al carrito.`);
  };

  const removeOneFromCart = (id) => {
    setCart(cart
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0)
    );
    notify("success", "Se redujo la cantidad del producto.");
  };

  const removeAllFromCart = (id) => {
    const removed = cart.find((item) => item.id === id);
    setCart(cart.filter((item) => item.id !== id));
    if (removed) notify("success", `${removed.name} fue eliminado del carrito.`);
  };

  const clearCart = () => {
    setCart([]);
    notify("success", "Se vació todo el carrito.");
  };

  const refreshDishes = async () => {
    const res = await api.get("/dishes");
    setDishes(res.data);
  };

  const updateStockAfterPurchase = async () => {
    await refreshDishes();
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <Toast message={message} />
      <Navbar section={section} setSection={setSection} cartCount={cart.reduce((total, item) => total + item.quantity, 0)} />

      {section === "inicio" && (
        <main className="p-6 max-w-6xl mx-auto">
          <section className="bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836')] bg-cover bg-center rounded-3xl p-10 text-white shadow-lg">
            <div className="bg-black/50 p-8 rounded-3xl">
              <h1 className="text-4xl font-bold mb-3">Sabores del Perú</h1>
              <p className="max-w-2xl text-lg">
                Restaurante demo para reservas, pedidos y administración.
              </p>
            </div>
          </section>

          <section className="mt-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold">Platos típicos</h2>
              <button
                onClick={() => setSection("carrito")}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white hover:cursor-pointer hover:scale-105"
              >
                Ver carrito ({cart.reduce((total, item) => total + item.quantity, 0)})
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {dishes.map((dish) => (
                <DishCard key={dish.id} dish={dish} onAdd={addToCart} />
              ))}
            </div>
          </section>
        </main>
      )}

      {section === "carrito" && (
        <CartDrawer
          cart={cart}
          setSection={setSection}
          onClose={() => setSection("inicio")}
          onRemoveOne={removeOneFromCart}
          onRemoveAll={removeAllFromCart}
          onClear={clearCart}
          onSuccess={async () => {
            await updateStockAfterPurchase();
            notify("success", "Compra realizada correctamente.");
          }}
          onError={(msg) => notify("error", msg)}
        />
      )}

      {section === "reservas" && (
        <ReservationForm
          onSuccess={(msg) => notify("success", msg)}
          onError={(msg) => notify("error", msg)}
        />
      )}

      {section === "admin" && !adminToken && (
        <AdminLogin
          onLogin={(token) => {
            localStorage.setItem("adminToken", token);
            setAdminToken(token);
            notify("success", "Acceso correcto. Bienvenido administrador.");
          }}
          onError={(msg) => notify("error", msg)}
        />
      )}

      {section === "admin" && adminToken && (
        <AdminDashboard
          onLogout={() => {
            localStorage.removeItem("adminToken");
            setAdminToken("");
            notify("success", "Sesión cerrada.");
          }}
          onSuccess={(msg) => notify("success", msg)}
          onError={(msg) => notify("error", msg)}
        />
      )}
    </div>
  );
}