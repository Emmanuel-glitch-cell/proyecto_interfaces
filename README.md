# Sistema de Gestión y Reservas - Restaurante Peruano

Este proyecto es una aplicación web full-stack (MERN-like, usando MySQL) diseñada para un restaurante. Permite a los usuarios explorar la carta, gestionar un carrito de compras en tiempo real, realizar reservas de mesas con validación de disponibilidad y cuenta con un panel administrativo completo.

---

## Características Principales

### Experiencia del Cliente
* **Carta Interactiva**: Visualización de platos organizados por categorías con precios y stock actualizado.
* **Carrito de Compras**: Agregar o quitar productos dinámicamente con cálculo automático del total de la compra en tiempo real.
* **Sistema de Reservas Inteligente**: Formulario para reservar mesas ingresando nombre y fecha, impidiendo que otro usuario reserve la misma mesa en el mismo horario.

### Panel de Administración
* **Gestión de Menú**: Mantenimiento completo (CRUD) para agregar, editar o eliminar platos y actualizar el stock.
* **Control de Reservas**: Visualización del estado de las reservas y opción para confirmarlas o cancelarlas.

---

## Tecnologías Utilizadas

* **Frontend**: React, TailwindCSS, Axios, Vite.
* **Backend**: Node.js, Express.js.
* **Base de Datos**: MySQL (Estructura relacional).

---

## Configuración e Instalación

### 1. Configurar la Base de Datos
1. Abre tu herramienta de MySQL (ej. Workbench).
2. Importa y ejecuta el script de base de datos ubicado en: `/backend/database.sql` (esto creará las tablas y cargará datos de prueba).

### 2. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del backend (guíate del archivo `.env.example`) y añade tus credenciales locales:
```env
PORT=4000
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=restaurante_peruano
JWT_SECRET=tu_clave_secreta
```

### 4. Instalar y Desplegar el Backend
```bash
cd backend
npm install
npm start
```

### 5. Instalar y Desplegar el Frontend
```bash
cd ../frontend
npm install
npm run dev
```
