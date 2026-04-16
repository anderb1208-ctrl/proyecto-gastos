# LEGION - Sistema de Registro y Control de Gastos

## Descripción
LEGION es una aplicación web desarrollada para el registro, control y visualización de gastos personales o empresariales por categorías.

El sistema permite registrar gastos manualmente, importar información desde archivos Excel, definir presupuestos por categoría, visualizar comparativas mediante gráficas y exportar reportes.

---

## Características principales

Registro manual de gastos
Validación de campos obligatorios
Validación de fechas futuras
Presupuesto por categoría
Alertas al superar el presupuesto
Importación de gastos desde Excel (.xlsx)
Exportación de gastos a Excel
Visualización gráfica de gastos vs presupuesto
Tabla de historial de gastos
Backend API REST para almacenamiento temporal

---

## Tecnologías utilizadas

### Frontend
React.js
Axios
Recharts
XLSX
File Saver
CSS

### Backend
Node.js
Express.js
CORS
Body Parser

---

## Estructura del proyecto
bash
LEGION/
│
├── Backend/
│   ├── server.js
│   ├── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│
└── package.json

---

## Instalación y ejecución

### 1. Clonar repositorio
bash
git clone https://github.com/tuusuario/LEGION.git
cd LEGION

### 2. Ejecutar backend
bash
cd Backend
npm install
node server.js

Servidor disponible en:
bash
http://localhost:4000

### 3. Ejecutar frontend
bash
cd frontend
npm install
npm start

Aplicación disponible en:
bash
http://localhost:3000

---

## Funcionalidades destacadas

### Importación desde Excel
El sistema permite cargar archivos .xlsx con la siguiente estructura:

| Monto | Fecha | Categoría | Descripción |
|--------|--------|------------|-------------|

### Visualización de datos
Incluye gráficas dinámicas para comparar el presupuesto asignado y el gasto real por cada categoría.

---

## Categorías soportadas

Transporte
Comida
Insumos
Otro

---

## Autor

Desarrollado por Anderson Bryan.

Proyecto enfocado en desarrollo web full stack y visualización de datos.
