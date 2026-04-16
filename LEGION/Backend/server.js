const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

let gastos = [];

app.post("/api/gastos", (req, res) => {
  const { monto, fecha, categoria, descripcion } = req.body;
  if (!monto || !fecha || !categoria) {
    return res.status(400).json({ mensaje: "Campos obligatorios faltantes" });
  }
  if (monto <= 0) {
    return res.status(400).json({ mensaje: "El monto debe ser mayor a 0" });
  }

  const nuevoGasto = { id: gastos.length + 1, monto, fecha, categoria, descripcion };
  gastos.push(nuevoGasto);

  res.status(201).json({ mensaje: "Gasto registrado exitosamente", gasto: nuevoGasto });
});

app.get("/api/gastos", (req, res) => {
  res.json(gastos);
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});


