
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/Button';
import { TaskStatus, Solution, CaseStatus, Division } from '../../types';

export const SubtaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // SubtaskId
  const { subtasks, cases, addSolution, updateSolution, deleteSolution, requestRevision, markSubtaskStatus, currentUser, collaborationNotes, addCollaborationNote } = useStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showRevModal, setShowRevModal] = useState(false);
  const [editingSolutionId, setEditingSolutionId] = useState<string | null>(null);
  
  // Custom Confirmation Modal State
  const [showFinalizeConfirm, setShowFinalizeConfirm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<TaskStatus | null>(null);

  // Forms
  const [solTitle, setSolTitle] = useState('');
  const [solDesc, setSolDesc] = useState('');
  const [solLink, setSolLink] = useState('');
  const [solFeasible, setSolFeasible] = useState(true);
  const [revNote, setRevNote] = useState('');

  // Collaboration Note Form
  const [collabMsg, setCollabMsg] = useState('');
  const [collabTarget, setCollabTarget] = useState<Division | 'ALL'>('ALL');

  const task = subtasks.find(t => t.id === id);
  if (!task) return <div>Task not found</div>;
  const parentCase = cases.find(c => c.id === task.caseId);
  if (!parentCase) return <div>Permintaan not found</div>;

  // Logic to determine if task is "Final" in UI terms (OK or NO)
  const isFinal = task.status === TaskStatus.OK || task.status === TaskStatus.NO || task.status === TaskStatus.DONE;
  
  // Check if we should show Block C (Execution History)
  const showExecutionHistory = parentCase.status === CaseStatus.IN_EXECUTION || parentCase.status === CaseStatus.COMPLETED || parentCase.status === CaseStatus.APPROVED;

  // Get other involved divisions for dropdown
  const involvedDivisions = subtasks
        .filter(t => t.caseId === task.caseId && t.division !== currentUser?.division)
        .map(t => t.division);

  // Filter notes relevant to this user
  const relevantNotes = collaborationNotes
        .filter(n => n.caseId === task.caseId)
        .filter(n => 
            // 1. Sent to ALL
            n.targetDivision === 'ALL' || 
            // 2. Sent TO me
            n.targetDivision === currentUser?.division ||
            // 3. Sent BY me (so I can see my own messages)
            n.senderDivision === currentUser?.division
        )
        .sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const handleOpenAddModal = () => {
    setEditingSolutionId(null);
    setSolTitle('');
    setSolDesc('');
    setSolLink('');
    setSolFeasible(true);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (sol: Solution) => {
    setEditingSolutionId(sol.id);
    setSolTitle(sol.title);
    setSolDesc(sol.description);
    setSolLink(sol.attachmentUrl || '');
    setSolFeasible(sol.isFeasible);
    setShowAddModal(true);
  };

  const handleSaveSolution = () => {
    if (editingSolutionId) {
        updateSolution(task.id, editingSolutionId, {
            title: solTitle,
            description: solDesc,
            isFeasible: solFeasible,
            attachmentUrl: solLink
        });
    } else {
        addSolution(task.id, {
            title: solTitle,
            description: solDesc,
            isFeasible: solFeasible,
            attachmentUrl: solLink
        });
    }
    setShowAddModal(false);
    setEditingSolutionId(null);
    setSolTitle(''); setSolDesc(''); setSolLink('');
  };

  const handleRequestRevision = () => {
      requestRevision(task.id, revNote);
      setShowRevModal(false);
  };

  const handleSendNote = () => {
      if (!collabMsg.trim()) return;
      addCollaborationNote(task.caseId, collabTarget, collabMsg);
      setCollabMsg('');
  };

  // Step 1: User clicks button, open custom modal
  const initiateFinalize = (targetStatus: TaskStatus) => {
      if (task.solutions.length === 0) {
          // Simple validation alert is fine, or could be a toast
          alert("Harap input minimal satu solusi atau analisis sebelum finalisasi.");
          return;
      }
      setPendingStatus(targetStatus);
      setShowFinalizeConfirm(true);
  };

  // Step 2: User confirms inside modal
  const confirmFinalize = () => {
      if (pendingStatus) {
          markSubtaskStatus(task.id, pendingStatus);
          setShowFinalizeConfirm(false);
          // Navigate immediately
          navigate('/division');
      }
  };

  return (
    <div className="space-y-6">
       {/* Header */}
       <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={() => navigate('/division')}>&larr;</Button>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Review: {parentCase.title}</h2>
                    <span className="text-sm text-gray-600">Task ID: {task.id}</span>
                </div>
            </div>
            <div className="flex gap-2">
                {!isFinal && (
                     <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => setShowRevModal(true)}>
                        {t('review.requestRevision')}
                     </Button>
                )}
            </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {/* Left: Case Info (Block A - Read Only) */}
           <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-tvriBlueDark border-b pb-2 mb-4">Blok A: Informasi Permintaan</h3>
                    <div className="space-y-4 text-sm">
                        <div>
                            <span className="block text-gray-700 font-medium">Deskripsi</span>
                            <p className="text-gray-900 mt-1">{parentCase.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="block text-gray-700 font-medium">Lokasi</span>
                                <p className="text-gray-900 mt-1">{parentCase.location}</p>
                            </div>
                            <div>
                                <span className="block text-gray-700 font-medium">Urgensi</span>
                                <p className="text-gray-900 mt-1">{parentCase.urgency}</p>
                            </div>
                            <div>
                                <span className="block text-gray-700 font-medium">Justifikasi</span>
                                <p className="text-gray-900 mt-1">{parentCase.justification}</p>
                            </div>
                             <div>
                                <span className="block text-gray-700 font-medium">Target</span>
                                <p className="text-gray-900 mt-1">{parentCase.targetDate}</p>
                            </div>
                        </div>
                        {parentCase.attachmentUrl && (
                            <div className="bg-white p-2 rounded border">
                                <span className="text-xs text-gray-600">Lampiran:</span>
                                <a href={parentCase.attachmentUrl} className="block text-blue-700 truncate">{parentCase.attachmentUrl}</a>
                            </div>
                        )}
                    </div>
                </div>
           </div>

           {/* Right: Solutions (Block B) */}
           <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg border-2 border-tvriBlue">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                         <h3 className="font-bold text-tvriBlueDark">Blok B: Solusi Divisi {task.division}</h3>
                         {!isFinal && <Button size="sm" onClick={handleOpenAddModal}>{t('review.addSolution')}</Button>}
                    </div>

                    <div className="space-y-3">
                        {task.solutions.length === 0 && <p className="text-gray-500 text-center py-4">Belum ada solusi diajukan.</p>}
                        
                        {task.solutions.map(sol => (
                            <div key={sol.id} className={`p-4 rounded-lg border ${sol.isFeasible ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-gray-900">{sol.title}</h4>
                                    {!isFinal && (
                                        <div className="flex gap-2">
                                            <button onClick={() => handleOpenEditModal(sol)} className="text-xs text-blue-600 hover:underline font-bold">Edit</button>
                                            <span className="text-gray-300">|</span>
                                            <button onClick={() => deleteSolution(task.id, sol.id)} className="text-xs text-red-600 hover:underline">Hapus</button>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-gray-900 mt-1">{sol.description}</p>
                                {sol.attachmentUrl && (
                                    <a href={sol.attachmentUrl} target="_blank" className="text-xs text-blue-600 underline mt-1 block">Lampiran Data Dukung</a>
                                )}
                                <div className="mt-2 flex gap-2">
                                    <span className={`text-xs px-2 py-0.5 rounded font-bold ${sol.isFeasible ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                        {sol.isFeasible ? 'Bisa Dilakukan (OK)' : 'Tidak Bisa (NO)'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* INTER-DIVISION COMMUNICATION */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                         <h4 className="text-sm font-bold text-tvriBlueDark mb-3 flex items-center gap-2">
                             💬 Komunikasi Antar Divisi (Kolaborasi)
                         </h4>
                         
                         {/* Chat Display */}
                         <div className="bg-gray-50 rounded border border-gray-200 p-3 h-48 overflow-y-auto space-y-3 mb-3">
                             {relevantNotes.length === 0 && <p className="text-xs text-gray-400 text-center mt-10">Belum ada catatan diskusi.</p>}
                             {relevantNotes.map(note => {
                                 const isMe = note.senderDivision === currentUser?.division;
                                 return (
                                     <div key={note.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                         <div className={`max-w-[85%] rounded px-3 py-2 text-sm shadow-sm ${
                                             isMe ? 'bg-blue-100 text-blue-900' : 'bg-white border border-gray-200 text-gray-800'
                                         }`}>
                                             <div className="flex justify-between gap-2 mb-1 text-[10px] uppercase font-bold text-gray-500">
                                                 <span>{isMe ? 'Saya' : note.senderDivision}</span>
                                                 <span>&rarr; {note.targetDivision === 'ALL' ? 'SEMUA' : note.targetDivision}</span>
                                             </div>
                                             <p>{note.content}</p>
                                         </div>
                                         <span className="text-[10px] text-gray-400 mt-0.5">
                                             {new Date(note.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                         </span>
                                     </div>
                                 );
                             })}
                         </div>

                         {/* Chat Input */}
                         <div className="flex gap-2 items-start">
                             <div className="flex-1">
                                 <textarea 
                                    className="w-full border text-sm p-2 rounded border-gray-300 focus:ring-tvriBlue focus:border-tvriBlue bg-white text-gray-900" 
                                    rows={2}
                                    placeholder="Tulis catatan/pertanyaan untuk divisi lain..."
                                    value={collabMsg}
                                    onChange={e => setCollabMsg(e.target.value)}
                                 ></textarea>
                             </div>
                             <div className="flex flex-col gap-1">
                                 <select 
                                    className="text-xs border border-gray-300 rounded p-1 bg-white text-gray-800"
                                    value={collabTarget}
                                    onChange={e => setCollabTarget(e.target.value as any)}
                                 >
                                     <option value="ALL">Ke: SEMUA</option>
                                     {involvedDivisions.map(d => (
                                         <option key={d} value={d}>Ke: {d}</option>
                                     ))}
                                 </select>
                                 <Button size="sm" onClick={handleSendNote}>Kirim</Button>
                             </div>
                         </div>
                    </div>

                    {/* Status / Finalize Section */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-gray-700">Status Tugas:</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-bold border ${isFinal ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}`}>
                                {isFinal ? 'FINAL / SELESAI' : 'PENDING (DRAFT)'}
                            </span>
                        </div>

                        {!isFinal ? (
                            <div className="bg-blue-50 p-4 rounded border border-blue-100">
                                <p className="text-sm text-gray-800 mb-3 font-medium">
                                    Pastikan seluruh solusi dan data dukung telah diinput dengan benar. Silakan tentukan hasil akhir review divisi:
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button 
                                        onClick={() => initiateFinalize(TaskStatus.OK)} 
                                        className="flex-1 justify-center py-3 text-base bg-green-600 hover:bg-green-700 focus:ring-green-500"
                                    >
                                        ✅ Finalisasi: SIAP (OK)
                                    </Button>
                                    <Button 
                                        onClick={() => initiateFinalize(TaskStatus.NO)} 
                                        className="flex-1 justify-center py-3 text-base bg-red-600 hover:bg-red-700 focus:ring-red-500"
                                        variant="danger"
                                    >
                                        ❌ Finalisasi: TIDAK BISA (NO)
                                    </Button>
                                </div>
                                <p className="text-xs text-gray-600 mt-3 italic leading-relaxed">
                                    ⚠️ <strong>Catatan Penting:</strong> Dengan menekan tombol finalisasi, tugas ini akan ditandai selesai. Jika seluruh divisi lain juga telah selesai, permintaan akan otomatis masuk ke tahap <strong>Keputusan Eksekutif</strong>.
                                </p>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-4 rounded border border-gray-200 text-center">
                                <p className="text-gray-500 text-sm mb-2">Review telah difinalisasi.</p>
                                <Button size="sm" variant="outline" onClick={() => navigate('/division')}>Kembali ke Inbox</Button>
                            </div>
                        )}
                    </div>
                </div>
           </div>
       </div>

       {/* Block C: Execution History (Conditional) - Full Width Below Columns */}
       {showExecutionHistory && (
            <div className="bg-white p-6 rounded-lg border-2 border-green-600 shadow-sm mt-6">
                <h3 className="font-bold text-green-800 border-b border-green-200 pb-2 mb-4">Blok C: Riwayat Eksekusi</h3>
                <div className="space-y-6">
                    {task.solutions.filter(s => s.isFeasible).length === 0 && (
                        <p className="text-sm text-gray-500 italic">Tidak ada solusi feasible untuk dieksekusi.</p>
                    )}

                    {task.solutions.filter(s => s.isFeasible).map(sol => {
                        // Sort logs descending for timeline view (newest first)
                        const sortedLogs = [...sol.progressLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

                        return (
                            <div key={sol.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold text-gray-900 text-sm">{sol.title}</h4>
                                    <span className="text-xs font-bold px-2 py-0.5 bg-green-100 text-green-800 rounded">
                                        {sol.currentProgress}% Selesai
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
                                    <div className="bg-green-600 h-1.5 rounded-full" style={{ width: `${sol.currentProgress}%` }}></div>
                                </div>
                                
                                {/* Timeline Logs */}
                                <div className="ml-2 border-l-2 border-gray-200 pl-4 space-y-3">
                                    {sortedLogs.length === 0 ? (
                                        <p className="text-xs text-gray-400">Belum ada log aktivitas.</p>
                                    ) : (
                                        sortedLogs.map((log, index) => (
                                            <div key={log.id} className="relative">
                                                <div className={`absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white ${index === 0 ? 'bg-green-600' : 'bg-gray-400'}`}></div>
                                                <p className="text-xs text-gray-500 mb-0.5">
                                                    {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </p>
                                                <p className={`text-sm ${index === 0 ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                                                    Mencapai {log.progressPercent}% - {log.note}
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
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        )}

       {/* Add/Edit Solution Modal */}
       {showAddModal && (
           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
               <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl border-t-4 border-tvriBlue">
                   <h3 className="font-bold text-lg mb-4 text-gray-900">
                       {editingSolutionId ? 'Edit Solusi' : 'Tambah Solusi'}
                   </h3>
                   <div className="space-y-4">
                       <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Judul Solusi</label>
                           <input placeholder="Contoh: Sewa Satelit, Beli Sparepart" className="w-full border border-gray-300 p-2 rounded text-gray-900 bg-white focus:ring-tvriBlue focus:border-tvriBlue" value={solTitle} onChange={e => setSolTitle(e.target.value)} />
                       </div>
                       <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Teknis</label>
                           <textarea placeholder="Detail spesifikasi atau langkah kerja..." rows={3} className="w-full border border-gray-300 p-2 rounded text-gray-900 bg-white focus:ring-tvriBlue focus:border-tvriBlue" value={solDesc} onChange={e => setSolDesc(e.target.value)} />
                       </div>
                       <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Link Lampiran / Data Dukung</label>
                           <input type="url" placeholder="https://..." className="w-full border border-gray-300 p-2 rounded text-gray-900 bg-white focus:ring-tvriBlue focus:border-tvriBlue" value={solLink} onChange={e => setSolLink(e.target.value)} />
                       </div>
                       
                       <label className="flex items-center gap-3 p-3 rounded border border-gray-300 bg-white shadow-sm cursor-pointer hover:bg-gray-50">
                           <input 
                            type="checkbox" 
                            checked={solFeasible} 
                            onChange={e => setSolFeasible(e.target.checked)} 
                            className="h-5 w-5 text-tvriBlue border-gray-300 rounded focus:ring-tvriBlue"
                           />
                           <div className="flex flex-col">
                               <span className="text-sm font-bold text-gray-900">Solusi ini Feasible (Dapat Dilakukan)?</span>
                               <span className="text-xs text-gray-500">Uncheck jika solusi ini adalah penolakan/tidak sanggup.</span>
                           </div>
                       </label>
                   </div>
                   <div className="flex justify-end gap-2 mt-6">
                       <Button variant="secondary" onClick={() => setShowAddModal(false)}>Batal</Button>
                       <Button onClick={handleSaveSolution}>Simpan</Button>
                   </div>
               </div>
           </div>
       )}

       {/* Revision Modal */}
       {showRevModal && (
           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
               <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
                   <h3 className="font-bold text-lg mb-4 text-orange-600">Permintaan Revisi</h3>
                   <p className="text-sm text-gray-800 mb-2">Jelaskan kekurangan pada informasi permintaan:</p>
                   <textarea rows={4} className="w-full border p-2 rounded text-gray-900 bg-white" value={revNote} onChange={e => setRevNote(e.target.value)} />
                   <div className="flex justify-end gap-2 mt-4">
                       <Button variant="secondary" onClick={() => setShowRevModal(false)}>Batal</Button>
                       <Button variant="danger" onClick={handleRequestRevision}>Kirim Revisi</Button>
                   </div>
               </div>
           </div>
       )}

       {/* Finalize Confirmation Custom Modal */}
       {showFinalizeConfirm && (
           <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity">
               <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden transform transition-all scale-100">
                   {/* Modal Header */}
                   <div className={`p-6 border-b flex items-center gap-4 ${pendingStatus === TaskStatus.OK ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                       <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${pendingStatus === TaskStatus.OK ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                           <span className="text-2xl">{pendingStatus === TaskStatus.OK ? '✓' : '✕'}</span>
                       </div>
                       <div>
                           <h3 className={`text-xl font-bold ${pendingStatus === TaskStatus.OK ? 'text-green-800' : 'text-red-800'}`}>
                               {pendingStatus === TaskStatus.OK ? 'Konfirmasi Finalisasi (SIAP)' : 'Konfirmasi Finalisasi (TIDAK BISA)'}
                           </h3>
                           <p className="text-sm text-gray-500">Mohon tinjau keputusan Anda.</p>
                       </div>
                   </div>
                   
                   {/* Modal Body */}
                   <div className="p-6 space-y-4">
                       {pendingStatus === TaskStatus.OK ? (
                           <div className="text-gray-700">
                               <p className="mb-2">Anda menyatakan bahwa divisi <strong>{task.division}</strong> <span className="font-bold text-green-600">SANGGUP/BISA (OK)</span> mengerjakan tugas ini sesuai solusi yang diajukan.</p>
                               <ul className="list-disc list-inside text-sm bg-gray-50 p-3 rounded border border-gray-200 space-y-1">
                                   <li>Status tugas akan dikunci.</li>
                                   <li>Notifikasi akan dikirim ke sistem manajemen.</li>
                                   <li>Jika semua divisi lain juga "OK", permintaan akan lanjut ke Eksekutif.</li>
                               </ul>
                           </div>
                       ) : (
                           <div className="text-gray-700">
                               <p className="mb-2">Anda menyatakan bahwa divisi <strong>{task.division}</strong> <span className="font-bold text-red-600">TIDAK BISA (NO)</span> memenuhi kebutuhan permintaan ini.</p>
                               <p className="text-sm bg-red-50 p-3 rounded border border-red-100 italic">
                                   Tindakan ini menandakan adanya kendala teknis, anggaran, atau sumber daya yang fatal. Permintaan mungkin tidak dapat dilanjutkan.
                               </p>
                           </div>
                       )}
                       <p className="text-sm font-medium text-gray-900 text-center mt-4">
                           Apakah Anda yakin ingin menyelesaikan tugas ini?
                       </p>
                   </div>

                   {/* Modal Footer */}
                   <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                       <Button variant="secondary" onClick={() => setShowFinalizeConfirm(false)}>
                           Batal
                       </Button>
                       <Button 
                           onClick={confirmFinalize}
                           className={pendingStatus === TaskStatus.OK ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                       >
                           Ya, Finalisasi Sekarang
                       </Button>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};
