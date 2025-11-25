import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  id: {
    translation: {
      "app.title": "TVRI EMS",
      "login.title": "Masuk ke Sistem",
      "login.selectRole": "Pilih Peran",
      "login.button": "Masuk",
      "nav.dashboard": "Dasbor",
      "nav.cases": "Daftar Kasus",
      "nav.executions": "Eksekusi",
      "nav.cockpit": "Kokpit Eksekutif",
      "nav.kb": "Basis Pengetahuan",
      "nav.logout": "Keluar",
      
      // Statuses
      "status.NEW": "Baru",
      "status.IN_ASSESSMENT": "Dalam Penilaian",
      "status.REVISION": "Perlu Revisi",
      "status.WAITING_EXEC_DECISION": "Menunggu Putusan",
      "status.APPROVED": "Disetujui",
      "status.REJECTED": "Ditolak",
      "status.COMPLETED": "Selesai",
      
      // Task Statuses
      "task.PENDING": "Menunggu",
      "task.IN_PROGRESS": "Proses",
      "task.OK": "Siap/OK",
      "task.NO": "Tidak Bisa",
      "task.REVISION": "Revisi",
      "task.DONE": "Selesai",

      // Urgency
      "urgency.LOW": "Rendah",
      "urgency.MEDIUM": "Menengah",
      "urgency.HIGH": "Tinggi",
      "urgency.CRITICAL": "Kritis",

      // Case Form
      "case.new": "Buat Kasus Baru",
      "case.tab.new": "Kasus Baru",
      "case.tab.clone": "Tiru Kasus Lama",
      "case.tab.wizard": "Bantuan (Wizard)",
      "case.step.basic": "Informasi Dasar",
      "case.step.review": "Tinjau & Kirim",
      "case.field.title": "Judul Kasus",
      "case.field.desc": "Deskripsi Kebutuhan",
      "case.field.location": "Lokasi",
      "case.field.urgency": "Urgensi",
      "case.field.targetDate": "Target Waktu",
      "case.field.justification": "Justifikasi / Alasan",
      "case.field.attachment": "Link Lampiran (GDrive/Sharepoint)",
      "case.btn.submit": "Ajukan Kasus",
      
      // Case List
      "list.filter": "Filter Status",
      "list.search": "Cari Kasus...",
      "list.sort": "Urutkan",
      
      // Reviewer
      "review.title": "Tinjauan Divisi",
      "review.myInbox": "Kotak Masuk Tugas",
      "review.solutions": "Daftar Solusi Divisi",
      "review.addSolution": "Tambah Solusi",
      "review.requestRevision": "Minta Revisi",
      "review.markSafe": "Tandai OK",
      "review.markFail": "Tandai Tidak Bisa",
      "solution.title": "Judul Solusi",
      "solution.desc": "Deskripsi Teknis",
      "solution.feasible": "Dapat Dilakukan?",
      
      "common.back": "Kembali",
      "common.loading": "Memuat...",
      "common.noData": "Tidak ada data.",
      "common.cancel": "Batal",
      "common.save": "Simpan",
      "roles.admin": "Administrator",
      "roles.requester": "Pemohon (Requester)",
      "roles.reviewer": "Reviewer (Divisi)",
      "roles.executive": "Eksekutif",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "id", 
    fallbackLng: "id",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
