"use client";
import type { ReactNode } from "react";
import Header from "./Header";
import { useIsMobile } from "@/hooks/useIsMobile";
import MobileHeader from "./MobileHeader";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen h-full px-2 bg-neutral-gray4">
        <MobileHeader />
        <div className="w-full pt-5">{children}</div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col min-h-screen h-full bg-neutral-gray4">
        <Header />
        <div className="py-4 md:pt-18 md:px-52 md:py-6 w-full">{children}</div>
      </div>
    );
  }
}
