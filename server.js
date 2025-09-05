require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// health
app.get("/", (req, res) => res.json({ ok: true, env: process.env.DB_DIALECT || "postgres" }));

const PORT = process.env.PORT || 3000;
async function start() {
  await sequelize.sync({ alter: true }); // change to {force:true} in dev only if you want to reset DB
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
start().catch((err) => {
  console.error(err);
  process.exit(1);
});
