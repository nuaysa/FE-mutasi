import Card from "@/components/commons/Card";
import { useUserVM } from "../_viewModel/useUserVm";
import ActionButton from "@/components/commons/ActionButton";
import { renderStatus } from "@/components/commons/Badge/Badge";
import { Eye, EyeClosed } from "lucide-react";

interface UserCardsProps {
  vm: ReturnType<typeof useUserVM>;
}

export default function UserCards({ vm }: UserCardsProps) {
  if (vm.isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <UserCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!vm.User || vm.User.length === 0) {
    return (
      <div className="grid grid-cols-1 my-10">
        <EmptyUserState />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4  mt-3">
      {vm.User.map((user) => (
        <Card key={user.id} className="hover:border-2 hover:border-primary-main hover:shadow-primary-hover">
          <div className="flex justify-between items-start gap-2 py-4">
            <span className="flex gap-2">
              <div className="bg-neutral-gray2 rounded-full h-10 w-10 text-primary-main font-bold flex items-center justify-center">{user.name.charAt(0).toUpperCase()}</div>

              <span className="flex flex-col">
                <div className="flex items-center gap-2">
                  <p className="text-black font-bold text-md">{user.name}</p>
                </div>

                <p className="text-neutral-gray1 text-sm">
                  {user.email} - as {user.role}
                </p>
              </span>
            </span>
            <ActionButton
              onEdit={() => {
                vm.setMode("edit");
                vm.setSelectedItem(user);
                vm.setIsCreateModalOpen(true);
              }}
            />
          </div>
        </Card>
      ))}
    </div>
  );
}
function EmptyUserState() {
  return (
    <Card>
      <div className="flex flex-col items-center justify-center py-14 gap-2 text-center">
        <p className="text-neutral-gray1 font-semibold text-lg">Data User Tidak Ditemukan</p>
        <p className="text-sm text-neutral-gray1 max-w-xs">Silakan tambahkan User</p>
      </div>
    </Card>
  );
}

function UserCardSkeleton() {
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
