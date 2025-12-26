"use client";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import AuthContextProvider from "@/contexts/AuthContext";
import Layout from "../components/layout";
import ToastProvider from "../contexts/ToastContext";

const urbanist = Urbanist({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";

  return (
    <html lang="en">
      <body className={urbanist.className}>
        <ToastProvider position={"top-center"}>
          <AuthContextProvider>
              {isLoginPage ? children : <Layout>{children}</Layout>}
           </AuthContextProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
