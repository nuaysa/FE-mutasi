import { Santri } from "@/app/santri/model";


export const dummySantri: Santri[] = [
  {
    id: "1",
    name: "Ahmad Fauzi",
    class: "12 IPA",
    generation: 2023,
    deposit: 1500000,
    debt: [
      {
        id: "d1",
        amount: 50000,
        info: "Pinjam untuk beli buku pelajaran"
      },
      {
        id: "d2",
        amount: 75000,
        info: "Uang transport minggu lalu"
      }
    ],
    total: 1425000, // deposit - total debt
    history: [
      {
        id: "h1",
        santriId: 1,
        date: "2024-01-15",
        amount: 200000,
        item: "Pembayaran SPP"
      },
      {
        id: "h2",
        santriId: 1,
        date: "2024-01-10",
        amount: -50000,
        item: "Pinjaman kas"
      },
      {
        id: "h3",
        santriId: 1,
        date: "2024-01-05",
        amount: 300000,
        item: "Setoran awal"
      }
    ]
  },
  {
    id: "2",
    name: "Siti Nurhaliza",
    class: "11 IPS",
    generation: 2024,
    deposit: 2000000,
    debt: [
      {
        id: "d3",
        amount: 100000,
        info: "Bayar field trip"
      }
    ],
    total: 1900000,
    history: [
      {
        id: "h4",
        santriId: 2,
        date: "2024-01-20",
        amount: 500000,
        item: "Setoran dari orang tua"
      },
      {
        id: "h5",
        santriId: 2,
        date: "2024-01-18",
        amount: -100000,
        item: "Pinjaman untuk trip"
      }
    ]
  },
  {
    id: "3",
    name: "Budi Santoso",
    class: "10 MIPA",
    generation: 2025,
    deposit: 500000,
    debt: [],
    total: 500000,
    history: [
      {
        id: "h6",
        santriId: 3,
        date: "2024-01-25",
        amount: 500000,
        item: "Setoran awal"
      }
    ]
  },
  {
    id: "4",
    name: "Rina Amelia",
    class: "12 IPA",
    generation: 2023,
    deposit: 1200000,
    debt: [
      {
        id: "d4",
        amount: 25000,
        info: "Beli alat tulis"
      },
      {
        id: "d5",
        amount: 50000,
        info: "Foto dokumentasi"
      },
      {
        id: "d6",
        amount: 75000,
        info: "Iuran kelas"
      }
    ],
    total: 1050000,
    history: [
      {
        id: "h7",
        santriId: 4,
        date: "2024-01-22",
        amount: 200000,
        item: "Tambahan setoran"
      },
      {
        id: "h8",
        santriId: 4,
        date: "2024-01-15",
        amount: 1000000,
        item: "Setoran awal"
      },
      {
        id: "h9",
        santriId: 4,
        date: "2024-01-10",
        amount: -25000,
        item: "Beli alat tulis"
      }
    ]
  },
  {
    id: "5",
    name: "Muhammad Ali",
    class: "11 Bahasa",
    generation: 2024,
    deposit: 800000,
    debt: [],
    total: 800000,
    history: [
      {
        id: "h10",
        santriId: 5,
        date: "2024-01-30",
        amount: 300000,
        item: "Setoran"
      },
      {
        id: "h11",
        santriId: 5,
        date: "2024-01-28",
        amount: 500000,
        item: "Setoran awal"
      }
    ]
  },
  {
    id: "6",
    name: "Dewi Lestari",
    class: "10 IPS",
    generation: 2025,
    deposit: 3000000,
    debt: [
      {
        id: "d7",
        amount: 200000,
        info: "Dana darurat kesehatan"
      }
    ],
    total: 2800000,
    history: [
      {
        id: "h12",
        santriId: 6,
        date: "2024-02-01",
        amount: 1000000,
        item: "Tambahan setoran"
      },
      {
        id: "h13",
        santriId: 6,
        date: "2024-01-25",
        amount: 2000000,
        item: "Setoran awal"
      },
      {
        id: "h14",
        santriId: 6,
        date: "2024-01-20",
        amount: -200000,
        item: "Pinjaman untuk obat"
      }
    ]
  },
  {
    id: "7",
    name: "Joko Widodo",
    class: "12 IPS",
    generation: 2023,
    deposit: 0,
    debt: [
      {
        id: "d8",
        amount: 150000,
        info: "Uang makan 3 hari"
      },
      {
        id: "d9",
        amount: 50000,
        info: "Transport"
      }
    ],
    total: -200000,
    history: [
      {
        id: "h15",
        santriId: 7,
        date: "2024-01-05",
        amount: -150000,
        item: "Pinjaman makan"
      },
      {
        id: "h16",
        santriId: 7,
        date: "2024-01-03",
        amount: -50000,
        item: "Pinjaman transport"
      }
    ]
  }
];

// Contoh fungsi untuk menghitung total otomatis
export function calculateTotal(santri: Santri): number {
  const totalDebt = santri.debt?.reduce((sum, d) => sum + d.amount, 0) || 0;
  return (santri.deposit || 0) - totalDebt;
}

// Update semua total di dummy data
dummySantri.forEach(santri => {
  santri.total = calculateTotal(santri);
});

// Data dummy untuk testing (tanpa history/debt lengkap)
export const simpleSantri: Santri[] = [
  {
    id: "8",
    name: "Test Santri 1",
    class: "10 IPA",
    generation: 2025,
    deposit: 1000000
  },
  {
    id: "9",
    name: "Test Santri 2",
    class: "11 IPA",
    generation: 2024,
    deposit: 1500000
  },
  {
    id: "10",
    name: "Test Santri 3",
    class: "12 IPA",
    generation: 2023,
    deposit: 2000000
  }
];