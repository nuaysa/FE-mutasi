type BadgeVariant = "DANGER" | "WARNING" | "SUCCESS" | "SECONDARY" | undefined;

export const statusMap: Record<string, { label: string; variant: BadgeVariant }> = {
  lunas: { label: "LUNAS", variant: "SUCCESS" },
  gagal: { label: "GAGAL", variant: "DANGER" },
  sukses: { label: "SUKSES", variant: "WARNING" },
};

export const ALIGN_CLASS = {
  left: "text-left justify-start",
  center: "text-center justify-center",
  right: "text-right justify-end",
};

export const PATHS = {
  home: "/",
  login: "/login",
};

export const ROLE = {
  SUPERADMIN: "superadmin",
  ADMIN: "admin",
  USER: "user",
};
