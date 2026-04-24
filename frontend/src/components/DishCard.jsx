export default function DishCard({ dish, onAdd }) {
  return (
    <article className="bg-white rounded-3xl shadow p-4 border">
      <img src={dish.image_url} alt={dish.name} className="w-full h-48 object-cover rounded-2xl mb-4" />
      <h3 className="text-xl font-bold">{dish.name}</h3>
      <p className="text-sm text-stone-600">{dish.description}</p>
      <div className="flex justify-between items-center mt-4">
        <div>
          <p className="font-semibold">S/ {Number(dish.price).toFixed(2)}</p>
          <p className="text-xs text-stone-500">Stock: {dish.stock}</p>
        </div>
        <button
          disabled={dish.stock <= 0}
          onClick={() => onAdd(dish)}
          className="px-4 py-2 rounded-xl bg-amber-500 text-white disabled:opacity-50 hover:cursor-pointer hover:scale-105"
        >
          Agregar
        </button>
      </div>
    </article>
  );
}