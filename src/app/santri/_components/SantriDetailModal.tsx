"use client";
import BaseModal from "@/components/commons/BaseModal";
import Table, { type Column } from "@/components/commons/Table/Table";
import { useAuthContext } from "@/contexts/AuthContext";
import { details, Santri } from "../model";
import { formatDate, formatPriceDisplay } from "@/utils/helpers";
import ActionButton from "@/components/commons/ActionButton";
import Card from "@/components/commons/Card";
import { useIsMobile } from "@/hooks/useIsMobile";
import BottomSheetModal from "@/components/commons/BottomSheet";

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  santri: Santri;
}

export default function SantriDetailModal({ isOpen, onClose, santri, onEdit }: EventDetailModalProps) {
  // const { isAdmin, isSuperAdmin, isAuthenticated } = useAuthContext();
  const isMobile = useIsMobile();
  const historyColumns: Column<details>[] = [
    {
      header: "Tanggal",
      accessor: "date",
      render: (row) => formatDate({ date: row.date }),
    },
    {
      header: "Item",
      accessor: "item",
    },
    {
      header: "Jumlah",
      accessor: "amount",
      render: (row) => formatPriceDisplay({ amount: row.amount, type: "none" }),
    },
  ];

  const ModalComponent = isMobile ? BottomSheetModal : BaseModal;

  return (
    <ModalComponent
        isOpen={isOpen}
        onClose={onClose}
        title={
          <span className="flex flex-col">
            <p className="text-black font-bold text-md">{santri.name}</p>
            <p className="text-neutral-gray1 text-sm font-light">
              {santri.class} ・ ANGKATAN {santri.generation}
            </p>
          </span>
        }
        editText="Edit"
        isAction={true}
        onEdit={onEdit}
        // isAction={!!(isAuthenticated && (isSuperAdmin || isAdmin))}
        // onEdit={isAuthenticated && (isSuperAdmin || isAdmin) ? onEdit : undefined}
      >
        <div>
          <div className="flex w-full gap-2">
            <Card className="w-1/2 border-none bg-semantic-green3">
              <div className="flex flex-col">
                <p className="font-bold text-semantic-green1">Saldo Deposit</p>
                <p className="text-black">
                  <span>{formatPriceDisplay({ amount: santri.deposit ?? 0, type: "none" })}</span>
                </p>
              </div>
            </Card>
            <Card className="w-1/2 border-none bg-semantic-red2">
              <div className="flex flex-col">
                <p className="font-bold text-semantic-red1">Total Tunggakan</p>
                <p className="text-black">
                  <span>{formatPriceDisplay({ amount: santri.total ?? 0, type: "none" })}</span>
                </p>
              </div>
            </Card>
          </div>
          <div className=" border-b border-neutral-gray2 py-5">
            <p className="text-neutral-black font-bold text-base pb-5">Rincian Tunggakan</p>
            <div className="bg-neutral-gray4 text-black p-3 rounded-md flex flex-col gap-2">
              {santri?.debt && santri?.debt.length > 0
                ? santri?.debt?.map((debt) => {
                    return (
                      <div key={debt.id} className="flex justify-between  text-black border-b border-neutral-gray2 p-2">
                        <p>{debt.info}</p>
                        <p className="font-bold">{formatPriceDisplay({ amount: debt.amount ?? 0, type: "none" })}</p>
                      </div>
                    );
                  })
                : "Alhamdulillah, tidak ada tunggakan"}
            </div>
          </div>
          <div className=" border-b border-neutral-gray2 py-5">
            <span className="flex items-center mb-5 justify-between">
              <p className="text-neutral-black font-bold text-base">Riwayat Transaksi</p>
              <ActionButton onPrint={() => {}} />
            </span>
            <Table columns={historyColumns} data={santri.history || []} />
          </div>
        </div>
      </ModalComponent>
    );
  
}
