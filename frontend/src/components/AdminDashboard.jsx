import { useEffect, useState } from "react";
import api from "../api";

const emptyDish = {
  name: "",
  description: "",
  price: "",
  stock: "",
  image_url: "",
  category: ""
};

export default function AdminDashboard({ onLogout, onSuccess, onError }) {
  const [dishes, setDishes] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [topDishes, setTopDishes] = useState([]);
  const [reservationReport, setReservationReport] = useState([]);
  const [newDish, setNewDish] = useState(emptyDish);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [dRes, rRes, tRes, sRes] = await Promise.all([
        api.get("/dishes"),
        api.get("/reservations"),
        api.get("/admin/reports/top-dishes"),
        api.get("/admin/reports/reservations-summary")
      ]);

      setDishes(dRes.data);
      setReservations(rRes.data);
      setTopDishes(tRes.data);
      setReservationReport(sRes.data);
    } catch {
      onError("No se pudo cargar el panel de administración.");
    }
  };

  const updateDishField = (id, field, value) => {
    setDishes((prev) =>
      prev.map((dish) => (dish.id === id ? { ...dish, [field]: value } : dish))
    );
  };

  const saveDish = async (dish) => {
    try {
      await api.put(`/dishes/${dish.id}`, {
        name: dish.name,
        description: dish.description,
        price: dish.price,
        stock: dish.stock,
        image_url: dish.image_url,
        category: dish.category,
        active: dish.active
      });
      onSuccess("Plato actualizado correctamente.");
      loadData();
    } catch {
      onError("No se pudo actualizar el plato.");
    }
  };

  const createDish = async (e) => {
    e.preventDefault();

    if (!newDish.name || !newDish.price || !newDish.stock || !newDish.image_url || !newDish.category) {
      onError("Completa todos los campos para agregar un plato.");
      return;
    }

    try {
      await api.post("/dishes", {
        ...newDish,
        price: Number(newDish.price),
        stock: Number(newDish.stock)
      });
      onSuccess("Nuevo plato agregado correctamente.");
      setNewDish(emptyDish);
      loadData();
    } catch {
      onError("No se pudo agregar el plato.");
    }
  };

  const changeReservationStatus = async (id, status) => {
    try {
      await api.put(`/reservations/${id}`, { status });
      onSuccess(
        status === "confirmed"
          ? "Reserva aprobada correctamente."
          : "Reserva desaprobada correctamente."
      );
      loadData();
    } catch {
      onError("No se pudo cambiar el estado de la reserva.");
    }
  };

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Panel Admin</h2>
        <button onClick={onLogout} className="px-4 py-2 rounded-xl bg-red-600 text-white hover:cursor-pointer hover:scale-105">
          Salir
        </button>
      </div>

      <section className="bg-white border rounded-3xl p-5">
        <h3 className="text-xl font-bold mb-4">Agregar nuevo plato</h3>
        <form onSubmit={createDish} className="grid md:grid-cols-2 gap-3">
          <input
            value={newDish.name}
            onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
            placeholder="Nombre"
            className="border rounded-xl p-3"
          />
          <input
            value={newDish.price}
            onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
            placeholder="Precio"
            type="number"
            className="border rounded-xl p-3"
          />
          <input
            value={newDish.stock}
            onChange={(e) => setNewDish({ ...newDish, stock: e.target.value })}
            placeholder="Stock"
            type="number"
            className="border rounded-xl p-3"
          />
          <input
            value={newDish.category}
            onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
            placeholder="Categoría"
            className="border rounded-xl p-3"
          />
          <input
            value={newDish.image_url}
            onChange={(e) => setNewDish({ ...newDish, image_url: e.target.value })}
            placeholder="URL imagen"
            className="border rounded-xl p-3 md:col-span-2"
          />
          <textarea
            value={newDish.description}
            onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
            placeholder="Descripción"
            className="border rounded-xl p-3 md:col-span-2"
          />
          <button className="px-5 py-3 rounded-xl bg-green-600 text-white md:col-span-2 hover:cursor-pointer hover:scale-105">
            Agregar plato
          </button>
        </form>
      </section>

      <section className="bg-white border rounded-3xl p-5">
        <h3 className="text-xl font-bold mb-4">Platos</h3>
        <div className="space-y-4">
          {dishes.map((dish) => (
            <div key={dish.id} className="border rounded-2xl p-4 space-y-3">
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  className="border rounded-xl p-3"
                  value={dish.name}
                  onChange={(e) => updateDishField(dish.id, "name", e.target.value)}
                />
                <input
                  className="border rounded-xl p-3"
                  value={dish.category}
                  onChange={(e) => updateDishField(dish.id, "category", e.target.value)}
                />
                <input
                  className="border rounded-xl p-3"
                  type="number"
                  value={dish.price}
                  onChange={(e) => updateDishField(dish.id, "price", e.target.value)}
                />
                <input
                  className="border rounded-xl p-3"
                  type="number"
                  value={dish.stock}
                  onChange={(e) => updateDishField(dish.id, "stock", e.target.value)}
                />
                <input
                  className="border rounded-xl p-3 md:col-span-2"
                  value={dish.image_url}
                  onChange={(e) => updateDishField(dish.id, "image_url", e.target.value)}
                />
                <textarea
                  className="border rounded-xl p-3 md:col-span-2"
                  value={dish.description}
                  onChange={(e) => updateDishField(dish.id, "description", e.target.value)}
                />
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-stone-600">ID: {dish.id}</p>
                <button
                  onClick={() => saveDish(dish)}
                  className="px-4 py-2 rounded-xl bg-stone-900 text-white hover:cursor-pointer hover:scale-105"
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border rounded-3xl p-5">
        <h3 className="text-xl font-bold mb-4">Reservas</h3>
        <div className="space-y-3">
          {reservations.map((r) => (
            <div key={r.id} className="border rounded-2xl p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
              <div>
                <p className="font-semibold">{r.customer_name}</p>
                <p>{r.reservation_date} - {r.reservation_time}</p>
                <p>{r.table_number} - {r.capacity} personas</p>
                <p className="text-sm">Estado: {r.status}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => changeReservationStatus(r.id, "confirmed")}
                  className="px-4 py-2 rounded-xl bg-green-600 text-white hover:cursor-pointer hover:scale-105"
                >
                  Aprobar
                </button>
                <button
                  onClick={() => changeReservationStatus(r.id, "cancelled")}
                  className="px-4 py-2 rounded-xl bg-red-500 text-white hover:cursor-pointer hover:scale-105"
                >
                  Desaprobar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-5">
        <div className="bg-white border rounded-3xl p-5">
          <h3 className="text-xl font-bold mb-4">Reporte 1: Platos más vendidos</h3>
          {topDishes.map((item, index) => (
            <p key={index}>{item.name}: {item.total_vendido}</p>
          ))}
        </div>

        <div className="bg-white border rounded-3xl p-5">
          <h3 className="text-xl font-bold mb-4">Reporte 2: Reservas por día</h3>
          {reservationReport.map((item, index) => (
            <p key={index}>{item.reservation_date}: {item.total_reservas}</p>
          ))}
        </div>
      </section>
    </main>
  );
}