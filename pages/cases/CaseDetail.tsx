
import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { TaskStatus, CaseStatus } from '../../types';

export const CaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { cases, subtasks, updateCaseBlockA, currentUser } = useStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const currentCase = cases.find(c => c.id === id);
  const tasks = subtasks.filter(t => t.caseId === id);

  if (!currentCase) return <div>Permintaan tidak ditemukan</div>;

  const isRevision = currentCase.status === CaseStatus.REVISION;
  const canEdit = isRevision && currentUser?.role === 'requester' && currentCase.requesterId === currentUser.id;
  const showExecutionHistory = currentCase.status === CaseStatus.IN_EXECUTION || currentCase.status === CaseStatus.COMPLETED || currentCase.status === CaseStatus.APPROVED;

  const handleEditToggle = () => {
    if (!isEditing) {
        setFormData({ ...currentCase });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveBlockA = () => {
      updateCaseBlockA(currentCase.id, formData);
      setIsEditing(false);
  };

  const getTrafficLight = (status: TaskStatus) => {
      switch(status) {
          case TaskStatus.OK: return 'bg-green-500';
          case TaskStatus.DONE: return 'bg-green-500';
          case TaskStatus.NO: return 'bg-red-500';
          case TaskStatus.REVISION: return 'bg-orange-500';
          default: return 'bg-yellow-400'; // Pending/In Progress
      }
  };

  const getStatusBadge = (status: CaseStatus) => {
      if (status === CaseStatus.REVISION) return 'bg-orange-100 text-orange-800 border-orange-300';
      if (status === CaseStatus.WAITING_EXEC_DECISION) return 'bg-purple-100 text-purple-800 border-purple-300';
      if (status === CaseStatus.IN_EXECUTION) return 'bg-blue-600 text-white border-blue-700';
      if (status === CaseStatus.IN_ASSESSMENT) return 'bg-tvriBlueLight text-tvriBlueDark border-blue-200';
      return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
             <Button variant="outline" size="sm" onClick={() => navigate('/cases')}>
                &larr; {t('common.back')}
             </Button>
             <div>
                <h2 className="text-2xl font-bold text-gray-900">{currentCase.title}</h2>
                <p className="text-sm text-gray-600">ID: {currentCase.id}</p>
             </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusBadge(currentCase.status)}`}>
            {t(`status.${currentCase.status}`)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Content (Block A, Block B, Block C) */}
        <div className="md:col-span-2 space-y-6">
            
            {/* Block A: Informasi Kasus */}
            <div className="bg-white shadow rounded-lg overflow-hidden border-t-4 border-tvriBlue">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold text-tvriBlueDark">Blok A: Informasi Permintaan</h3>
                    {canEdit && !isEditing && <Button size="sm" onClick={handleEditToggle}>Edit Revisi</Button>}
                    {isEditing && <div className="space-x-2"><Button size="sm" variant="secondary" onClick={() => setIsEditing(false)}>Batal</Button><Button size="sm" onClick={handleSaveBlockA}>Simpan</Button></div>}
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                     {isEditing ? (
                         <>
                            <div className="col-span-2">
                                <label className="block font-medium text-gray-800">Judul</label>
                                <input className="w-full border p-2 rounded text-gray-900 bg-white" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                            </div>
                            <div className="col-span-2">
                                <label className="block font-medium text-gray-800">Deskripsi</label>
                                <textarea className="w-full border p-2 rounded text-gray-900 bg-white" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-800">Lokasi</label>
                                <input className="w-full border p-2 rounded text-gray-900 bg-white" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-800">Target</label>
                                <input type="date" className="w-full border p-2 rounded text-gray-900 bg-white" value={formData.targetDate} onChange={e => setFormData({...formData, targetDate: e.target.value})} />
                            </div>
                            <div className="col-span-2">
                                <label className="block font-medium text-gray-800">Link Lampiran</label>
                                <input className="w-full border p-2 rounded text-gray-900 bg-white" value={formData.attachmentUrl} onChange={e => setFormData({...formData, attachmentUrl: e.target.value})} />
                            </div>
                         </>
                     ) : (
                         <>
                            <div className="col-span-2">
                                <p className="text-gray-700 font-medium">Deskripsi</p>
                                <p className="text-gray-900 mt-1">{currentCase.description}</p>
                            </div>
                            <div>
                                <p className="text-gray-700 font-medium">Lokasi</p>
                                <p className="text-gray-900 mt-1">{currentCase.location || '-'}</p>
                            </div>
                            <div>
                                <p className="text-gray-700 font-medium">Urgensi</p>
                                <p className={`mt-1 font-bold ${currentCase.urgency === 'CRITICAL' ? 'text-red-700' : 'text-gray-900'}`}>
                                    {currentCase.urgency}
                                </p>
                            </div>
                             <div>
                                <p className="text-gray-700 font-medium">Target Waktu</p>
                                <p className="text-gray-900 mt-1">{currentCase.targetDate || '-'}</p>
                            </div>
                             <div>
                                <p className="text-gray-700 font-medium">Requester</p>
                                <p className="text-gray-900 mt-1">{currentCase.requesterName}</p>
                            </div>
                            {currentCase.attachmentUrl && (
                                <div className="col-span-2">
                                    <p className="text-gray-700 font-medium">Lampiran</p>
                                    <a href={currentCase.attachmentUrl} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline break-all mt-1 block">
                                        {currentCase.attachmentUrl}
                                    </a>
                                </div>
                            )}
                         </>
                     )}
                </div>
            </div>

            {/* Block B Summary */}
             <div className="bg-white shadow rounded-lg overflow-hidden border-t-4 border-gray-400">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-900">Blok B: Status & Solusi Divisi</h3>
                </div>
                <div className="p-0">
                    <ul className="divide-y divide-gray-200">
                        {tasks.map(t => (
                            <li key={t.id} className="p-4 hover:bg-gray-50">
                                <div className="flex items-start gap-4">
                                    {/* Traffic Light */}
                                    <div className={`mt-1 flex-shrink-0 w-4 h-4 rounded-full ${getTrafficLight(t.status)} ring-2 ring-white shadow-sm`} title={t.status}></div>
                                    
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <h4 className="font-bold text-gray-900">{t.division}</h4>
                                            <span className="text-xs font-mono text-gray-600">{t.status}</span>
                                        </div>
                                        {/* REMOVED SUBTASK DESCRIPTION AS PER REQUEST */}
                                        
                                        {/* Show Solutions Summary */}
                                        {t.solutions.length > 0 && (
                                            <div className="mt-3 space-y-2">
                                                {t.solutions.map(s => (
                                                    <div key={s.id} className={`p-3 rounded text-xs border ${s.isFeasible ? 'bg-green-50 border-green-200 text-green-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
                                                        <p><span className="font-bold">{s.title}:</span> {s.description}</p>
                                                        
                                                        {/* Attachment Link in Block B (Updated) */}
                                                        {s.attachmentUrl && (
                                                            <div className="mt-2 pt-2 border-t border-gray-100">
                                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">Lampiran</p>
                                                                <a href={s.attachmentUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline break-all block">
                                                                    {s.attachmentUrl}
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Show Revision Note */}
                                        {t.status === TaskStatus.REVISION && t.revisionNote && (
                                            <div className="mt-3 p-2 bg-orange-50 text-orange-800 text-xs rounded border border-orange-200">
                                                <strong>Catatan Revisi:</strong> {t.revisionNote}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Block C: Riwayat Eksekusi (Conditional) - NOW LAST */}
            {showExecutionHistory && (
                <div className="bg-white shadow rounded-lg overflow-hidden border-t-4 border-green-600">
                    <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
                        <h3 className="text-lg font-bold text-green-900">Blok C: Riwayat Eksekusi</h3>
                    </div>
                    <div className="p-6">
                        {tasks.every(t => t.solutions.every(s => s.progressLogs.length === 0)) ? (
                            <p className="text-gray-500 italic">Belum ada riwayat eksekusi yang tercatat.</p>
                        ) : (
                            <div className="space-y-6">
                                {tasks.map(t => (
                                    <div key={t.id}>
                                        {t.solutions.filter(s => s.isFeasible && s.progressLogs.length > 0).map(sol => {
                                            // Sort logs descending (newest first)
                                            const sortedLogs = [...sol.progressLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                                            
                                            return (
                                                <div key={sol.id} className="mb-4 last:mb-0 border border-gray-100 rounded p-4">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div>
                                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t.division}</span>
                                                            <h4 className="font-bold text-gray-900">{sol.title}</h4>
                                                        </div>
                                                        <span className="text-xs font-bold px-2 py-0.5 bg-green-100 text-green-800 rounded">
                                                            {sol.currentProgress}% Selesai
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Logs */}
                                                    <div className="mt-3 space-y-3 pl-4 border-l-2 border-gray-200">
                                                        {sortedLogs.map((log, index) => (
                                                            <div key={log.id} className="relative">
                                                                <div className={`absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white ${index === 0 ? 'bg-green-600' : 'bg-gray-400'}`}></div>
                                                                <p className="text-xs text-gray-500">
                                                                    {new Date(log.timestamp).toLocaleDateString()}
                                                                </p>
                                                                <p className={`text-sm ${index === 0 ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                                                                    {log.note} ({log.progressPercent}%)
                                                                </p>
                                                                {log.evidenceUrl && (
                                                                    <div className="mt-2">
                                                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block">Bukti Dukung</span>
                                                                        <a href={log.evidenceUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline break-all block">
                                                                            {log.evidenceUrl}
                                                                        </a>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>

        {/* Sidebar */}
        <div className="md:col-span-1 space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
                 <h3 className="font-bold text-gray-900 mb-2">Timeline</h3>
                 <div className="text-sm space-y-3">
                     <div className="flex gap-3">
                         <div className="flex flex-col items-center">
                             <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                             <div className="h-full w-px bg-gray-200 my-1"></div>
                         </div>
                         <div>
                             <p className="text-xs text-gray-600">{new Date(currentCase.createdAt).toLocaleDateString()}</p>
                             <p className="font-medium text-gray-800">Created</p>
                         </div>
                     </div>
                     <div className="flex gap-3">
                         <div className="flex flex-col items-center">
                             <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                         </div>
                         <div>
                             <p className="text-xs text-gray-600">{new Date(currentCase.updatedAt).toLocaleDateString()}</p>
                             <p className="font-medium text-gray-800">Last Update</p>
                         </div>
                     </div>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};
