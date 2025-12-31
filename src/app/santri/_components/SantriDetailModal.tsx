"use client";
import BaseModal from "@/components/commons/BaseModal";
import Table, { type Column } from "@/components/commons/Table/Table";
import { useAuthContext } from "@/contexts/AuthContext";
import { Santri } from "../model";
import { formatDate, formatPriceDisplay } from "@/utils/helpers";
import ActionButton from "@/components/commons/ActionButton";
import Card from "@/components/commons/Card";
import { useIsMobile } from "@/hooks/useIsMobile";
import BottomSheetModal from "@/components/commons/BottomSheet";
import { Mutation } from "@/app/_mutation/model";
import { purposeMap } from "@/utils/helpers";
import { useSantriVM } from "../_viewModel/useSantriVm";

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  santri: Santri;
}

export default function SantriDetailModal({ isOpen, onClose, santri, onEdit }: EventDetailModalProps) {
  const { isAdmin, isAuthenticated } = useAuthContext();
  const vm = useSantriVM();
  const isMobile = useIsMobile();
  const transactionColumns: Column<Mutation>[] = [
    {
      header: "Tanggal",
      accessor: "createdAt",
      render: (row) => formatDate({ date: row.createdAt ?? "" }),
    },
    {
      header: "Item",
      accessor: "subjek",
      render: (row) => row.category?.name ?? row.vendor?.name ?? "-",
    },
    {
      header: "Keterangan",
      accessor: "subjek",
      render: (row) => purposeMap(row.purpose) ?? "-",
    },
    {
      header: "Jumlah",
      accessor: "amount",
      render: (row) => formatPriceDisplay({ amount: Number(row.amount), type: "none" }),
    },
  ];

  const ModalComponent = isMobile ? BottomSheetModal : BaseModal;

  return (
    <ModalComponent
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="flex flex-col">
          <p className="text-black font-bold text-md">{santri?.name}</p>
          <p className="text-neutral-gray1 text-sm font-light">
            {santri?.grade} ・ ANGKATAN {santri?.generation}
          </p>
        </span>
      }
      editText="Edit"
      isAction={!!(isAuthenticated && isAdmin)}
      onEdit={isAuthenticated && isAdmin ? onEdit : undefined}
    >
      <div>
        <div className="flex w-full gap-2">
          <Card className="w-1/2 border-none bg-semantic-green3">
            <div className="flex flex-col text-semantic-green1">
              <p className="font-bold">Saldo Deposit</p>
              <p>
                <span>{formatPriceDisplay({ amount: santri?.deposit ?? 0, type: "none" })}</span>
              </p>
            </div>
          </Card>
          <Card className="w-1/2 border-none bg-semantic-red2">
            <div className="flex flex-col text-semantic-red1">
              <p className="font-bold">Total Tunggakan</p>
              <p>
                <span>{formatPriceDisplay({ amount: santri?.totalDebt ?? 0, type: "none" })}</span>
              </p>
            </div>
          </Card>
        </div>
        <div className=" border-b border-neutral-gray2 py-5">
          <p className="text-neutral-black font-bold text-base pb-5">Rincian Tunggakan</p>
          <div className="bg-neutral-gray4 text-black p-3 rounded-md flex flex-col gap-2">
            {santri?.debt && santri?.debt.length > 0
              ? santri?.debt?.map((debt) => {
                  if (debt.status === "paid") return "Alhamdulillah, tidak ada tunggakan";
                  else if (debt.status === "open") {
                    return (
                      <div key={debt.id} className="flex justify-between  text-black border-b border-neutral-gray2 p-2">
                        <p>{debt.info}</p>
                        <p className="font-bold">{formatPriceDisplay({ amount: Number(debt.remainingAmount) ?? 0, type: "none" })}</p>
                      </div>
                    );
                  }
                })
              : "Alhamdulillah, tidak ada tunggakan"}
          </div>
        </div>
        <div className=" border-b border-neutral-gray2 py-5">
          <span className="flex items-center mb-5 justify-between">
            <p className="text-neutral-black font-bold text-base">Riwayat Transaksi</p>
            <ActionButton
              onDownload={() => {
                vm.setCurrentSantri(santri);
                vm.handleDownloadSantriReport();
              }}
            />
          </span>
          <Table columns={transactionColumns} data={santri?.transactions ?? []} />
        </div>
      </div>
    </ModalComponent>
  );
}
