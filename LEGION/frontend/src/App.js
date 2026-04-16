import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

// Librerías para Excel y gráficas
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ✅ Función para leer archivo Excel e importar datos
const leerArchivoExcel = async (e, setMensaje, setGastos) => {
  const archivo = e.target.files[0];
  if (!archivo) return;

  if (!archivo.name.endsWith(".xlsx")) {
    setMensaje("⚠️ El archivo debe tener extensión .xlsx");
    return;
  }

  try {
    const data = await archivo.arrayBuffer();
    const workbook = XLSX.read(data);
    const hoja = workbook.Sheets[workbook.SheetNames[0]];
    const registros = XLSX.utils.sheet_to_json(hoja);

    const encabezadosEsperados = ["Monto", "Fecha", "Categoría", "Descripción"];
    const encabezados = Object.keys(registros[0] || {});
    const validos = encabezadosEsperados.every((h) => encabezados.includes(h));

    if (!validos) {
      setMensaje(
        "⚠️ El archivo debe contener las columnas: Monto, Fecha, Categoría y Descripción."
      );
      return;
    }

    const nuevosGastos = registros.map((r, i) => ({
      id: Date.now() + i,
      monto: r["Monto"],
      fecha: r["Fecha"],
      categoria: r["Categoría"],
      descripcion: r["Descripción"],
    }));

    setGastos((prev) => [...prev, ...nuevosGastos]);
    setMensaje(`✅ Se importaron ${nuevosGastos.length} registros correctamente.`);
  } catch (error) {
    setMensaje("❌ Error al procesar el archivo Excel.");
    console.error(error);
  }
};

function App() {
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [gastos, setGastos] = useState([]);
  const [mensaje, setMensaje] = useState("");

  // 🧾 Presupuestos por categoría
  const [presupuestos, setPresupuestos] = useState({
    Transporte: 0,
    Comida: 0,
    Insumos: 0,
    Otro: 0,
  });

  // 🎯 Validación de fechas
  const esFechaValida = (fechaStr) => {
    const fechaSeleccionada = new Date(fechaStr);
    const hoy = new Date();
    fechaSeleccionada.setHours(0, 0, 0, 0);
    hoy.setHours(0, 0, 0, 0);
    return fechaSeleccionada <= hoy;
  };

  const guardarGasto = (e) => {
    e.preventDefault();

    if (!monto || !fecha || !categoria) {
      setMensaje("Completa monto, fecha y categoría.");
      return;
    }

    if (Number(monto) <= 0) {
      setMensaje("El monto debe ser mayor a 0.");
      return;
    }

    if (!esFechaValida(fecha)) {
      setMensaje("⚠️ No puedes registrar gastos con una fecha futura.");
      return;
    }

    const nuevoGasto = {
      id: Date.now(),
      monto: parseFloat(monto),
      fecha,
      categoria,
      descripcion,
    };

    setGastos([...gastos, nuevoGasto]);
    setMensaje("✅ Gasto registrado correctamente.");
    setMonto("");
    setFecha("");
    setCategoria("");
    setDescripcion("");
  };

  // 🚨 Alerta de presupuesto superado
  useEffect(() => {
    const resumen = gastos.reduce((acc, g) => {
      acc[g.categoria] = (acc[g.categoria] || 0) + g.monto;
      return acc;
    }, {});

    Object.keys(presupuestos).forEach((cat) => {
      if (presupuestos[cat] > 0 && resumen[cat] > presupuestos[cat]) {
        setMensaje(`⚠️ Has superado el presupuesto de ${cat}.`);
      }
    });
  }, [gastos, presupuestos]);

  // 📊 Datos para la gráfica
  const datosGrafico = Object.keys(presupuestos).map((cat) => {
    const gastado = gastos
      .filter((g) => g.categoria === cat)
      .reduce((sum, g) => sum + g.monto, 0);
    return {
      categoria: cat,
      presupuesto: presupuestos[cat],
      gastado,
    };
  });

  // 📥 Exportar a Excel
  const exportarExcel = () => {
    if (gastos.length === 0) {
      setMensaje("No hay gastos para exportar.");
      return;
    }

    const hoja = XLSX.utils.json_to_sheet(gastos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Gastos");
    const excelBuffer = XLSX.write(libro, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(blob, `gastos_${new Date().toISOString().slice(0, 10)}.xlsx`);
    setMensaje("📤 Gastos exportados exitosamente.");
  };

  return (
    <div className="container">
      <h1>💰 Registro de Gastos - Legión</h1>

      <form className="formulario" onSubmit={guardarGasto}>
        <label>Monto:</label>
        <input
          type="number"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          required
        />

        <label>Fecha:</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />

        <label>Categoría:</label>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
        >
          <option value="">Seleccione una categoría</option>
          <option value="Transporte">Transporte</option>
          <option value="Comida">Comida</option>
          <option value="Insumos">Insumos</option>
          <option value="Otro">Otro</option>
        </select>

        <label>Descripción:</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Escribe detalles opcionales"
        />

        <button type="submit">Registrar Gasto</button>
      </form>

      {mensaje && <p className="mensaje">{mensaje}</p>}

      <hr />

      <h2>📥 Importar gastos desde Excel</h2>
      <input
        type="file"
        accept=".xlsx"
        onChange={(e) => leerArchivoExcel(e, setMensaje, setGastos)}
      />
      <p style={{ fontSize: "13px", color: "#666" }}>
        Formato requerido: columnas <strong>Monto, Fecha, Categoría, Descripción</strong>.
      </p>

      <hr />

      <h2>📊 Presupuestos por categoría</h2>
      {Object.keys(presupuestos).map((cat) => (
        <div key={cat}>
          <label>
            {cat}:
            <input
              type="number"
              value={presupuestos[cat]}
              onChange={(e) =>
                setPresupuestos({
                  ...presupuestos,
                  [cat]: Number(e.target.value),
                })
              }
              placeholder="Define tu presupuesto"
            />
          </label>
        </div>
      ))}

      <hr />

      <h2>📈 Gasto vs Presupuesto</h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={datosGrafico}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="categoria" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="presupuesto" fill="#82ca9d" name="Presupuesto" />
            <Bar dataKey="gastado" fill="#ff6666" name="Gastado" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <hr />

      <h2>📋 Lista de gastos registrados</h2>
      <button onClick={exportarExcel}>📤 Exportar a Excel</button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Categoría</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
         {gastos.map((g) => (
         <tr
         key={g.id}
         className={
         g.categoria.toLowerCase() === "transporte"
          ? "transporte"
          : g.categoria.toLowerCase() === "comida"
          ? "comida"
          : g.categoria.toLowerCase() === "insumos"
          ? "insumos"
          : "otro"
           }
         >
         <td>{g.id}</td>
         <td>${g.monto}</td>
         <td>{g.fecha}</td>
         <td>{g.categoria}</td>
         <td>{g.descripcion}</td>
         </tr>
          ))}
      </tbody>
      </table>
    </div>
  );
}

export default App;

