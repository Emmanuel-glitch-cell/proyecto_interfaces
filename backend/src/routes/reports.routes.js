import { Router } from "express";
import { pool } from "../db.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/top-dishes", verifyAdmin, async (_, res) => {
  const [rows] = await pool.query(`
    SELECT d.name, SUM(oi.quantity) AS total_vendido
    FROM order_items oi
    JOIN dishes d ON d.id = oi.dish_id
    GROUP BY d.name
    ORDER BY total_vendido DESC
    LIMIT 10
  `);
  res.json(rows);
});

router.get("/reservations-summary", verifyAdmin, async (_, res) => {
  const [rows] = await pool.query(`
    SELECT reservation_date, COUNT(*) AS total_reservas
    FROM reservations
    GROUP BY reservation_date
    ORDER BY reservation_date DESC
    LIMIT 10
  `);
  res.json(rows);
});

export default router;