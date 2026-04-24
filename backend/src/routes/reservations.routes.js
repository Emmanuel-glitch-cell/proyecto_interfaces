import express from "express";
import { pool } from "../db.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/tables", async (req, res) => {
  const { date, time } = req.query;

  if (!date || !time) {
    return res.status(400).json({ message: "Fecha y hora requeridas" });
  }

  try {
    const [rows] = await pool.query(
      `
      SELECT t.*
      FROM restaurant_tables t
      WHERE t.id NOT IN (
        SELECT r.table_id
        FROM reservations r
        WHERE r.reservation_date = ?
          AND r.status != 'cancelled'
          AND (
            TIME(?) < ADDTIME(r.reservation_time, '03:00:00')
            AND ADDTIME(?, '03:00:00') > r.reservation_time
          )
      )
      ORDER BY t.capacity ASC
      `,
      [date, time, time]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo mesas disponibles" });
  }
});

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        reservations.*,
        restaurant_tables.table_number,
        restaurant_tables.capacity
      FROM reservations
      INNER JOIN restaurant_tables
      ON reservations.table_id = restaurant_tables.id
      ORDER BY reservations.created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo reservas" });
  }
});

// Crear reserva
router.post("/", async (req, res) => {
  const {
    customer_name,
    reservation_date,
    reservation_time,
    table_id,
    guests
  } = req.body;

  if (
    !customer_name ||
    !reservation_date ||
    !reservation_time ||
    !table_id ||
    !guests
  ) {
    return res.status(400).json({ message: "Campos incompletos" });
  }

  try {
    const [tableRows] = await pool.query(
      "SELECT * FROM restaurant_tables WHERE id = ?",
      [table_id]
    );

    if (tableRows.length === 0) {
      return res.status(404).json({ message: "Mesa no encontrada" });
    }

    const table = tableRows[0];

    if (Number(guests) > Number(table.capacity)) {
      return res.status(400).json({ message: "La mesa no soporta esa cantidad de comensales" });
    }

    const [existing] = await pool.query(
      `
      SELECT * FROM reservations
      WHERE reservation_date = ?
        AND table_id = ?
        AND status != 'cancelled'
        AND (
          TIME(?) < ADDTIME(reservation_time, '03:00:00')
          AND ADDTIME(?, '03:00:00') > reservation_time
        )
      `,
      [reservation_date, table_id, reservation_time, reservation_time]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "Esa mesa ya está reservada en ese rango de tiempo"
      });
    }

    await pool.query(
      `
      INSERT INTO reservations
      (customer_name, reservation_date, reservation_time, table_id, guests)
      VALUES (?, ?, ?, ?, ?)
      `,
      [customer_name, reservation_date, reservation_time, table_id, guests]
    );

    res.json({ message: "Reserva creada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creando reserva" });
  }
});

// Aprobar / cancelar reserva
router.put("/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["pending", "confirmed", "cancelled"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Estado inválido" });
  }

  try {
    await pool.query(
      `
      UPDATE reservations
      SET status = ?
      WHERE id = ?
      `,
      [status, id]
    );

    res.json({
      message:
        status === "confirmed"
          ? "Reserva aprobada correctamente"
          : "Reserva cancelada correctamente"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error actualizando reserva" });
  }
});

export default router;