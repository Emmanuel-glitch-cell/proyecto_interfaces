import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Campos vacíos" });
  }

  const [rows] = await pool.query(
    "SELECT * FROM admin_users WHERE username = ?",
    [username]
  );

  if (rows.length === 0) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const admin = rows[0];
  const match = await bcrypt.compare(password, admin.password_hash);

  if (!match) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token, username: admin.username });
});

export default router;