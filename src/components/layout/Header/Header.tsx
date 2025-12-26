"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { cn } from "@/utils/helpers";
import { LogOut } from "lucide-react";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { userProfile, logout } = useAuthContext();
  const profile = userProfile?.name.toUpperCase().charAt(0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    {
      name: "Mutasi",
      href: "/",
      // Exact match untuk home page
      isActive: pathname === "/",
    },
    {
      name: "Lap. Santri",
      href: "/santri",
      // Active jika pathname dimulai dengan /santri
      isActive: pathname?.startsWith("/santri"),
    },
    {
      name: "Pengaturan",
      href: "/pengaturan",
      // Active jika pathname dimulai dengan /pengaturan
      isActive: pathname?.startsWith("/pengaturan"),
    },
  ];

  return (
    <header className="w-full fixed top-0 flex items-center justify-between bg-neutral-white border-b px-8 md:px-16 lg:px-24 xl:px-52 h-15">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex cursor-pointer items-center mx-4">
          <Image src="/assets/logo.png" alt="Logo" width={40} height={40} priority />
          <div className="flex flex-col justify-center ml-2">
            <p className="text-lg text-black font-bold leading-tight">Anshorussunnah</p>
            <p className="text-sm text-neutral-gray1 font-light leading-tight">Finance Management</p>
          </div>
        </Link>
      </div>
      
      <div className="flex justify-center items-center gap-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "text-sm font-semibold rounded-lg px-3 py-2 transition-all duration-200",
              item.isActive
                ? "bg-primary-main text-primary-surface"
                : "text-neutral-gray1 hover:bg-primary-main hover:text-primary-surface"
            )}
          >
            {item.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4 py-3">
        <div ref={dropdownRef} className="relative px-2">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={cn(
              "flex items-center gap-2 text-sm py-2 px-3 rounded-lg text-neutral-black transition-colors cursor-pointer hover:bg-neutral-gray4",
              isDropdownOpen ? "bg-neutral-gray3" : ""
            )}
          >
            <div className="flex items-center gap-2">
              <div className="bg-primary-main border border-primary-surface text-white text-sm font-bold rounded-full h-8 w-8 flex items-center justify-center">
                {profile ?? "A"}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{userProfile?.name}</p>
                <p className="text-xs text-neutral-gray1">Admin</p>
              </div>
            </div>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white rounded-lg border border-neutral-gray2 py-3 px-4 shadow-lg z-50 min-w-50">
              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-neutral-gray2">
                <div className="bg-primary-main border border-primary-surface text-white text-base font-bold rounded-full h-10 w-10 flex items-center justify-center">
                  {profile ?? "A"}
                </div>
                <div>
                  <p className="text-sm font-semibold">{userProfile?.name}</p>
                  <p className="text-xs text-neutral-gray1">Admin</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsDropdownOpen(false);
                  logout();
                }}
                className="flex items-center gap-2 text-sm text-semantic-red1 hover:bg-semantic-red3 w-full px-2 py-2 rounded transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}