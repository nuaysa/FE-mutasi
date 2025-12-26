import type { Field } from "@/components/commons/Form/Form";
import type { Column } from "@/components/commons/Table/Table";
import type { Mutation } from "../model";
import { formatDate, formatPriceDisplay } from "@/utils/helpers";
import { MutationFormValue } from "./MutationSchema";
import ActionButton from "@/components/commons/ActionButton";

export const getMutationColumns = (
): Column<Mutation>[] => [
  {
    header: "Tanggal",
    accessor: "date",
    render: (row) => formatDate({ date: row.date }),
  },
  { header: "Kategori / Sumber", accessor: "category" },
  { header: "vendor / Pihak Ketiga", accessor: "information" },
  { header: "Keterangan", accessor: "description" },
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
        onPrint={
           () => {
                // vm.setIsDeleteModalOpen(true);
              }
              
        }
      />
    ),
  },
];

export const sharedFields: Field<MutationFormValue>[] = [
  {
    name: "date",
    label: "Tanggal",
    type: "date",
    dateType : "single",
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
    name: "description",
    label: "Keterangan",
    type: "textarea",
    placeholder: "Masukkan Keterangan",
  },
];

export const incomeFields: Field<MutationFormValue>[] = [
  {
    name: "category",
    label: "Sumber Pemasukan",
    type: "select",
    placeholder: "Pilih Sumber Pemasukan",
    required: true,
  },
    {
    name: "information",
    label: "Pilih Santri (Opsional)",
    type: "text",
    placeholder: "Pilih Santri (Opsional)",
  },
];

export const outcomeFields: Field<MutationFormValue>[] = [
  {
    name: "category",
    label: "Kategori Rutin / Tahunan",
    type: "select",
    placeholder: "Masukkan Kategori Rutin / Tahunan",
    required: true,
  },
  {
    name: "information",
    label: "Vendor / Penerima",
    type: "text",
    placeholder: "Masukkan Nama vendor / Penerima",
    required: true,
  },
];
