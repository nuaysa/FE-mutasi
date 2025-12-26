export const statusMap: Record<
  string,
  { label: string; variant: "PRIMARY" | "SECONDARY" | "SUCCESS" | "WARNING" | "DANGER" }
> = {
  ACTIVE: {
    label: "Aktif",
    variant: "SUCCESS",
  },
  INACTIVE: {
    label: "Tidak Aktif",
    variant: "WARNING",
  },
  ALUMNI: {
    label: "Alumni",
    variant: "PRIMARY",
  },
  DROPPED: {
    label: "Keluar",
    variant: "DANGER",
  },
  MUTATION: {
    label: "Pindah",
    variant: "SECONDARY",
  },
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
