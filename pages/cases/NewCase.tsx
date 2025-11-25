
import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Urgency, CaseStatus, Case, Division } from '../../types';

type TabType = 'MANUAL' | 'CLONE' | 'WIZARD';

// Mock Questions for Wizard
const WIZARD_QUESTIONS = [
    { id: 'q1', text: 'Apakah membutuhkan pengadaan perangkat keras baru > 100jt?', division: 'KEU' as Division },
    { id: 'q2', text: 'Apakah membutuhkan instalasi jaringan kabel/fiber optik?', division: 'TEK' as Division },
    { id: 'q3', text: 'Apakah melibatkan perekrutan tenaga ahli eksternal?', division: 'SDM' as Division },
    { id: 'q4', text: 'Apakah acara ini akan disiarkan langsung (Live)?', division: 'PRO' as Division },
    { id: 'q5', text: 'Apakah membutuhkan pengembangan aplikasi software?', division: 'DEV' as Division },
    { id: 'q6', text: 'Apakah membutuhkan bantuan umum (tenda, konsumsi, keamanan)?', division: 'UMU' as Division },
    { id: 'q7', text: 'Apakah ada risiko hukum atau kontrak kerjasama?', division: 'SPI' as Division },
];

export const NewCase: React.FC = () => {
  const { addCase, cases, subtasks, divisions } = useStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabType>('MANUAL');
  
  // Form State
  const [formData, setFormData] = useState<Partial<Case>>({
    title: '',
    description: '',
    location: '',
    urgency: Urgency.MEDIUM,
    targetDate: '',
    justification: '',
    attachmentUrl: ''
  });
  
  // Manual Division Selection State
  const [selectedDivisions, setSelectedDivisions] = useState<Division[]>([]);
  
  // Wizard State
  const [wizardAnswers, setWizardAnswers] = useState<Record<string, boolean>>({});
  const [wizardResult, setWizardResult] = useState<Division[] | null>(null);

  // Clone State
  const closedCases = cases.filter(c => c.status === CaseStatus.COMPLETED || c.status === CaseStatus.APPROVED);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDivisionToggle = (div: Division) => {
      if (selectedDivisions.includes(div)) {
          setSelectedDivisions(selectedDivisions.filter(d => d !== div));
      } else {
          setSelectedDivisions([...selectedDivisions, div]);
      }
  };

  const handleCloneSelect = (c: Case) => {
    setFormData({
        title: `Copy of ${c.title}`,
        description: c.description,
        location: c.location,
        urgency: c.urgency,
        targetDate: '', // Reset date
        justification: c.justification,
        attachmentUrl: c.attachmentUrl
    });
    
    // Auto-populate divisions based on the subtasks of the cloned case
    const associatedSubtasks = subtasks.filter(t => t.caseId === c.id);
    const existingDivisions = Array.from(new Set(associatedSubtasks.map(t => t.division)));
    
    setSelectedDivisions(existingDivisions);
    
    // Switch to manual tab so user can review the pre-filled data
    setActiveTab('MANUAL'); 
  };

  const handleWizardAnalyze = () => {
      const recommended: Division[] = [];
      Object.entries(wizardAnswers).forEach(([qid, yes]) => {
          if (yes) {
              const q = WIZARD_QUESTIONS.find(qq => qq.id === qid);
              if (q && !recommended.includes(q.division)) {
                  recommended.push(q.division);
              }
          }
      });
      setWizardResult(recommended);
  };

  const handleApplyWizard = () => {
      if (wizardResult) {
          setSelectedDivisions(wizardResult);
          setActiveTab('MANUAL');
          window.scrollTo(0, document.body.scrollHeight); // Scroll to bottom where divisions are
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedDivisions.length === 0) {
        alert("Mohon pilih minimal satu divisi yang terlibat.");
        return;
    }

    addCase(
      { ...formData, templateId: 'custom' },
      selectedDivisions,
      []
    );

    navigate('/cases');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-gray-900">{t('case.new')}</h2>
         <Button variant="outline" size="sm" onClick={() => navigate('/cases')}>
            {t('common.back')}
         </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
            <button onClick={() => setActiveTab('MANUAL')} className={`${activeTab === 'MANUAL' ? 'border-tvriBlue text-tvriBlue' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                1. Form Permintaan Baru
            </button>
            <button onClick={() => setActiveTab('CLONE')} className={`${activeTab === 'CLONE' ? 'border-tvriBlue text-tvriBlue' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                2. Tiru Permintaan Lama
            </button>
            <button onClick={() => setActiveTab('WIZARD')} className={`${activeTab === 'WIZARD' ? 'border-tvriBlue text-tvriBlue' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                3. Bantuan (Wizard)
            </button>
        </nav>
      </div>
      
      <div className="bg-white shadow sm:rounded-lg p-6">
          {/* TAB 2: CLONE EXISTING CASE */}
          {activeTab === 'CLONE' && (
              <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Pilih Permintaan untuk Ditiru</h3>
                  <div className="grid gap-4">
                      {closedCases.map(c => (
                          <div key={c.id} className="border p-4 rounded hover:bg-gray-50 cursor-pointer flex justify-between items-center" onClick={() => handleCloneSelect(c)}>
                              <div>
                                  <p className="font-bold text-tvriBlue">{c.title}</p>
                                  <p className="text-sm text-gray-600">{c.description}</p>
                              </div>
                              <Button size="sm" variant="secondary">Gunakan Data</Button>
                          </div>
                      ))}
                      {closedCases.length === 0 && <p className="text-gray-500">Belum ada permintaan selesai untuk ditiru.</p>}
                  </div>
              </div>
          )}

          {/* TAB 3: WIZARD HELP ONLY */}
          {activeTab === 'WIZARD' && (
              <div>
                   <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mb-6">
                        <h4 className="font-bold text-tvriBlueDark mb-2 text-lg">Bantuan Penentuan Divisi</h4>
                        <p className="text-sm text-gray-700 mb-4">
                            Jawab pertanyaan di bawah ini (Ya/Tidak). Sistem akan menganalisis divisi mana saja yang harus dilibatkan dalam permintaan Anda.
                        </p>
                        
                        <div className="space-y-3">
                            {WIZARD_QUESTIONS.map(q => (
                                <div key={q.id} className="flex items-center justify-between bg-white p-3 rounded shadow-sm border border-gray-200">
                                    <span className="text-sm text-gray-800 font-medium">{q.text}</span>
                                    <div className="flex gap-2">
                                        <button 
                                            type="button"
                                            onClick={() => setWizardAnswers({...wizardAnswers, [q.id]: true})}
                                            className={`px-4 py-1.5 text-xs font-bold rounded transition-colors ${wizardAnswers[q.id] === true ? 'bg-tvriBlue text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                        >YA</button>
                                        <button 
                                            type="button"
                                            onClick={() => setWizardAnswers({...wizardAnswers, [q.id]: false})}
                                            className={`px-4 py-1.5 text-xs font-bold rounded transition-colors ${wizardAnswers[q.id] === false ? 'bg-gray-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                        >TIDAK</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6">
                            <Button onClick={handleWizardAnalyze} className="w-full sm:w-auto">Analisis Kebutuhan Divisi</Button>
                        </div>
                   </div>

                   {wizardResult && (
                       <div className="bg-green-50 border border-green-200 p-6 rounded-lg animation-fade-in">
                           <h4 className="font-bold text-green-800 mb-3">Rekomendasi Divisi Terkait:</h4>
                           {wizardResult.length === 0 ? (
                               <p className="text-gray-600 text-sm">Berdasarkan jawaban Anda, sistem menyarankan Divisi <span className="font-bold">UMU (Umum)</span> sebagai koordinator dasar.</p>
                           ) : (
                               <div className="flex flex-wrap gap-2 mb-4">
                                   {wizardResult.map(div => (
                                       <span key={div} className="px-3 py-1 bg-white border border-green-300 text-green-700 rounded-full font-bold shadow-sm">
                                           {div}
                                       </span>
                                   ))}
                               </div>
                           )}
                           
                           <div className="flex gap-4 items-center border-t border-green-200 pt-4 mt-2">
                               <p className="text-sm text-gray-700 flex-1">
                                   Ingin membuat permintaan dengan rekomendasi divisi ini?
                               </p>
                               <Button onClick={handleApplyWizard}>
                                   Gunakan Rekomendasi Ini &rarr;
                               </Button>
                           </div>
                       </div>
                   )}
              </div>
          )}

          {/* TAB 1: MANUAL FORM */}
          {activeTab === 'MANUAL' && (
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* SECTION: COMMON FORM FIELDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-800 mb-1">{t('case.field.title')} <span className="text-red-500">*</span></label>
                        <input required name="title" value={formData.title} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2 focus:ring-tvriBlue focus:border-tvriBlue bg-white text-gray-900 placeholder-gray-400" placeholder="Contoh: Pengadaan Kamera Studio 3" />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-800 mb-1">{t('case.field.desc')} <span className="text-red-500">*</span></label>
                        <textarea required name="description" rows={3} value={formData.description} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2 focus:ring-tvriBlue focus:border-tvriBlue bg-white text-gray-900 placeholder-gray-400" placeholder="Jelaskan detail kebutuhan..." />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-1">{t('case.field.location')}</label>
                        <input name="location" value={formData.location} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2 focus:ring-tvriBlue focus:border-tvriBlue bg-white text-gray-900" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-1">{t('case.field.urgency')}</label>
                        <select name="urgency" value={formData.urgency} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2 focus:ring-tvriBlue focus:border-tvriBlue bg-white text-gray-900">
                            {Object.values(Urgency).map(u => <option key={u} value={u}>{t(`urgency.${u}`)}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-1">{t('case.field.targetDate')}</label>
                        <input type="date" name="targetDate" value={formData.targetDate} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2 focus:ring-tvriBlue focus:border-tvriBlue bg-white text-gray-900" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-1">{t('case.field.attachment')}</label>
                        <input type="url" placeholder="https://" name="attachmentUrl" value={formData.attachmentUrl} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2 focus:ring-tvriBlue focus:border-tvriBlue bg-white text-gray-900" />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-800 mb-1">{t('case.field.justification')}</label>
                        <textarea name="justification" rows={2} value={formData.justification} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2 focus:ring-tvriBlue focus:border-tvriBlue bg-white text-gray-900" placeholder="Alasan pengajuan..." />
                    </div>
                </div>

                {/* SECTION: DIVISION SELECTION (MANUAL ONLY) */}
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mt-6">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h4 className="font-bold text-tvriBlueDark text-base">Tentukan Divisi Terkait</h4>
                            <p className="text-sm text-gray-600">Pilih divisi mana saja yang perlu menindaklanjuti permintaan ini.</p>
                        </div>
                        <button type="button" onClick={() => setActiveTab('WIZARD')} className="text-xs text-tvriBlue underline hover:text-blue-800">
                            Tidak yakin? Gunakan Wizard &rarr;
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {divisions.map(div => (
                            <label key={div.id} className={`flex items-center gap-2 p-3 rounded border cursor-pointer transition-all ${selectedDivisions.includes(div.code) ? 'bg-tvriBlue text-white border-tvriBlue' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                                <input 
                                    type="checkbox" 
                                    className="rounded text-tvriBlue focus:ring-tvriBlue hidden" // Hidden native checkbox, styled container
                                    checked={selectedDivisions.includes(div.code)}
                                    onChange={() => handleDivisionToggle(div.code)}
                                />
                                <div className={`w-4 h-4 border rounded flex items-center justify-center ${selectedDivisions.includes(div.code) ? 'bg-white border-white' : 'border-gray-400'}`}>
                                    {selectedDivisions.includes(div.code) && <div className="w-2 h-2 bg-tvriBlue rounded-sm"></div>}
                                </div>
                                <span className="font-bold text-sm">{div.code}</span>
                            </label>
                        ))}
                    </div>
                    {selectedDivisions.length === 0 && (
                        <p className="text-xs text-red-500 mt-2 font-medium">* Wajib memilih minimal satu divisi.</p>
                    )}
                </div>

                <div className="pt-4 border-t border-gray-200">
                    <Button type="submit" className="w-full sm:w-auto">
                        {t('case.btn.submit')}
                    </Button>
                </div>
            </form>
          )}
      </div>
    </div>
  );
};
