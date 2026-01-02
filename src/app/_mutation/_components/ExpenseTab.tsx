export default function ExpenseTabs({
  value,
  onChange,
}: {
  value: "santri" | "umum";
  onChange: (v: "santri" | "umum") => void;
}) {
  return (
    <div className="mb-4 rounded-xl bg-muted p-1 gap-2 flex">
      <button
        type="button"
        onClick={() => onChange("santri")}
        className={[
          "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition",
          value === "santri"
            ? "bg-white shadow text-primary-main"
            : "text-neutral-gray1 bg-neutral-gray2 hover:bg-neutral-gray3",
        ].join(" ")}
      >
        Pengeluaran Santri
      </button>

      <button
        type="button"
        onClick={() => onChange("umum")}
        className={[
          "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition",
          value === "umum"
            ? "bg-white shadow text-primary-main"
            : "text-neutral-gray1 bg-neutral-gray2 hover:bg-neutral-gray3",
        ].join(" ")}
      >
        Pengeluaran Umum
      </button>
    </div>
  );
}
