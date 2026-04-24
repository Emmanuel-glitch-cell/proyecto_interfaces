import { useEffect, useState } from "react";
import api from "../api";

export default function ReservationForm({ onSuccess, onError }) {
  const [form, setForm] = useState({
    customer_name: "",
    reservation_date: "",
    reservation_time: "",
    guests: 2,
    table_id: ""
  });

  const [tables, setTables] = useState([]);

  useEffect(() => {
    const { reservation_date, reservation_time } = form;
    if (reservation_date && reservation_time) {
      api.get("/reservations/tables", {
        params: { date: reservation_date, time: reservation_time }
      }).then((res) => {
        console.log("Mesas:", res.data);
        setTables(res.data)
      });
    }
  }, [form.reservation_date, form.reservation_time]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.customer_name || !form.reservation_date || !form.reservation_time || !form.table_id || !form.guests) {
      onError("No pueden haber campos vacíos.");
      return;
    }

    try {
      await api.post("/reservations", form);
      onSuccess("Reserva creada correctamente. El restaurante ya recibió tu solicitud.");
      setForm({
        customer_name: "",
        reservation_date: "",
        reservation_time: "",
        guests: 2,
        table_id: ""
      });
    } catch (error) {
      onError(error.response?.data?.message || "No se pudo crear la reserva.");
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-5">Reservar mesa</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border shadow space-y-4">
        <input name="customer_name" value={form.customer_name} onChange={handleChange} placeholder="Nombre" className="w-full border p-3 rounded-xl" />
        <input type="date" name="reservation_date" value={form.reservation_date} onChange={handleChange} className="w-full border p-3 rounded-xl" />
        <input type="time" name="reservation_time" value={form.reservation_time} onChange={handleChange} className="w-full border p-3 rounded-xl" />
        <input type="number" name="guests" value={form.guests} onChange={handleChange} className="w-full border p-3 rounded-xl" min="1" />

        <select name="table_id" value={form.table_id} onChange={handleChange} className="w-full border p-3 rounded-xl">
          <option value="">Selecciona una mesa disponible</option>
          {tables.map((table) => (
            <option key={table.id} value={table.id}>
              {table.table_number} - capacidad {table.capacity}
            </option>
          ))}
        </select>

        <button className="px-5 py-3 rounded-xl bg-stone-900 text-white hover:cursor-pointer hover:scale-105">
          Confirmar reserva
        </button>
      </form>
    </main>
  );
}