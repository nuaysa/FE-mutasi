import Card from "@/components/commons/Card";
import { useSantriVM } from "../_viewModel/useSantriVm";
import { formatPriceDisplay } from "@/utils/helpers";
import ActionButton from "@/components/commons/ActionButton";
import { renderStatus } from "@/components/commons/Badge/Badge";
import { useAuthContext } from "@/contexts/AuthContext";

interface SantriCardsProps {
  vm: ReturnType<typeof useSantriVM>;
}

export default function SantriCards({ vm }: SantriCardsProps) {
  const { isAdmin } = useAuthContext();
  if (vm.isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SantriCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!vm.santris || vm.santris.length === 0) {
    return (
      <div className="grid grid-cols-1 my-10">
        <EmptySantriState />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4  mt-3">
      {vm.santris.map((santri) => (
        <Card key={santri.id} className="hover:border-2 hover:border-primary-main hover:shadow-primary-hover">
          <div className="flex justify-between items-start gap-2 border-b border-neutral-gray2 pb-3">
            <span className="flex gap-2">
              <div className="bg-neutral-gray2 rounded-full h-10 w-10 text-primary-main font-bold flex items-center justify-center">{santri.name.charAt(0).toUpperCase()}</div>

              <span className="flex flex-col">
                <div className="flex items-center gap-2">
                  <p className="text-black font-bold text-md">{santri.name}</p>
                  {renderStatus(santri.status)}
                </div>

                <p className="text-neutral-gray1 text-sm">
                  {santri.grade} ・ ANGKATAN {santri.generation}
                </p>
              </span>
            </span>
            {isAdmin ? (
              <ActionButton
                onView={() => vm.handleView(santri)}
                onEdit={() => {
                  vm.setMode("edit");
                  vm.setCurrentSantri(santri);
                  vm.setIsCreateModalOpen(true);
                }}
              />
            ) : (
              <ActionButton onView={() => vm.handleView(santri)} />
            )}
          </div>

          <div className="w-full flex gap-2 justify-between items-center pt-4">
            <div className="flex flex-col gap-1 items-center w-1/2">
              <p className="text-sm text-neutral-gray1">Saldo</p>
              <p className="text-md font-extrabold text-semantic-green1">
                {formatPriceDisplay({
                  amount: santri.deposit ?? 0,
                  type: "income",
                })}
              </p>
            </div>

            <div className="flex flex-col gap-1 items-center w-1/2">
              <p className="text-sm text-neutral-gray1">Hutang</p>
              <p className="text-md font-extrabold text-semantic-red1">
                {formatPriceDisplay({
                  amount: santri.totalDebt ?? 0,
                  type: "expense",
                })}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
function EmptySantriState() {
  return (
    <Card>
      <div className="flex flex-col items-center justify-center py-14 gap-2 text-center">
        <p className="text-neutral-gray1 font-semibold text-lg">Data Santri Tidak Ditemukan</p>
        <p className="text-sm text-neutral-gray1 max-w-xs">Silakan tambahkan santri terlebih dahulu untuk mulai mencatat keuangan</p>
      </div>
    </Card>
  );
}

function SantriCardSkeleton() {
  return (
    <Card>
      <div className="animate-pulse space-y-4">
        <div className="flex gap-2 items-center border-b border-neutral-gray2 pb-3">
          <div className="h-6 w-6 rounded-full bg-neutral-gray2" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-neutral-gray2 rounded" />
            <div className="h-3 w-40 bg-neutral-gray2 rounded" />
          </div>
        </div>

        <div className="flex gap-4 pt-2">
          <div className="flex-1 space-y-2 text-center">
            <div className="h-3 w-16 bg-neutral-gray2 mx-auto rounded" />
            <div className="h-4 w-24 bg-neutral-gray2 mx-auto rounded" />
          </div>
          <div className="flex-1 space-y-2 text-center">
            <div className="h-3 w-16 bg-neutral-gray2 mx-auto rounded" />
            <div className="h-4 w-24 bg-neutral-gray2 mx-auto rounded" />
          </div>
        </div>
      </div>
    </Card>
  );
}
