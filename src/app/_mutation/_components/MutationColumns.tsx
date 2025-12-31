import type { Field } from "@/components/commons/Form/Form";
import type { Column } from "@/components/commons/Table/Table";
import type { Mutation } from "../model";
import { formatDate, formatPriceDisplay } from "@/utils/helpers";
import { MutationFormValue } from "./MutationSchema";
import ActionButton from "@/components/commons/ActionButton";
import { useMutationVM } from "../_viewModel/useMutationVm";

export const getMutationColumns = (vm: ReturnType<typeof useMutationVM>): Column<Mutation>[] => [
  {
    header: "Tanggal",
    accessor: "date",
    render: (row) => formatDate({ date: row.date }),
  },
  { header: "Kategori / Sumber", accessor: "category", render: (row) => row.category?.name ?? "-" },
  {
    header: "Subjek",
    accessor: "santri",
    render: (row) => row.santri?.name ?? row.vendor?.name ?? "-",
  },
  { header: "Keterangan", accessor: "description", render: (row) => row.description ?? "-" },
  {
    header: "Jumlah",
    accessor: "amount",
    render: (row) => {
      const price = formatPriceDisplay({
        amount: row.amount,
        type: row.type,
      });

      return <span>{price}</span>;
    },
  },
  {
    header: "Aksi",
    accessor: "id",
    fixedRight: true,
    align: "center",
    render: (row: Mutation) => (
      <ActionButton
        variant="PRIMARY"
        onDownload={() => {
          vm.handleDownloadPdf(row);
        }}
      />
    ),
  },
];

export const sharedFields: Field<MutationFormValue>[] = [
  {
    name: "santriId",
    label: "Pilih Santri (Opsional)",
    type: "select",
    placeholder: "Pilih Santri (Opsional)",
  },
  {
    name: "date",
    label: "Tanggal",
    type: "date",
    dateType: "single",
    required: true,
    placeholder: "Masukkan Tanggal Mutasi",
  },
  {
    name: "amount",
    label: "Nominal (Rp)",
    type: "price",
    placeholder: "Masukkan Nominal (Rp)",
    required: true,
  },
  {
    name: "purpose",
    label: "Tujuan Mutasi",
    type: "select",
    placeholder: "Pilih Tujuan Mutasi",
    required: true,
  },
  {
    name: "description",
    label: "Keterangan",
    type: "textarea",
    placeholder: "Masukkan Keterangan",
  },
];

export const incomeFields: Field<MutationFormValue>[] = [
  {
    name: "categoryId",
    label: "Sumber Pemasukan",
    type: "select",
    placeholder: "Pilih Sumber Pemasukan",
    required: true,
  },
  {
    name: "debtId",
    label: "Bayar Hutang (Opsional)",
    type: "select",
    placeholder: "Pilih Hutang",
  },
];

export const expenseFields: Field<MutationFormValue>[] = [
  {
    name: "categoryId",
    label: "Kategori Rutin / Tahunan",
    type: "select",
    placeholder: "Masukkan Kategori Rutin / Tahunan",
    required: true,
  },
  {
    name: "vendorId",
    label: "Vendor / Penerima",
    type: "select",
    placeholder: "Masukkan Nama vendor / Penerima",
  },
];
