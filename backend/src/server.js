import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import dishesRoutes from "./routes/dishes.routes.js";
import reservationsRoutes from "./routes/reservations.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import reportsRoutes from "./routes/reports.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/dishes", dishesRoutes);
app.use("/api/reservations", reservationsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/admin/reports", reportsRoutes);

app.get("/", (_, res) => {
  res.json({ message: "API restaurante peruano funcionando" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));