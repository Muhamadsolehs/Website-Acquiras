import _ from "lodash";
import { icons } from "@/components/Base/Lucide";

export interface Category {
  name: string;
  icon: keyof typeof icons;
  tags: string[];
  slug: string;
  isActive: boolean;
}

const fakers = {
  fakeCategories() {
    const categories: Array<Category> = [
      {
        name: "Kualitas Produk",
        icon: "BadgeCheck",
        tags: ["Kualitas", "Standar", "Mutu"],
        slug: "kualitas-produk",
        isActive: true,
      },
      {
        name: "Pelayanan Pelanggan",
        icon: "Headphones",
        tags: ["Customer Service", "Respon Cepat", "Support"],
        slug: "pelayanan-pelanggan",
        isActive: true,
      },
      {
        name: "Ketepatan Waktu",
        icon: "Clock",
        tags: ["Deadline", "Efisiensi", "Komitmen"],
        slug: "ketepatan-waktu",
        isActive: true,
      },
      {
        name: "Harga & Nilai",
        icon: "DollarSign",
        tags: ["Harga", "Keterjangkauan", "Value"],
        slug: "harga-dan-nilai",
        isActive: false,
      },
      {
        name: "Inovasi Produk",
        icon: "Lightbulb",
        tags: ["Ide Baru", "Kreativitas", "Perkembangan"],
        slug: "inovasi-produk",
        isActive: true,
      },
      {
        name: "Kepuasan Pelanggan",
        icon: "Smile",
        tags: ["Feedback", "Pengalaman", "Loyalitas"],
        slug: "kepuasan-pelanggan",
        isActive: true,
      },
      {
        name: "Dukungan Teknis",
        icon: "Wrench",
        tags: ["Maintenance", "Teknologi", "Perbaikan"],
        slug: "dukungan-teknis",
        isActive: true,
      },
      {
        name: "Keamanan Data",
        icon: "ShieldCheck",
        tags: ["Privasi", "Enkripsi", "Proteksi"],
        slug: "keamanan-data",
        isActive: true,
      },
      {
        name: "Ketersediaan Stok",
        icon: "Boxes",
        tags: ["Inventori", "Manajemen", "Supply Chain"],
        slug: "ketersediaan-stok",
        isActive: false,
      },
      {
        name: "Tanggung Jawab Sosial",
        icon: "Users",
        tags: ["Etika", "CSR", "Komunitas"],
        slug: "tanggung-jawab-sosial",
        isActive: true,
      },
    ];

    return _.shuffle(categories);
  },
};

export default fakers;
