export default function Navbar({ section, setSection, cartCount }) {
  const btnClass = (name) =>
    `px-4 py-2 rounded-xl ${section === name ? "bg-stone-900 text-white" : "bg-white border"}`;

  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto p-4 flex flex-wrap gap-3 items-center justify-between">
        <h1 className="font-black text-xl">Restaurante Peruano</h1>
        <nav className="flex flex-wrap gap-2">
          <button className={btnClass("inicio")} onClick={() => setSection("inicio")}>Inicio</button>
          <button className={btnClass("reservas")} onClick={() => setSection("reservas")}>Reservas</button>
          <button className={btnClass("carrito")} onClick={() => setSection("carrito")}>Carrito ({cartCount})</button>
          <button className={btnClass("admin")} onClick={() => setSection("admin")}>Admin</button>
        </nav>
      </div>
    </header>
  );
}