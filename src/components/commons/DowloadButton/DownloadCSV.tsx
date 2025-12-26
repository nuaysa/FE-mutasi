"use client";
import Papa from "papaparse";

export default function downloadCSVFromRawData(
  rawData: object[] | object,
  fileName: string
): void {
  const dataArray = Array.isArray(rawData) ? rawData : [rawData];
  if (dataArray.length === 0) return;

  const flattened = dataArray.map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([key, val]) => {
        let value: string;

        if (Array.isArray(val)) {
          value = val
            .map((v) =>
              typeof v === "object" && v !== null
                ? JSON.stringify(v)
                : String(v ?? "")
            )
            .join(",\n");
        } else if (typeof val === "object" && val !== null) {
          value = JSON.stringify(val);
        } else {
          value = String(val ?? "");
        }

        return [key, value];
      })
    )
  );

  const csv = Papa.unparse(flattened, { delimiter: ";" });
  downloadCSVFile(csv, fileName);
}

function downloadCSVFile(csvContent: string, fileName: string): void {
  if (typeof window === "undefined") return;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

// export function mapGraphDataToCSV(graphs: DashboardEventGraph[]) {
//   if (!graphs || graphs.length === 0) return [];

//   const graph = graphs[0];
//   const labels = graph.labels;
//   const datasets = graph.datasets;

//   return labels.map((label, i) => {
//     const row: Record<string, string | number | null> = { label };
//     datasets.forEach((dataset) => {
//       row[dataset.campaignName] = dataset.values[i] ?? "";
//     });
//     return row;
//   });
// }

// export function mapEventHitGraphToCSV(data: EventHitGraph | null) {
//   if (!data || !data.labels || data.labels.length === 0) return [];

//   const labels = data.labels;
//   const events = data.dataset?.events || [];

//   return labels.map((label, i) => {
//     const row: Record<string, string | number | null> = { label };
//     events.forEach((event) => {
//       row[event.name] = event.values[i] ?? "";
//     });
//     return row;
//   });
// }
