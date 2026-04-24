import { useState } from "react";
import api from "../api";

export default function CartDrawer({
  cart,
  onRemoveOne,
  onRemoveAll,
  onClear,
  onSuccess,
  onError
}) {
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("tarjeta");

  const total = cart.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);

  const handleCheckout = async () => {
    if (!customerName.trim()) {
      onError("El nombre no puede estar vacío.");
      return;
    }

    if (cart.length === 0) {
      onError("El carrito está vacío.");
      return;
    }

    try {
      await api.post("/orders", {
        customer_name: customerName,
        payment_method: paymentMethod,
        items: cart.map((item) => ({ id: item.id, quantity: item.quantity }))
      });

      onSuccess();
      onClear();
    } catch (error) {
      onError(error.response?.data?.message || "No se pudo procesar la compra.");
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-5">Carrito de compras</h2>

      {cart.length === 0 ? (
        <p>No hay productos agregados.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p>S/ {Number(item.price).toFixed(2)} x {item.quantity}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onRemoveOne(item.id)} className="px-3 py-2 rounded-lg bg-stone-200 hover:cursor-pointer hover:scale-105">-</button>
                <button onClick={() => onRemoveAll(item.id)} className="px-3 py-2 rounded-lg bg-red-500 text-white hover:cursor-pointer hover:scale-105">Eliminar</button>
              </div>
            </div>
          ))}

          <div className="bg-white p-4 rounded-2xl border">
            <label className="block mb-2 font-semibold">Nombre del cliente</label>
            <input
              className="w-full border rounded-xl p-3 mb-4"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />

            <label className="block mb-2 font-semibold">Método de pago</label>
            <select
              className="w-full border rounded-xl p-3 mb-4"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="tarjeta">Tarjeta</option>
              <option value="yape">Yape</option>
              <option value="plin">Plin</option>
            </select>

            <p className="text-lg font-bold mb-4">Total: S/ {total.toFixed(2)}</p>

            <div className="flex gap-3">
              <button onClick={handleCheckout} className="px-5 py-3 rounded-xl bg-green-600 text-white hover:cursor-pointer hover:scale-105">
                Confirmar compra
              </button>
              <button onClick={onClear} className="px-5 py-3 rounded-xl bg-stone-900 text-white hover:cursor-pointer hover:scale-105">
                Vaciar carrito
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}