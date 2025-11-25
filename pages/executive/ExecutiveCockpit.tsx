
import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { useTranslation } from 'react-i18next';
import { CaseStatus, TaskStatus, Case } from '../../types';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';

export const ExecutiveCockpit: React.FC = () => {
  const { cases, subtasks, submitExecutiveDecision } = useStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [decisionNote, setDecisionNote] = useState('');
  const [activeDecision, setActiveDecision] = useState<'APPROVE' | 'APPROVE_WITH_CONDITIONS' | 'REJECT' | 'REVISION' | null>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<'DECISION' | 'MONITORING'>('DECISION');

  // Filter Cases based on Tab
  // Tab 1: Waiting Decision
  const decisionCases = cases.filter(c => c.status === CaseStatus.WAITING_EXEC_DECISION);

  // Tab 2: Post Decision (Execution, Completed, Rejected)
  const monitoringCases = cases.filter(c => 
    c.status === CaseStatus.IN_EXECUTION || 
    c.status === CaseStatus.COMPLETED || 
    c.status === CaseStatus.REJECTED || 
    c.status === CaseStatus.APPROVED
  );

  const getTrafficLight = (status: TaskStatus) => {
    switch(status) {
        case TaskStatus.OK: return 'bg-green-500';
        case TaskStatus.NO: return 'bg-red-500'; // Handled NO
        case TaskStatus.DONE: return 'bg-green-500';
        default: return 'bg-gray-300';
    }
  };

  const getStatusBadgeColor = (status: CaseStatus) => {
    switch(status) {
        case CaseStatus.IN_EXECUTION: return 'bg-blue-100 text-blue-800';
        case CaseStatus.COMPLETED: return 'bg-green-100 text-green-800';
        case CaseStatus.REJECTED: return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmitDecision = () => {
      if (!selectedCase || !activeDecision) return;
      if (!decisionNote && activeDecision !== 'APPROVE') {
          alert("Harap isi catatan untuk keputusan ini.");
          return;
      }
      submitExecutiveDecision(selectedCase.id, activeDecision, decisionNote);
      setSelectedCase(null);
      setDecisionNote('');
      setActiveDecision(null);
  };

  // Helper to render the grid of cards
  const renderCaseGrid = (caseList: Case[], isMonitoring: boolean) => {
      if (caseList.length === 0) {
          return (
            <div className="bg-white p-12 text-center rounded-lg shadow border border-gray-200">
                <p className="text-gray-500 text-lg">
                    {isMonitoring ? 'Belum ada permintaan yang berjalan atau selesai.' : 'Tidak ada permintaan yang menunggu keputusan eksekutif.'}
                </p>
            </div>
          );
      }

      return caseList.map(c => {
          const caseTasks = subtasks.filter(t => t.caseId === c.id);
          
          return (
            <div key={c.id} className={`bg-white shadow-lg rounded-lg overflow-hidden border-l-4 ${isMonitoring ? 'border-gray-400' : 'border-tvriBlue'} hover:shadow-xl transition-shadow`}>
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                {isMonitoring && (
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${getStatusBadgeColor(c.status)}`}>
                                        {t(`status.${c.status}`)}
                                    </span>
                                )}
                                <span className="text-xs text-gray-500 font-mono">ID: {c.id}</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">{c.title}</h3>
                            <p className="text-sm text-gray-800 mt-1">{c.description}</p>
                            <div className="flex gap-4 mt-2 text-sm text-gray-700">
                                <span className="bg-gray-100 px-2 py-1 rounded">Urgensi: {c.urgency}</span>
                                <span className="bg-gray-100 px-2 py-1 rounded">Lokasi: {c.location}</span>
                                <span className="bg-gray-100 px-2 py-1 rounded">Req: {c.requesterName}</span>
                            </div>
                        </div>
                        <Button onClick={() => setSelectedCase(c)}>
                            {isMonitoring ? 'Lihat Detail' : 'Review & Putuskan'}
                        </Button>
                    </div>

                    {/* Division Summary */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {caseTasks.map(t => (
                            <div key={t.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded border border-gray-200">
                                <div className={`w-3 h-3 rounded-full ${getTrafficLight(t.status)}`}></div>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <span className="font-bold text-sm text-gray-800">{t.division}</span>
                                        <span className="text-xs text-gray-600">{t.status}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                        {/* For monitoring, show actual progress if available via store, or simplified logic */}
                                        <div className="bg-tvriBlue h-1.5 rounded-full" style={{ width: t.status === 'OK' ? '100%' : '0%' }}></div>
                                    </div>
                                    <p className="text-xs text-gray-700 mt-1">{t.solutions.length} Solusi</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          );
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-tvriBlueDark">{t('nav.cockpit')}</h2>
        <Button variant="outline" onClick={() => navigate('/executive/kpi')}>
           Lihat KPI & Statistik &rarr;
        </Button>
      </div>

      {/* TABS */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
            <button 
                onClick={() => setActiveTab('DECISION')} 
                className={`${activeTab === 'DECISION' ? 'border-tvriBlue text-tvriBlue' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
                <span>📥</span> Menunggu Keputusan
                {decisionCases.length > 0 && <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{decisionCases.length}</span>}
            </button>
            <button 
                onClick={() => setActiveTab('MONITORING')} 
                className={`${activeTab === 'MONITORING' ? 'border-tvriBlue text-tvriBlue' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
                <span>👁️</span> Monitoring Pasca Keputusan
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">{monitoringCases.length}</span>
            </button>
        </nav>
      </div>

      {/* GRID LIST */}
      <div className="grid grid-cols-1 gap-6">
          {activeTab === 'DECISION' 
            ? renderCaseGrid(decisionCases, false)
            : renderCaseGrid(monitoringCases, true)
          }
      </div>

      {/* Detail Drawer / Modal */}
      {selectedCase && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
              <div className="w-full md:w-2/3 lg:w-1/2 bg-white h-full shadow-2xl overflow-y-auto flex flex-col">
                  <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                      <h2 className="text-xl font-bold text-tvriBlueDark">
                          {selectedCase.status === CaseStatus.WAITING_EXEC_DECISION ? 'Keputusan Eksekutif' : 'Detail Monitoring'}
                      </h2>
                      <button onClick={() => setSelectedCase(null)} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                  </div>
                  
                  <div className="p-6 flex-1 space-y-6">
                      {/* Case Info */}
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                          <h3 className="font-bold text-tvriBlue mb-2">{selectedCase.title}</h3>
                          <p className="text-sm text-gray-900 mb-2">{selectedCase.description}</p>
                          <div className="text-xs text-gray-700 space-y-1">
                              <p><span className="font-semibold">Status:</span> {t(`status.${selectedCase.status}`)}</p>
                              <p><span className="font-semibold">Justifikasi:</span> {selectedCase.justification}</p>
                              <p><span className="font-semibold">Target:</span> {selectedCase.targetDate}</p>
                              {selectedCase.attachmentUrl && <a href={selectedCase.attachmentUrl} target="_blank" className="text-blue-700 underline">Lampiran Pendukung</a>}
                          </div>
                      </div>

                      {/* POST-DECISION INFO (If Available) */}
                      {selectedCase.executiveDecision && (
                          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                              <h4 className="font-bold text-green-800 text-sm uppercase mb-2">Riwayat Keputusan Eksekutif</h4>
                              <div className="flex items-center gap-2 mb-2">
                                  <span className="font-bold text-gray-900">Keputusan:</span>
                                  <span className="px-2 py-0.5 bg-green-200 text-green-900 rounded text-sm font-bold">{selectedCase.executiveDecision}</span>
                              </div>
                              {selectedCase.executiveNote && (
                                  <div>
                                      <span className="font-bold text-gray-900 text-sm">Catatan:</span>
                                      <p className="text-gray-800 text-sm mt-1 italic">"{selectedCase.executiveNote}"</p>
                                  </div>
                              )}
                          </div>
                      )}

                      {/* Division Details Accordion-like */}
                      <h3 className="font-bold text-gray-900 border-b pb-2">Detail Solusi Divisi</h3>
                      <div className="space-y-4">
                          {subtasks.filter(t => t.caseId === selectedCase.id).map(t => (
                              <div key={t.id} className="border rounded-lg p-4 bg-white shadow-sm">
                                  <div className="flex justify-between mb-2">
                                      <span className="font-bold text-lg text-gray-900">{t.division}</span>
                                      <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 text-xs rounded font-bold ${t.status === 'OK' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{t.status}</span>
                                      </div>
                                  </div>
                                  <div className="space-y-4 mt-4">
                                      {t.solutions.map(s => (
                                          <div key={s.id} className="text-sm bg-gray-50 p-4 rounded border border-gray-200">
                                              <div className="flex justify-between items-start mb-2">
                                                  <h4 className="font-bold text-base text-gray-900">{s.title}</h4>
                                                  <span className={`text-xs px-2 py-1 rounded font-bold border ${s.isFeasible ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                                                      {s.isFeasible ? 'Feasible' : 'Not Feasible'}
                                                  </span>
                                              </div>
                                              
                                              <div className="space-y-2">
                                                  <div>
                                                      <span className="text-xs text-gray-500 font-bold uppercase tracking-wide">Deskripsi Teknis</span>
                                                      <p className="text-gray-800 mt-0.5">{s.description}</p>
                                                  </div>
                                                  
                                                  {s.attachmentUrl && (
                                                      <div>
                                                          <span className="text-xs text-gray-500 font-bold uppercase tracking-wide">Lampiran</span>
                                                          <a href={s.attachmentUrl} target="_blank" rel="noreferrer" className="block text-blue-600 hover:underline break-all">
                                                              {s.attachmentUrl}
                                                          </a>
                                                      </div>
                                                  )}
                                                  
                                                  {/* For Monitoring: Show Execution Progress Summary */}
                                                  {activeTab === 'MONITORING' && s.isFeasible && (
                                                      <div className="mt-2 pt-2 border-t border-gray-200">
                                                           <div className="flex justify-between text-xs mb-1">
                                                               <span className="font-bold text-gray-700">Eksekusi</span>
                                                               <span className="font-bold text-tvriBlue">{s.currentProgress}%</span>
                                                           </div>
                                                           <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                               <div className="bg-tvriBlue h-1.5 rounded-full" style={{ width: `${s.currentProgress}%` }}></div>
                                                           </div>
                                                           {s.progressLogs.length > 0 && (
                                                               <p className="text-xs text-gray-500 mt-1 italic">
                                                                   Last Log: {s.progressLogs[0].note} ({new Date(s.progressLogs[0].timestamp).toLocaleDateString()})
                                                               </p>
                                                           )}
                                                      </div>
                                                  )}
                                              </div>
                                          </div>
                                      ))}
                                      {t.solutions.length === 0 && <p className="text-sm text-gray-500 italic p-2 bg-gray-50 rounded">Tidak ada solusi yang diajukan.</p>}
                                  </div>
                              </div>
                          ))}
                      </div>

                      {/* Decision Form - Only show if waiting for decision */}
                      {selectedCase.status === CaseStatus.WAITING_EXEC_DECISION && (
                        <div className="bg-gray-100 p-6 rounded-lg mt-8 border border-gray-200">
                            <h3 className="font-bold text-gray-900 mb-4">Ambil Keputusan</h3>
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <button 
                                    onClick={() => setActiveDecision('APPROVE')}
                                    className={`p-3 rounded border font-bold ${activeDecision === 'APPROVE' ? 'bg-green-600 text-white border-green-700' : 'bg-white text-green-700 border-green-300 hover:bg-green-50'}`}
                                >
                                    SETUJUI (APPROVE)
                                </button>
                                <button 
                                    onClick={() => setActiveDecision('APPROVE_WITH_CONDITIONS')}
                                    className={`p-3 rounded border font-bold ${activeDecision === 'APPROVE_WITH_CONDITIONS' ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50'}`}
                                >
                                    SETUJUI BERSYARAT
                                </button>
                                <button 
                                    onClick={() => setActiveDecision('REVISION')}
                                    className={`p-3 rounded border font-bold ${activeDecision === 'REVISION' ? 'bg-orange-500 text-white border-orange-600' : 'bg-white text-orange-600 border-orange-300 hover:bg-orange-50'}`}
                                >
                                    KEMBALIKAN (REVISI)
                                </button>
                                <button 
                                    onClick={() => setActiveDecision('REJECT')}
                                    className={`p-3 rounded border font-bold ${activeDecision === 'REJECT' ? 'bg-red-600 text-white border-red-700' : 'bg-white text-red-700 border-red-300 hover:bg-red-50'}`}
                                >
                                    TOLAK (REJECT)
                                </button>
                            </div>
                            
                            {activeDecision && (
                                <div className="space-y-3 animation-fade-in">
                                    <label className="block text-sm font-medium text-gray-800">
                                        {activeDecision === 'APPROVE' ? 'Catatan (Opsional)' : 'Catatan / Syarat / Alasan (Wajib)'}
                                    </label>
                                    <textarea 
                                        className="w-full border p-2 rounded text-gray-900 focus:ring-tvriBlue focus:border-tvriBlue bg-white"
                                        rows={3}
                                        value={decisionNote}
                                        onChange={e => setDecisionNote(e.target.value)}
                                        placeholder={activeDecision === 'APPROVE' ? 'Contoh: Lanjutkan sesuai rencana.' : 'Masukkan detail...'}
                                    ></textarea>
                                    <Button className="w-full" onClick={handleSubmitDecision}>Konfirmasi Keputusan</Button>
                                </div>
                            )}
                        </div>
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
