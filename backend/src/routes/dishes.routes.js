import { Router } from "express";
import { pool } from "../db.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", async (_, res) => {
  const [rows] = await pool.query("SELECT * FROM dishes WHERE active = 1 ORDER BY id DESC");
  res.json(rows);
});

router.post("/", verifyAdmin, async (req, res) => {
  const { name, description, price, stock, image_url, category } = req.body;

  if (!name || !description || !price || stock === undefined || !image_url || !category) {
    return res.status(400).json({ message: "Campos vacíos" });
  }

  const [result] = await pool.query(
    "INSERT INTO dishes (name, description, price, stock, image_url, category) VALUES (?, ?, ?, ?, ?, ?)",
    [name, description, price, stock, image_url, category]
  );

  res.status(201).json({ id: result.insertId, message: "Plato creado" });
});

router.put("/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, image_url, category, active } = req.body;

  await pool.query(
    `UPDATE dishes
     SET name=?, description=?, price=?, stock=?, image_url=?, category=?, active=?
     WHERE id=?`,
    [name, description, price, stock, image_url, category, active, id]
  );

  res.json({ message: "Plato actualizado" });
});

router.delete("/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;
  await pool.query("UPDATE dishes SET active = 0 WHERE id = ?", [id]);
  res.json({ message: "Plato eliminado" });
});

export default router;