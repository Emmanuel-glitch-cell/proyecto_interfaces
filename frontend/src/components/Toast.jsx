export default function Toast({ message }) {
  if (!message) return null;

  const isError = message.type === "error";

  return (
    <div className="fixed top-5 right-5 z-50 animate-fade-in">
      <div
        className={`max-w-sm rounded-2xl px-4 py-3 shadow-lg border ${
          isError
            ? "bg-red-50 border-red-300 text-red-700"
            : "bg-green-50 border-green-300 text-green-700"
        }`}
      >
        <p className="font-semibold">
          {isError ? "Ocurrió un problema" : "Operación exitosa"}
        </p>
        <p className="text-sm">{message.text}</p>
      </div>
    </div>
  );
}