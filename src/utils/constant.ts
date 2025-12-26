export const statusMap: Record<
  string,
  {
    label: string;
    variant: "PRIMARY" | "SECONDARY" | "SUCCESS" | "WARNING" | "DANGER";
  }
> = {
  active: {
    label: "Aktif",
    variant: "SUCCESS",
  },
  inactive: {
    label: "Cuti",
    variant: "WARNING",
  },
  graduated: {
    label: "Lulus",
    variant: "PRIMARY",
  },
  stopped: {
    label: "Keluar",
    variant: "DANGER",
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
