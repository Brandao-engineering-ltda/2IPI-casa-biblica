import type { EnrolledUser } from "./admin";

export function exportEnrollmentsCSV(
  courseTitle: string,
  enrollments: EnrolledUser[]
): void {
  const headers = [
    "Nome",
    "E-mail",
    "Telefone",
    "Data da Compra",
    "Forma de Pagamento",
    "Valor (R$)",
    "Status",
  ];

  const rows = enrollments.map((e) => [
    e.fullName,
    e.email,
    e.phone,
    e.purchaseDate,
    e.paymentMethod === "pix" ? "PIX" : "Cartão",
    e.amount.toFixed(2).replace(".", ","),
    e.status === "paid" ? "Pago" : e.status,
  ]);

  const csvContent = [
    headers.join(";"),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(";")
    ),
  ].join("\n");

  // UTF-8 BOM for proper encoding of Portuguese characters in Excel
  const bom = "\uFEFF";
  const blob = new Blob([bom + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const slug = courseTitle
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const date = new Date().toISOString().slice(0, 10);

  const link = document.createElement("a");
  link.href = url;
  link.download = `matriculas-${slug}-${date}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
