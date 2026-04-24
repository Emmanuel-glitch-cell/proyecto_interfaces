import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.post("/", async (req, res) => {
  const { customer_name, payment_method, items } = req.body;

  if (!customer_name || !payment_method || !items || items.length === 0) {
    return res.status(400).json({ message: "Campos vacíos o carrito vacío" });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    let total = 0;

    for (const item of items) {
      const [dishRows] = await connection.query(
        "SELECT * FROM dishes WHERE id = ? AND active = 1",
        [item.id]
      );

      if (dishRows.length === 0) {
        throw new Error(`Plato no encontrado: ${item.id}`);
      }

      const dish = dishRows[0];

      if (item.quantity > dish.stock) {
        throw new Error(`Stock insuficiente para ${dish.name}`);
      }

      total += Number(dish.price) * item.quantity;
    }

    const [orderResult] = await connection.query(
      "INSERT INTO orders (customer_name, payment_method, total) VALUES (?, ?, ?)",
      [customer_name, payment_method, total]
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      const [dishRows] = await connection.query(
        "SELECT * FROM dishes WHERE id = ?",
        [item.id]
      );

      const dish = dishRows[0];

      await connection.query(
        "INSERT INTO order_items (order_id, dish_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.id, item.quantity, dish.price]
      );

      await connection.query(
        "UPDATE dishes SET stock = stock - ? WHERE id = ?",
        [item.quantity, item.id]
      );
    }

    await connection.commit();
    res.status(201).json({ message: "Compra registrada correctamente", total });
  } catch (error) {
    await connection.rollback();
    res.status(400).json({ message: error.message });
  } finally {
    connection.release();
  }
});

export default router;