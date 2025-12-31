"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { ROLE } from "@/utils/constant";

interface WithAuthOptions {
  role?: string[];
  redirectIfAuthenticated?: string;
  loadingComponent?: React.ReactNode;
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  return function ProtectedComponent(props: P) {
    const { isAuthenticated, isAdmin, isUser, isLoading } =
      useAuthContext();
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
      if (isAuthenticated === false) {
        router.replace("/login");
        return;
      }

      if (isLoading) return;

      if (isAuthenticated && pathname === "/login") {
        router.replace(options?.redirectIfAuthenticated || "/");
        return;
      }

      if (options?.role && options.role.length > 0) {
        const hasRequiredRole = options.role.some(
          (role) =>
            (role === ROLE.ADMIN && isAdmin) ||
            (role === ROLE.USER && isUser)
        );

        if (!hasRequiredRole) {
          router.replace("/");
          return;
        }
      }

      setIsAuthorized(true);
    }, [
      isAuthenticated,
      isAdmin,
      isUser,
      isLoading,
      router,
      pathname,
      options?.role,
      options?.redirectIfAuthenticated,
    ]);

    if (isLoading || isAuthenticated === undefined || !isAuthorized) {
      return (
        options.loadingComponent || (
          <div className="fixed inset-0 flex justify-center items-center bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )
      );
    }

    return <WrappedComponent {...props} />;
  };
}
