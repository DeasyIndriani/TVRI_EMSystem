

import { Case, CaseTemplate, CaseStatus, Division, Subtask, TaskStatus, User, Log, Urgency, DivisionConfig } from '../types';

// Kept for backward compat in strict mode, but logically we use objects now
export const DIVISIONS: Division[] = ['TEK', 'KEU', 'UMU', 'PRO', 'PUS', 'STA', 'SDM', 'SPI', 'MED'];

export const SEED_DIVISIONS: DivisionConfig[] = [
  { id: 'd1', code: 'TEK', name: 'Teknik & Transmisi', description: 'Menangani infrastruktur teknis, pemancar, broadcast, serta Teknologi Informasi (IT) dan New Media.' },
  { id: 'd2', code: 'KEU', name: 'Keuangan', description: 'Pengelolaan anggaran, pembayaran vendor, dan akuntansi.' },
  { id: 'd3', code: 'UMU', name: 'Umum & Logistik', description: 'Pengadaan barang, keamanan, transportasi, dan fasilitas gedung.' },
  { id: 'd4', code: 'PRO', name: 'Produksi & Berita', description: 'Pembuatan konten program, berita, dan manajemen talent.' },
  { id: 'd5', code: 'PUS', name: 'Pengembangan Usaha', description: 'Pengelolaan aset bisnis, kerjasama, PNBP, dan monetisasi konten.' },
  { id: 'd6', code: 'SDM', name: 'Sumber Daya Manusia', description: 'Rekrutmen, pelatihan, dan administrasi kepegawaian.' },
  { id: 'd7', code: 'SPI', name: 'Satuan Pengawas Internal', description: 'Audit internal dan kepatuhan regulasi.' },
  { id: 'd8', code: 'STA', name: 'Stasiun Daerah', description: 'Koordinasi operasional dan program stasiun penyiaran daerah.' },
  { id: 'd9', code: 'MED', name: 'Media Baru', description: 'Pengembangan layanan digital, OTT (TVRI Klik), media sosial, dan distribusi konten non-konvensional.' },
];

export const CASE_TEMPLATES: CaseTemplate[] = [
  {
    id: 'A',
    name: 'MUX Sparse Backup',
    description: 'Pengadaan dan instalasi backup Multiplexer untuk transmisi digital.',
    requiredDivisions: ['TEK', 'KEU'],
    optionalDivisions: ['UMU', 'SDM']
  },
  {
    id: 'B',
    name: 'Transmisi (TX) Baru',
    description: 'Pembangunan titik transmisi baru di area blank spot.',
    requiredDivisions: ['TEK', 'UMU', 'PRO'],
    optionalDivisions: ['SDM', 'STA']
  },
  {
    id: 'C',
    name: 'Event Besar (HUT/Nasional)',
    description: 'Persiapan teknis dan produksi untuk event skala nasional.',
    requiredDivisions: ['PRO', 'TEK', 'KEU', 'SDM', 'UMU'],
    optionalDivisions: ['PUS', 'MED']
  },
  {
    id: 'D',
    name: 'Upgrade TVRI Klik AI',
    description: 'Implementasi fitur AI generatif pada aplikasi TVRI Klik.',
    requiredDivisions: ['TEK', 'MED', 'KEU'],
    optionalDivisions: ['PRO', 'PUS']
  },
  {
    id: 'E',
    name: 'Visual Studio Virtual',
    description: 'Modernisasi tampilan studio berita dengan teknologi virtual set.',
    requiredDivisions: ['TEK', 'PRO', 'SDM', 'KEU'],
    optionalDivisions: []
  }
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Budi (Admin)', role: 'admin', avatar: 'https://ui-avatars.com/api/?name=Budi+Admin&background=0A64BC&color=fff' },
  { id: 'u2', name: 'Siti (Requester)', role: 'requester', division: 'PRO', avatar: 'https://ui-avatars.com/api/?name=Siti+Req&background=random' },
  { id: 'u3', name: 'Joko (Teknik)', role: 'reviewer', division: 'TEK', avatar: 'https://ui-avatars.com/api/?name=Joko+Tek&background=random' },
  { id: 'u4', name: 'Rina (Keuangan)', role: 'reviewer', division: 'KEU', avatar: 'https://ui-avatars.com/api/?name=Rina+Keu&background=random' },
  { id: 'u5', name: 'Pak Direktur (Exec)', role: 'executive', avatar: 'https://ui-avatars.com/api/?name=Pak+Dir&background=000&color=fff' },
  { id: 'u6', name: 'Dewi (SDM)', role: 'reviewer', division: 'SDM', avatar: 'https://ui-avatars.com/api/?name=Dewi+SDM&background=random' },
  { id: 'u7', name: 'Andi (Umum)', role: 'reviewer', division: 'UMU', avatar: 'https://ui-avatars.com/api/?name=Andi+Umum&background=random' },
  { id: 'u8', name: 'Eko (Teknik IT)', role: 'reviewer', division: 'TEK', avatar: 'https://ui-avatars.com/api/?name=Eko+IT&background=random' },
  { id: 'u9', name: 'Rudi (Bisnis)', role: 'reviewer', division: 'PUS', avatar: 'https://ui-avatars.com/api/?name=Rudi+Bisnis&background=random' },
  { id: 'u10', name: 'Tono (Daerah)', role: 'reviewer', division: 'STA', avatar: 'https://ui-avatars.com/api/?name=Tono+Daerah&background=random' },
  { id: 'u11', name: 'Sarah (Media)', role: 'reviewer', division: 'MED', avatar: 'https://ui-avatars.com/api/?name=Sarah+Media&background=random' },
];

const now = new Date().toISOString();
const d_1 = new Date(Date.now() - 86400000 * 1).toISOString();
const d_3 = new Date(Date.now() - 86400000 * 3).toISOString();
const d_5 = new Date(Date.now() - 86400000 * 5).toISOString();
const d_7 = new Date(Date.now() - 86400000 * 7).toISOString();
const d_14 = new Date(Date.now() - 86400000 * 14).toISOString();
const d_30 = new Date(Date.now() - 86400000 * 30).toISOString();
const d_35 = new Date(Date.now() - 86400000 * 35).toISOString();
const d_40 = new Date(Date.now() - 86400000 * 40).toISOString();
const d_45 = new Date(Date.now() - 86400000 * 45).toISOString();
const d_50 = new Date(Date.now() - 86400000 * 50).toISOString();
const d_60 = new Date(Date.now() - 86400000 * 60).toISOString();

export const SEED_CASES: Case[] = [
  // --- EXISTING ACTIVE CASES ---
  {
    id: 'c-mux-01',
    title: 'Pengadaan MUX Sparse Auto-Switching',
    description: 'Pengadaan perangkat Multiplexer (MUX) cadangan dengan konfigurasi N+1 sparse untuk backup otomatis pada Headend transmisi digital di 3 lokasi kritis (Jakarta, Surabaya, Medan). Bertujuan meminimalisir downtime siaran saat MUX utama mengalami gangguan teknis. Membutuhkan pelatihan teknis mendalam untuk operator daerah.',
    location: 'Headend Jakarta, Surabaya, Medan',
    urgency: Urgency.HIGH,
    targetDate: '2024-12-01',
    justification: 'Sering terjadi gangguan pada MUX utama yang menyebabkan blank siaran > 5 menit. Sesuai regulasi SLA penyiaran digital. SDM daerah belum menguasai sistem switching otomatis.',
    attachmentUrl: 'https://drive.google.com/specs/mux-req-v1.pdf',
    templateId: 'A',
    requesterId: 'u2',
    requesterName: 'Siti (Requester)',
    status: CaseStatus.IN_ASSESSMENT,
    createdAt: d_3,
    updatedAt: d_1,
  },
  {
    id: 'c-event-01',
    title: 'Siaran Langsung HUT RI ke-81 di IKN',
    description: 'Pelaksanaan liputan dan siaran langsung upacara detik-detik proklamasi Kemerdekaan RI ke-81 dari Ibu Kota Nusantara (IKN). Produksi skala masif melibatkan 100+ kru, sewa transponder satelit tambahan, akomodasi VIP, dan dukungan logistik penuh di lokasi baru.',
    location: 'Ibu Kota Nusantara (IKN)',
    urgency: Urgency.CRITICAL,
    targetDate: '2026-08-17',
    justification: 'Mandat negara untuk menyiarkan upacara kenegaraan. HUT RI ke-81 diproyeksikan menjadi perayaan teknologi penyiaran 8K pertama.',
    attachmentUrl: 'https://drive.google.com/event/ikn-hut81-tor.pdf',
    templateId: 'C',
    requesterId: 'u2',
    requesterName: 'Siti (Requester)',
    status: CaseStatus.WAITING_EXEC_DECISION,
    createdAt: d_7,
    updatedAt: d_1,
  },
  {
    id: 'c-klik-01',
    title: 'Upgrade TVRI Klik: Fitur AI Generatif',
    description: 'Pengembangan dan implementasi fitur berbasis AI pada platform OTT TVRI Klik, mencakup: Personalisasi rekomendasi konten user, Auto-captioning berita real-time, dan Chatbot asisten "Tanya TVRI". Memerlukan lisensi Cloud API berbayar.',
    location: 'Pusat Data & Pengembangan Digital',
    urgency: Urgency.HIGH,
    targetDate: '2024-12-20',
    justification: 'Meningkatkan engagement pengguna milenial dan aksesibilitas konten bagi penyandang disabilitas rungu. Kompetitor sudah menggunakan fitur serupa.',
    attachmentUrl: 'https://drive.google.com/dev/ai-roadmap-v2.pdf',
    templateId: 'D',
    requesterId: 'u2',
    requesterName: 'Siti (Requester)',
    status: CaseStatus.IN_EXECUTION,
    executiveDecision: 'APPROVE',
    executiveNote: 'Lanjutkan, pastikan budget cloud terkontrol ketat oleh Keuangan.',
    createdAt: d_14,
    updatedAt: now,
  },
  {
    id: 'c-viz-01',
    title: 'Modernisasi Studio Berita: Vizrt Virtual Set',
    description: 'Pengadaan sistem visual virtual (Vizrt Engine, Camera Tracking, Green Screen Grade A) untuk Studio 3 Berita. Termasuk pelatihan intensif bagi desainer grafis dan operator kamera agar mampu mengoperasikan sistem AR/VR.',
    location: 'Studio 3 Senayan',
    urgency: Urgency.MEDIUM,
    targetDate: '2025-06-01',
    justification: 'Tampilan studio saat ini sudah tertinggal 5 tahun dibanding kompetitor swasta. Efisiensi biaya setting fisik jangka panjang.',
    attachmentUrl: 'https://drive.google.com/studio/design-concept.jpg',
    templateId: 'E',
    requesterId: 'u2',
    requesterName: 'Siti (Requester)',
    status: CaseStatus.IN_EXECUTION,
    executiveDecision: 'APPROVE',
    executiveNote: 'Segera laksanakan. Prioritas untuk mendukung tampilan baru siaran Berita Utama (Prime Time).',
    createdAt: d_7,
    updatedAt: now,
  },
  {
    id: 'c3',
    title: 'Peremajaan Kamera Produksi 4K',
    description: 'Pengadaan 5 unit kamera broadcast resolusi 4K beserta lensa wide dan tele untuk menggantikan unit Sony HDSR yang sudah End of Life (EOL). Digunakan untuk produksi dokumenter dan feature.',
    location: 'Divisi Produksi Berita',
    urgency: Urgency.MEDIUM,
    targetDate: '2024-09-01',
    justification: 'Biaya maintenance kamera lama sudah tidak efisien (sparepart langka).',
    attachmentUrl: 'https://drive.google.com/procurement/camera-list.xlsx',
    templateId: 'custom',
    requesterId: 'u2',
    requesterName: 'Siti (Requester)',
    status: CaseStatus.WAITING_EXEC_DECISION,
    createdAt: d_14,
    updatedAt: d_3,
  },

  // --- NEW COMPLETED CASES FOR KNOWLEDGE BASE (MOCKUP) ---
  
  // KB CASE 1: MCR UPGRADE (Complex Technical + Physical Reno)
  {
    id: 'c-kb-01',
    title: 'Revitalisasi Master Control Room (MCR) Menuju HD',
    description: 'Proyek renovasi total MCR Jakarta mencakup penggantian sistem baseband SDI ke IP (SMPTE 2110), instalasi video wall monitoring baru, serta renovasi fisik ruangan (lantai raised floor, akustik, lighting, dan pendingin presisi). Proyek ini melibatkan pengadaan barang impor dan pekerjaan sipil.',
    location: 'Gedung GPO Lantai 3, Senayan',
    urgency: Urgency.CRITICAL,
    targetDate: '2023-11-01',
    justification: 'Peralatan existing sudah berusia 12 tahun (SD). Kebutuhan siaran HD 1080i diwajibkan oleh regulasi KPI. Sistem pendingin lama sering bocor membahayakan server.',
    attachmentUrl: 'https://docs.tvri.go.id/project/mcr-final-report.pdf',
    templateId: 'custom',
    requesterId: 'u3',
    requesterName: 'Joko (Teknik)',
    status: CaseStatus.COMPLETED,
    executiveDecision: 'APPROVE',
    executiveNote: 'Setujui dengan prioritas utama. Pastikan tidak ada off-air selama migrasi.',
    createdAt: d_60,
    updatedAt: d_30,
  },

  // KB CASE 2: MAJOR EVENT (Production + Security)
  {
    id: 'c-kb-02',
    title: 'Produksi Pool Host Debat Capres 2024 (Putaran 1)',
    description: 'TVRI bertindak sebagai Pool Host penyelenggara siaran Debat Calon Presiden Putaran Pertama. Cakupan pekerjaan: Produksi siaran multicam, distribusi feed ke stasiun TV lain, pengamanan VVIP Ring 1 bersama Paspampres, tata panggung, dan akomodasi kandidat.',
    location: 'Halaman Gedung TVRI Senayan',
    urgency: Urgency.CRITICAL,
    targetDate: '2023-12-12',
    justification: 'Penugasan langsung dari KPU. Mempertaruhkan reputasi lembaga penyiaran publik.',
    attachmentUrl: 'https://docs.tvri.go.id/event/debat-2024-laporan.pdf',
    templateId: 'C',
    requesterId: 'u2',
    requesterName: 'Siti (Requester)',
    status: CaseStatus.COMPLETED,
    executiveDecision: 'APPROVE',
    executiveNote: 'Jaga netralitas dan kualitas teknis zero mistake.',
    createdAt: d_60,
    updatedAt: d_30,
  },

  // KB CASE 3: DIGITAL APP (Software + SDM)
  {
    id: 'c-kb-03',
    title: 'Aplikasi E-Absensi Mobile Pegawai (SI-SDM)',
    description: 'Pengembangan aplikasi mobile (Android/iOS) untuk presensi pegawai berbasis Geotagging dan Face Recognition. Integrasi dengan sistem payroll keuangan. Bertujuan menggantikan mesin fingerprint fisik dan memudahkan pegawai di lapangan/liputan.',
    location: 'Nasional (Seluruh Satker)',
    urgency: Urgency.MEDIUM,
    targetDate: '2024-01-01',
    justification: 'Efisiensi biaya maintenance mesin finger. Akurasi data kehadiran real-time. Mendukung fleksibilitas kerja jurnalis.',
    attachmentUrl: 'https://docs.tvri.go.id/app/manual-absensi.pdf',
    templateId: 'D',
    requesterId: 'u6',
    requesterName: 'Dewi (SDM)',
    status: CaseStatus.COMPLETED,
    executiveDecision: 'APPROVE',
    executiveNote: 'Pastikan keamanan data biometrik pegawai terjamin.',
    createdAt: d_60,
    updatedAt: d_30,
  }
];

export const SEED_SUBTASKS: Subtask[] = [
  // ... (Existing subtasks from previous mock) ...
  // --- SUBTASKS FOR C-MUX-01 ---
  {
    id: 't-mux-1',
    caseId: 'c-mux-01',
    division: 'TEK',
    status: TaskStatus.OK,
    description: '',
    solutions: [{
      id: 's-mux-1', subtaskId: 't-mux-1',
      title: 'Spesifikasi Teknik Harmonic ProStream',
      description: 'Perangkat fully compatible dengan exciter existing. Mendukung IP based switching.',
      isFeasible: true,
      attachmentUrl: 'https://vendor.com/spec/harmonic-x.pdf',
      currentProgress: 0, progressLogs: [], createdAt: d_1, createdBy: 'u3'
    }],
    updatedAt: d_1
  },
  {
    id: 't-mux-2',
    caseId: 'c-mux-01',
    division: 'KEU',
    status: TaskStatus.PENDING,
    description: '',
    solutions: [],
    updatedAt: d_3
  },
  {
    id: 't-mux-3',
    caseId: 'c-mux-01',
    division: 'SDM',
    status: TaskStatus.OK,
    description: '',
    solutions: [{
      id: 's-mux-3', subtaskId: 't-mux-3',
      title: 'Training of Trainers (ToT) Vendor',
      description: 'Vendor wajib menyertakan paket pelatihan 3 hari di Jakarta untuk 6 Kepala Transmisi Daerah.',
      isFeasible: true,
      attachmentUrl: 'https://sdm.tvri/training/tor-mux.pdf',
      currentProgress: 0, progressLogs: [], createdAt: d_1, createdBy: 'u6'
    }],
    updatedAt: d_1
  },

  // --- SUBTASKS FOR C-EVENT-01 (HUT RI 81) ---
  {
    id: 't-evt-1',
    caseId: 'c-event-01',
    division: 'PRO',
    status: TaskStatus.OK,
    description: '',
    solutions: [{
      id: 's-evt-1', subtaskId: 't-evt-1',
      title: 'Rundown Tentatif V5',
      description: 'Durasi siaran 6 jam. Host utama: Presenter AI & Artis Ibukota. Segmen hiburan 30%.',
      isFeasible: true,
      attachmentUrl: 'https://docs.google.com/rundown-ikn-81.pdf',
      currentProgress: 0, progressLogs: [], createdAt: d_3, createdBy: 'u2'
    }],
    updatedAt: d_3
  },
  {
    id: 't-evt-2',
    caseId: 'c-event-01',
    division: 'TEK',
    status: TaskStatus.OK,
    description: '',
    solutions: [{
      id: 's-evt-2', subtaskId: 't-evt-2',
      title: 'Sewa OB Van 4K/8K External',
      description: 'Karena OB Van internal full, sewa unit 24 kamera dari vendor pihak ketiga.',
      isFeasible: true,
      attachmentUrl: 'https://teknik.tvri/vendor/obvan-quote.pdf',
      currentProgress: 0, progressLogs: [], createdAt: d_3, createdBy: 'u3'
    }],
    updatedAt: d_3
  },
  {
    id: 't-evt-3',
    caseId: 'c-event-01',
    division: 'SDM',
    status: TaskStatus.OK,
    description: '',
    solutions: [{
      id: 's-evt-3', subtaskId: 't-evt-3',
      title: 'Rotasi Shift & Akomodasi',
      description: 'Total 120 personil. Penginapan di Mess TVRI IKN (40%) dan Hotel (60%).',
      isFeasible: true,
      attachmentUrl: 'https://sdm.tvri/sppd/list-kru-ikn81.xlsx',
      currentProgress: 0, progressLogs: [], createdAt: d_3, createdBy: 'u6'
    }],
    updatedAt: d_3
  },
  {
    id: 't-evt-4',
    caseId: 'c-event-01',
    division: 'KEU',
    status: TaskStatus.OK,
    description: '',
    solutions: [{
      id: 's-evt-4', subtaskId: 't-evt-4',
      title: 'Pengajuan Anggaran Biaya Tambahan (ABT)',
      description: 'Total RAB IDR 4.5 Milyar. Perlu persetujuan Direksi untuk pos biaya tak terduga.',
      isFeasible: true,
      attachmentUrl: 'https://keu.tvri/rab/hut81-ikn.xlsx',
      currentProgress: 0, progressLogs: [], createdAt: d_1, createdBy: 'u4'
    }],
    updatedAt: d_1
  },
  {
    id: 't-evt-5',
    caseId: 'c-event-01',
    division: 'UMU',
    status: TaskStatus.OK,
    description: '',
    solutions: [{
      id: 's-evt-5', subtaskId: 't-evt-5',
      title: 'Vendor Logistik Lokal IKN',
      description: 'Kerjasama dengan vendor lokal Balikpapan untuk katering 500 porsi/hari dan tenda VVIP.',
      isFeasible: true,
      attachmentUrl: 'https://umum.tvri/kontrak/vendor-logistik.pdf',
      currentProgress: 0, progressLogs: [], createdAt: d_1, createdBy: 'u7'
    }],
    updatedAt: d_1
  },

  // --- SUBTASKS FOR C-KLIK-01 (Moved from DEV to TEK) ---
  {
    id: 't-ai-1',
    caseId: 'c-klik-01',
    division: 'TEK', // Changed from DEV to TEK (IT)
    status: TaskStatus.OK,
    description: '',
    solutions: [
      {
        id: 's-ai-1', subtaskId: 't-ai-1',
        title: 'Backend Microservice AI',
        description: 'Service Python (FastAPI) untuk handling request ke LLM dan caching response.',
        isFeasible: true,
        attachmentUrl: 'https://github.com/tvri-dev/ai-backend',
        currentProgress: 100, 
        progressLogs: [
          { id: 'l-ai-1', solutionId: 's-ai-1', progressPercent: 50, note: 'API Wrapper done', timestamp: d_7, createdBy: 'u8', evidenceUrl: 'https://github.com/tvri-dev/ai-backend/commit/5a7f9' },
          { id: 'l-ai-2', solutionId: 's-ai-1', progressPercent: 100, note: 'Deployed to Staging', timestamp: d_1, createdBy: 'u8', evidenceUrl: 'https://staging-api.tvri.go.id/health' }
        ], 
        createdAt: d_14, createdBy: 'u8'
      },
      {
        id: 's-ai-3', subtaskId: 't-ai-1',
        title: 'Frontend UI Chatbot & Caption',
        description: 'Komponen React untuk floating chat widget dan overlay subtitle.',
        isFeasible: true,
        attachmentUrl: 'https://figma.com/tvri-klik-ai',
        currentProgress: 65,
        progressLogs: [
          { id: 'l-ai-4', solutionId: 's-ai-3', progressPercent: 30, note: 'Mockup approved', timestamp: d_7, createdBy: 'u8', evidenceUrl: 'https://figma.com/proto/tvri-klik-v2' },
          { id: 'l-ai-5', solutionId: 's-ai-3', progressPercent: 65, note: 'Widget integration in progress', timestamp: now, createdBy: 'u8', evidenceUrl: 'https://dev.tvri.go.id/klik/preview-chat' }
        ],
        createdAt: d_14, createdBy: 'u8'
      },
      {
        id: 's-ai-4', subtaskId: 't-ai-1',
        title: 'QA & Stress Testing',
        description: 'Pengujian beban request simultan dan keamanan data user.',
        isFeasible: true,
        attachmentUrl: 'https://jira.tvri/test-plan',
        currentProgress: 15,
        progressLogs: [
           { id: 'l-ai-6', solutionId: 's-ai-4', progressPercent: 15, note: 'Test plan created', timestamp: now, createdBy: 'u8', evidenceUrl: 'https://jira.tvri/browse/TEST-101' }
        ],
        createdAt: d_14, createdBy: 'u8'
      }
    ],
    updatedAt: now
  },
  {
    id: 't-ai-2',
    caseId: 'c-klik-01',
    division: 'TEK', // Existing TEK task
    status: TaskStatus.OK,
    description: '',
    solutions: [{
      id: 's-ai-2', subtaskId: 't-ai-2',
      title: 'Sewa Instance Nvidia A100 GCP',
      description: 'Menggunakan Google Cloud Platform region Jakarta untuk low latency.',
      isFeasible: true,
      attachmentUrl: 'https://cloud.google.com/billing-est.pdf',
      currentProgress: 100, 
      progressLogs: [
        { id: 'l-ai-3', solutionId: 's-ai-2', progressPercent: 100, note: 'Server Provisioned & Active', timestamp: d_3, createdBy: 'u3', evidenceUrl: 'https://console.cloud.google.com/compute/instances' }
      ],
      createdAt: d_14, createdBy: 'u3'
    }],
    updatedAt: now
  },
  {
    id: 't-ai-3',
    caseId: 'c-klik-01',
    division: 'KEU',
    status: TaskStatus.OK,
    description: '',
    solutions: [{
      id: 's-ai-payment', subtaskId: 't-ai-3',
      title: 'Pembayaran Invoice Cloud Q3',
      description: 'Pembayaran termin pertama ke partner reseller Google Cloud.',
      isFeasible: true,
      attachmentUrl: 'https://finance.tvri/invoice/gcp-paid.pdf',
      currentProgress: 80,
      progressLogs: [
          { id: 'l-ai-pay-1', solutionId: 's-ai-payment', progressPercent: 80, note: 'SPP diajukan ke bendahara', timestamp: now, createdBy: 'u4', evidenceUrl: 'https://keu.tvri/spp/2024/09/0056' }
      ],
      createdAt: d_14, createdBy: 'u4'
    }],
    updatedAt: now
  },

  // --- SUBTASKS FOR C-VIZ-01 (UPDATED to IN_EXECUTION) ---
  {
    id: 't-viz-1',
    caseId: 'c-viz-01',
    division: 'TEK',
    status: TaskStatus.OK,
    description: '',
    solutions: [{
      id: 's-viz-1', subtaskId: 't-viz-1',
      title: 'Upgrade Lensa & Sensor Tracking',
      description: 'Kamera existing butuh tambahan sensor tracking Mo-Sys StarTracker dan kalibrasi lensa.',
      isFeasible: true,
      attachmentUrl: 'https://mosys.com/startracker-spec.pdf',
      currentProgress: 45, 
      progressLogs: [
        { id: 'l-viz-1a', solutionId: 's-viz-1', progressPercent: 20, note: 'Survey vendor tracking system selesai', timestamp: d_5, createdBy: 'u3', evidenceUrl: 'https://tek.tvri/survey/mosys-report.pdf' },
        { id: 'l-viz-1b', solutionId: 's-viz-1', progressPercent: 45, note: 'PO diterbitkan ke vendor', timestamp: now, createdBy: 'u3', evidenceUrl: 'https://tek.tvri/po/tracking-sensor.pdf' }
      ], 
      createdAt: d_7, createdBy: 'u3'
    }],
    updatedAt: now
  },
  {
    id: 't-viz-2',
    caseId: 'c-viz-01',
    division: 'PRO',
    status: TaskStatus.OK,
    description: '',
    solutions: [{
      id: 's-viz-2', subtaskId: 't-viz-2',
      title: 'Konsep Minimalis Modern V2',
      description: '3 Opsi desain disiapkan. Render preview terlampir. Aset 3D dibuat menggunakan Unreal Engine.',
      isFeasible: true,
      attachmentUrl: 'https://drive.google.com/design/viz-preview.mp4',
      currentProgress: 90, 
      progressLogs: [
         { id: 'l-viz-2a', solutionId: 's-viz-2', progressPercent: 50, note: 'Desain awal disetujui Direktur Program', timestamp: d_3, createdBy: 'u2', evidenceUrl: 'https://pro.tvri/design/approval-v1.jpg' },
         { id: 'l-viz-2b', solutionId: 's-viz-2', progressPercent: 90, note: 'Final render aset 3D siap integrasi', timestamp: now, createdBy: 'u2', evidenceUrl: 'https://pro.tvri/assets/ue5-package.zip' }
      ], 
      createdAt: d_7, createdBy: 'u2'
    }],
    updatedAt: now
  },
  {
    id: 't-viz-3',
    caseId: 'c-viz-01',
    division: 'SDM',
    status: TaskStatus.OK,
    description: '',
    solutions: [{
      id: 's-viz-3', subtaskId: 't-viz-3',
      title: 'Workshop Vizrt Artist & Engine',
      description: 'Mengirim 4 orang staf grafis untuk sertifikasi Vizrt di Singapura selama 2 minggu.',
      isFeasible: true,
      attachmentUrl: 'https://academy.vizrt.com/training-syllabus.pdf',
      currentProgress: 10, 
      progressLogs: [
          { id: 'l-viz-3a', solutionId: 's-viz-3', progressPercent: 10, note: 'Pendaftaran peserta training', timestamp: now, createdBy: 'u6', evidenceUrl: 'https://sdm.tvri/training/registration-vizrt.pdf' }
      ], 
      createdAt: d_5, createdBy: 'u6'
    }],
    updatedAt: now
  },
  {
    id: 't-viz-4',
    caseId: 'c-viz-01',
    division: 'KEU',
    status: TaskStatus.OK,
    description: '',
    solutions: [{
      id: 's-viz-4', subtaskId: 't-viz-4',
      title: 'Dokumen Lelang Terbuka',
      description: 'HPS (Harga Perkiraan Sendiri) telah disusun sebesar IDR 3.2M. Siap tayang di e-Procurement.',
      isFeasible: true,
      attachmentUrl: 'https://lpse.tvri/proc/dokumen-lelang.pdf',
      currentProgress: 100, 
      progressLogs: [
          { id: 'l-viz-4a', solutionId: 's-viz-4', progressPercent: 100, note: 'Lelang telah tayang di LPSE', timestamp: d_1, createdBy: 'u4', evidenceUrl: 'https://lpse.tvri.go.id/lelang/vizrt-studio' }
      ], 
      createdAt: d_5, createdBy: 'u4'
    }],
    updatedAt: d_1
  },

  // --- SUBTASKS FOR C3 (Kamera 4K) ---
  {
    id: 't5',
    caseId: 'c3',
    division: 'TEK',
    status: TaskStatus.OK,
    description: '',
    solutions: [{ 
      id: 's3', 
      subtaskId: 't5', 
      title: 'Sony FX6 Cinema Line', 
      description: 'Sensor Full-frame, 4K 120fps, High Sensitivity untuk low light. Paket termasuk lensa G-Master.', 
      isFeasible: true, 
      currentProgress: 0, 
      progressLogs:[], 
      createdAt: d_7, 
      createdBy: 'u3',
      attachmentUrl: 'https://www.sony.co.id/en/electronics/professional-video-cameras/ilme-fx6'
    }],
    updatedAt: d_3
  },
  {
    id: 't6',
    caseId: 'c3',
    division: 'KEU',
    status: TaskStatus.OK,
    description: '',
    solutions: [{ 
      id: 's4', 
      subtaskId: 't6', 
      title: 'Alokasi RKAP Belanja Modal 2024', 
      description: 'Anggaran tersedia di pos 512.21 (Peralatan Studio). Estimasi total IDR 850jt.', 
      isFeasible: true, 
      currentProgress: 0, 
      progressLogs:[], 
      createdAt: d_7, 
      createdBy: 'u4',
      attachmentUrl: 'https://drive.google.com/file/d/rkap2024_approval_draft.pdf'
    }],
    updatedAt: d_3
  },

  // --- KB SUBTASKS (COMPLETED - ENHANCED WITH REALISTIC PROGRESS HISTORY) ---

  // KB1: MCR (TEK, KEU, UMU)
  {
    id: 't-kb-1-tek', caseId: 'c-kb-01', division: 'TEK', status: TaskStatus.OK,
    description: '',
    updatedAt: d_30,
    solutions: [
      {
        id: 's-kb-1-tek-1', subtaskId: 't-kb-1-tek', title: 'Integrasi Core Router IP SMPTE 2110',
        description: 'Instalasi Evertz EXE 40GbE Switch sebagai backbone IP MCR. Konfigurasi NMOS registry untuk device discovery.',
        isFeasible: true, currentProgress: 100, createdAt: d_60, createdBy: 'u3',
        attachmentUrl: 'https://tek.tvri/mcr/network-topology-v4.pdf',
        progressLogs: [
            { id: 'pl-kb-1-1a', solutionId: 's-kb-1-tek-1', progressPercent: 25, note: 'Barang tiba di gudang dan cek fisik OK', timestamp: d_50, createdBy: 'u3', evidenceUrl: 'https://logistik.tvri/gr/mcr-arrival-photos.pdf' },
            { id: 'pl-kb-1-1b', solutionId: 's-kb-1-tek-1', progressPercent: 50, note: 'Mounting rack dan cabling fiber optik selesai', timestamp: d_45, createdBy: 'u3', evidenceUrl: 'https://tek.tvri/mcr/rack-diagram.pdf' },
            { id: 'pl-kb-1-1c', solutionId: 's-kb-1-tek-1', progressPercent: 80, note: 'Konfigurasi IP Address dan VLAN Backbone', timestamp: d_40, createdBy: 'u3', evidenceUrl: 'https://tek.tvri/mcr/ip-table.xlsx' },
            { id: 'pl-kb-1-1d', solutionId: 's-kb-1-tek-1', progressPercent: 100, note: 'Uji Fungsi (UTO) Stabil 24 jam', timestamp: d_30, createdBy: 'u3', evidenceUrl: 'https://teknik.tvri/qa/uto-report-signed.pdf' }
        ]
      },
      {
        id: 's-kb-1-tek-2', subtaskId: 't-kb-1-tek', title: 'Sistem Monitoring Multiviewer',
        description: 'Pemasangan TAG Video Multiviewer pada Video Wall 8x4 di ruang kontrol utama untuk monitoring 200 stream sekaligus.',
        isFeasible: true, currentProgress: 100, createdAt: d_60, createdBy: 'u3',
        attachmentUrl: 'https://tek.tvri/mcr/multiviewer-layout.jpg',
        progressLogs: [
            { id: 'pl-kb-1-2a', solutionId: 's-kb-1-tek-2', progressPercent: 40, note: 'Instalasi Video Wall bracket', timestamp: d_45, createdBy: 'u3', evidenceUrl: 'https://tek.tvri/mcr/bracket-installation.jpg' },
            { id: 'pl-kb-1-2b', solutionId: 's-kb-1-tek-2', progressPercent: 100, note: 'Layout operator disetujui dan live', timestamp: d_30, createdBy: 'u3', evidenceUrl: 'https://tek.tvri/mcr/mv-final-layout.png' }
        ]
      }
    ]
  },
  {
    id: 't-kb-1-keu', caseId: 'c-kb-01', division: 'KEU', status: TaskStatus.OK,
    description: '',
    updatedAt: d_30,
    solutions: [
        {
            id: 's-kb-1-keu-1', subtaskId: 't-kb-1-keu', title: 'Pembayaran Uang Muka (DP) 30%',
            description: 'Pencairan uang muka sesuai termin kontrak setelah jaminan pelaksanaan diterima.',
            isFeasible: true, currentProgress: 100, createdAt: d_60, createdBy: 'u4',
            attachmentUrl: 'https://keu.tvri/sp2d/dp-mcr.pdf',
            progressLogs: [{ id: 'pl-kb-1-2a-dp', solutionId: 's-kb-1-keu-1', progressPercent: 100, note: 'DP telah ditransfer via KPPN', timestamp: d_60, createdBy: 'u4', evidenceUrl: 'https://keu.tvri/bukti/transfer-dp-mcr.pdf' }]
        },
        {
            id: 's-kb-1-keu-2', subtaskId: 't-kb-1-keu', title: 'Pelunasan Termin Akhir (70%)',
            description: 'Pembayaran sisa nilai kontrak setelah BAST (Berita Acara Serah Terima) 100% ditandatangani.',
            isFeasible: true, currentProgress: 100, createdAt: d_30, createdBy: 'u4',
            attachmentUrl: 'https://keu.tvri/sp2d/pelunasan-mcr.pdf',
            progressLogs: [
                { id: 'pl-kb-1-3a', solutionId: 's-kb-1-keu-2', progressPercent: 50, note: 'Verifikasi dokumen BAST administrasi', timestamp: d_30, createdBy: 'u4', evidenceUrl: 'https://keu.tvri/verif/bast-checklist.pdf' },
                { id: 'pl-kb-1-3b', solutionId: 's-kb-1-keu-2', progressPercent: 100, note: 'SP2D Terbit, Proyek lunas', timestamp: d_30, createdBy: 'u4', evidenceUrl: 'https://keu.tvri/sp2d/bukti-transfer-lunas.pdf' }
            ]
        }
    ]
  },
  {
    id: 't-kb-1-umu', caseId: 'c-kb-01', division: 'UMU', status: TaskStatus.OK,
    description: '',
    updatedAt: d_30,
    solutions: [
        {
            id: 's-kb-1-umu-1', subtaskId: 't-kb-1-umu', title: 'Raised Floor & Peredam Suara',
            description: 'Peninggian lantai antistatis setinggi 60cm untuk cabling dan pemasangan dinding akustik rockwool.',
            isFeasible: true, currentProgress: 100, createdAt: d_60, createdBy: 'u7',
            attachmentUrl: 'https://umum.tvri/renov/sipil-report.pdf',
            progressLogs: [
                 { id: 'pl-kb-1-4a', solutionId: 's-kb-1-umu-1', progressPercent: 30, note: 'Pembongkaran lantai lama', timestamp: d_50, createdBy: 'u7', evidenceUrl: 'https://umum.tvri/renov/demolition-report.pdf' },
                 { id: 'pl-kb-1-4b', solutionId: 's-kb-1-umu-1', progressPercent: 70, note: 'Pemasangan rangka raised floor', timestamp: d_40, createdBy: 'u7', evidenceUrl: 'https://umum.tvri/renov/raised-floor-progress.jpg' },
                 { id: 'pl-kb-1-4c', solutionId: 's-kb-1-umu-1', progressPercent: 100, note: 'Pekerjaan sipil selesai dan pembersihan', timestamp: d_30, createdBy: 'u7', evidenceUrl: 'https://umum.tvri/renov/handover-sipil.pdf' }
            ]
        },
        {
            id: 's-kb-1-umu-2', subtaskId: 't-kb-1-umu', title: 'Precision Air Conditioning (PAC)',
            description: 'Instalasi 2 unit PAC Liebert 20PK dengan sistem redundansi N+1 untuk menjaga suhu server 20°C stabil.',
            isFeasible: true, currentProgress: 100, createdAt: d_60, createdBy: 'u7',
            attachmentUrl: 'https://umum.tvri/asset/pac-manual.pdf',
            progressLogs: [{ id: 'pl-kb-1-5a', solutionId: 's-kb-1-umu-2', progressPercent: 100, note: 'Unit terpasang dan suhu ruangan stabil 20°C', timestamp: d_30, createdBy: 'u7', evidenceUrl: 'https://umum.tvri/maintenance/suhu-log-day1.xls' }]
        }
    ]
  },

  // KB2: DEBAT CAPRES (PRO, UMU)
  {
    id: 't-kb-2-pro', caseId: 'c-kb-02', division: 'PRO', status: TaskStatus.OK,
    description: '',
    updatedAt: d_30,
    solutions: [
        {
            id: 's-kb-2-pro-1', subtaskId: 't-kb-2-pro', title: 'Rundown & Script Segmen 1-6',
            description: 'Finalisasi durasi per segmen, pertanyaan panelis, dan script closing statement. Disetujui KPU.',
            isFeasible: true, currentProgress: 100, createdAt: d_60, createdBy: 'u2',
            attachmentUrl: 'https://pro.tvri/script/debat-final-signed.pdf',
            progressLogs: [
                { id: 'pl-kb-2-1a', solutionId: 's-kb-2-pro-1', progressPercent: 50, note: 'Draft 1 disetujui Timses', timestamp: d_45, createdBy: 'u2', evidenceUrl: 'https://pro.tvri/script/approval-timses.pdf' },
                { id: 'pl-kb-2-1b', solutionId: 's-kb-2-pro-1', progressPercent: 90, note: 'Rehearsal/Gladi Kotor', timestamp: d_40, createdBy: 'u2', evidenceUrl: 'https://pro.tvri/rundown/gladi-kotor.pdf' },
                { id: 'pl-kb-2-1c', solutionId: 's-kb-2-pro-1', progressPercent: 100, note: 'Script locked H-2 & Gladi Resik', timestamp: d_30, createdBy: 'u2', evidenceUrl: 'https://pro.tvri/rundown/final-script.pdf' }
            ]
        },
        {
            id: 's-kb-2-pro-2', subtaskId: 't-kb-2-pro', title: 'Kontrak Host & Panelis',
            description: 'Penandatanganan pakta integritas dan kontrak honorarium bagi 2 moderator dan 11 panelis ahli.',
            isFeasible: true, currentProgress: 100, createdAt: d_60, createdBy: 'u2',
            attachmentUrl: 'https://pro.tvri/legal/kontrak-talent.zip',
            progressLogs: [{ id: 'pl-kb-2-2a', solutionId: 's-kb-2-pro-2', progressPercent: 100, note: 'Semua talent telah tanda tangan kontrak', timestamp: d_30, createdBy: 'u2', evidenceUrl: 'https://pro.tvri/legal/ttd-lengkap.pdf' }]
        }
    ]
  },
  {
    id: 't-kb-2-umu', caseId: 'c-kb-02', division: 'UMU', status: TaskStatus.OK,
    description: '',
    updatedAt: d_30,
    solutions: [
        {
            id: 's-kb-2-umu-1', subtaskId: 't-kb-2-umu', title: 'Pengamanan Ring 1 Paspampres',
            description: 'Sterilisasi area panggung 4 jam sebelum acara. Pemasangan 4 unit X-Ray Gate di lobi utama.',
            isFeasible: true, currentProgress: 100, createdAt: d_60, createdBy: 'u7',
            attachmentUrl: 'https://umum.tvri/sec/security-layout.jpg',
            progressLogs: [
                 { id: 'pl-kb-2-3a', solutionId: 's-kb-2-umu-1', progressPercent: 50, note: 'Koordinasi dengan Danpaspampres', timestamp: d_45, createdBy: 'u7', evidenceUrl: 'https://umum.tvri/sec/minutes-meeting-paspampres.pdf' },
                 { id: 'pl-kb-2-3b', solutionId: 's-kb-2-umu-1', progressPercent: 100, note: 'Clearance area aman, Metal detector aktif', timestamp: d_30, createdBy: 'u7', evidenceUrl: 'https://umum.tvri/sec/clearance-cert.jpg' }
            ]
        },
        {
            id: 's-kb-2-umu-2', subtaskId: 't-kb-2-umu', title: 'Layanan Katering VVIP',
            description: 'Penyediaan konsumsi untuk tamu VVIP (Ketua KPU, Paslon, Menteri) di Holding Room dengan food safety check.',
            isFeasible: true, currentProgress: 100, createdAt: d_60, createdBy: 'u7',
            attachmentUrl: 'https://umum.tvri/log/menu-vvip.pdf',
            progressLogs: [{ id: 'pl-kb-2-4a', solutionId: 's-kb-2-umu-2', progressPercent: 100, note: 'Layanan memuaskan, Food test clear', timestamp: d_30, createdBy: 'u7', evidenceUrl: 'https://umum.tvri/log/food-safety-report.pdf' }]
        }
    ]
  },

  // KB3: APP (Changed from DEV to TEK)
  {
    id: 't-kb-3-dev', caseId: 'c-kb-03', division: 'TEK', status: TaskStatus.OK,
    description: '',
    updatedAt: d_30,
    solutions: [
        {
            id: 's-kb-3-dev-1', subtaskId: 't-kb-3-dev', title: 'Development Mobile App (Flutter)',
            description: 'Pengembangan aplikasi hybrid untuk Android dan iOS dengan fitur Geofencing radius 50m dari kantor.',
            isFeasible: true, currentProgress: 100, createdAt: d_60, createdBy: 'u8',
            attachmentUrl: 'https://bitbucket.tvri/repo/absensi-mobile',
            progressLogs: [
                { id: 'pl-kb-3-1a', solutionId: 's-kb-3-dev-1', progressPercent: 20, note: 'UI/UX Mockup Approved', timestamp: d_50, createdBy: 'u8', evidenceUrl: 'https://figma.com/proto/absensi-v1' },
                { id: 'pl-kb-3-1b', solutionId: 's-kb-3-dev-1', progressPercent: 60, note: 'Beta Version (APK) released for testing', timestamp: d_40, createdBy: 'u8', evidenceUrl: 'https://dev.tvri/builds/beta-v0.5.apk' },
                { id: 'pl-kb-3-1c', solutionId: 's-kb-3-dev-1', progressPercent: 90, note: 'Bug fixing geolocation', timestamp: d_35, createdBy: 'u8', evidenceUrl: 'https://jira.tvri/issues/resolved-geo' },
                { id: 'pl-kb-3-1d', solutionId: 's-kb-3-dev-1', progressPercent: 100, note: 'Rilis Production v1.0 di Playstore', timestamp: d_30, createdBy: 'u8', evidenceUrl: 'https://play.google.com/store/apps/details?id=go.id.tvri.absensi' }
            ]
        },
        {
            id: 's-kb-3-dev-2', subtaskId: 't-kb-3-dev', title: 'Setup Server Database & API',
            description: 'Instalasi PostgreSQL dan Redis untuk backend. Integrasi API dengan mesin fingerprint lama untuk sinkronisasi data.',
            isFeasible: true, currentProgress: 100, createdAt: d_60, createdBy: 'u8',
            attachmentUrl: 'https://dev.tvri/docs/api-spec.json',
            progressLogs: [
                { id: 'pl-kb-3-2a', solutionId: 's-kb-3-dev-2', progressPercent: 50, note: 'Database migration done', timestamp: d_45, createdBy: 'u8', evidenceUrl: 'https://dev.tvri/db/migration-log.txt' },
                { id: 'pl-kb-3-2b', solutionId: 's-kb-3-dev-2', progressPercent: 100, note: 'Server Uptime 99.9%, API Secured', timestamp: d_30, createdBy: 'u8', evidenceUrl: 'https://monitoring.tvri/uptime-report.pdf' }
            ]
        }
    ]
  },
  {
    id: 't-kb-3-sdm', caseId: 'c-kb-03', division: 'SDM', status: TaskStatus.OK,
    description: '',
    updatedAt: d_30,
    solutions: [
        {
            id: 's-kb-3-sdm-1', subtaskId: 't-kb-3-sdm', title: 'Penerbitan SK Direksi',
            description: 'Penyusunan regulasi baru terkait kewajiban absensi online dan sanksi pemotongan tunjangan.',
            isFeasible: true, currentProgress: 100, createdAt: d_60, createdBy: 'u6',
            attachmentUrl: 'https://sdm.tvri/reg/sk-absensi-2024.pdf',
            progressLogs: [
                { id: 'pl-kb-3-3a', solutionId: 's-kb-3-sdm-1', progressPercent: 50, note: 'Draft SK diperiksa Divisi Hukum', timestamp: d_50, createdBy: 'u6', evidenceUrl: 'https://sdm.tvri/reg/draft-paraf-hukum.pdf' },
                { id: 'pl-kb-3-3b', solutionId: 's-kb-3-sdm-1', progressPercent: 100, note: 'SK Ditandatangani Dirut', timestamp: d_45, createdBy: 'u6', evidenceUrl: 'https://sdm.tvri/reg/sk-final-ttd.jpg' }
            ]
        },
        {
            id: 's-kb-3-sdm-2', subtaskId: 't-kb-3-sdm', title: 'Roadshow Sosialisasi Nasional',
            description: 'Webinar sosialisasi cara penggunaan aplikasi ke seluruh SDM Pusat dan 30 Stasiun Daerah.',
            isFeasible: true, currentProgress: 100, createdAt: d_60, createdBy: 'u6',
            attachmentUrl: 'https://sdm.tvri/laporan/dokumentasi-zoom.jpg',
            progressLogs: [
                { id: 'pl-kb-3-4a', solutionId: 's-kb-3-sdm-2', progressPercent: 30, note: 'Materi sosialisasi siap', timestamp: d_40, createdBy: 'u6', evidenceUrl: 'https://sdm.tvri/materi/slide-sosialisasi.pptx' },
                { id: 'pl-kb-3-4b', solutionId: 's-kb-3-sdm-2', progressPercent: 100, note: '4500 Pegawai telah teredukasi via Zoom', timestamp: d_30, createdBy: 'u6', evidenceUrl: 'https://sdm.tvri/laporan/absensi-peserta-zoom.xlsx' }
            ]
        }
    ]
  }
];

export const SEED_LOGS: Log[] = [
  {
    id: 'l1',
    caseId: 'c-klik-01',
    userId: 'u5',
    userName: 'Pak Direktur',
    action: 'Executive Decision',
    details: 'APPROVE: Lanjutkan pengembangan',
    timestamp: d_14
  }
];
