
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Button } from '../../components/Button';
import { Solution } from '../../types';

export const ExecutionDetail: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const { cases, subtasks, currentUser, addSolutionProgress } = useStore();
  const navigate = useNavigate();
  const [activeSolution, setActiveSolution] = useState<Solution | null>(null);
  
  // Progress Form
  const [progPercent, setProgPercent] = useState(0);
  const [progNote, setProgNote] = useState('');
  const [progLink, setProgLink] = useState('');

  const currentCase = cases.find(c => c.id === caseId);
  if (!currentCase || !currentUser) return <div>Permintaan tidak ditemukan</div>;

  // Find relevant subtask for this user's division
  const myTask = subtasks.find(t => t.caseId === caseId && t.division === currentUser.division);

  const openProgressModal = (sol: Solution) => {
      setActiveSolution(sol);
      setProgPercent(sol.currentProgress);
      setProgNote('');
      setProgLink('');
  };

  const handleSaveProgress = () => {
      if (activeSolution) {
          addSolutionProgress(activeSolution.id, Number(progPercent), progNote, progLink);
          setActiveSolution(null);
      }
  };

  if (!myTask) return <div>Anda tidak memiliki tugas di permintaan ini.</div>;

  return (
    <div className="space-y-6">
        <div className="flex items-center gap-4">
             <Button variant="outline" size="sm" onClick={() => navigate('/division/executions')}>&larr; Kembali</Button>
             <div>
                 <h2 className="text-xl font-bold text-gray-900">Eksekusi: {currentCase.title}</h2>
                 <p className="text-sm text-gray-700">{currentCase.description}</p>
             </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-t-4 border-tvriBlue">
            <h3 className="font-bold text-lg mb-4 text-tvriBlueDark">Daftar Solusi Divisi {currentUser.division}</h3>
            
            <div className="space-y-6">
                {myTask.solutions.map(sol => (
                    <div key={sol.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-bold text-gray-900">{sol.title}</h4>
                                <p className="text-sm text-gray-800">{sol.description}</p>
                                <span className={`text-xs px-2 py-0.5 rounded ${sol.isFeasible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {sol.isFeasible ? 'Feasible' : 'Not Feasible'}
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-tvriBlue">{sol.currentProgress}%</span>
                                <p className="text-xs text-gray-600">Selesai</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                            <div className="bg-tvriBlue h-2.5 rounded-full transition-all duration-500" style={{ width: `${sol.currentProgress}%` }}></div>
                        </div>

                        {sol.isFeasible && sol.currentProgress < 100 && (
                            <Button size="sm" onClick={() => openProgressModal(sol)}>Kelola Progres</Button>
                        )}

                        {/* Logs */}
                        {sol.progressLogs.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-xs font-bold text-gray-600 mb-2">Riwayat Progres:</p>
                                <ul className="space-y-2">
                                    {sol.progressLogs.map(log => (
                                        <li key={log.id} className="text-xs text-gray-700 flex gap-2">
                                            <span className="font-mono text-gray-500">{new Date(log.timestamp).toLocaleDateString()}</span>
                                            <span className="font-bold text-tvriBlue">{log.progressPercent}%</span>
                                            <span>- {log.note}</span>
                                            {log.evidenceUrl && <a href={log.evidenceUrl} target="_blank" className="text-blue-600 underline ml-auto">Bukti</a>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
                {myTask.solutions.length === 0 && <p className="text-gray-500 italic">Tidak ada solusi terdaftar.</p>}
            </div>
        </div>

        {/* Modal */}
        {activeSolution && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg w-full max-w-md">
                    <h3 className="font-bold text-lg mb-4 text-gray-900">Update Progres: {activeSolution.title}</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-800 mb-1">Persentase Capaian (Sekarang: {activeSolution.currentProgress}%)</label>
                            <input 
                                type="range" min={activeSolution.currentProgress} max="100" 
                                value={progPercent} 
                                onChange={e => setProgPercent(Number(e.target.value))}
                                className="w-full accent-tvriBlue"
                            />
                            <div className="text-right font-bold text-tvriBlue text-lg">{progPercent}%</div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-800 mb-1">Catatan Aktivitas</label>
                            <textarea 
                                className="w-full border p-2 rounded text-gray-900 border-gray-300 focus:ring-tvriBlue focus:border-tvriBlue bg-white" 
                                rows={3}
                                value={progNote}
                                onChange={e => setProgNote(e.target.value)}
                                placeholder="Apa yang telah dikerjakan?"
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-800 mb-1">Link Bukti / Dokumen</label>
                            <input 
                                className="w-full border p-2 rounded text-gray-900 border-gray-300 focus:ring-tvriBlue focus:border-tvriBlue bg-white" 
                                type="url"
                                value={progLink}
                                onChange={e => setProgLink(e.target.value)}
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button variant="secondary" onClick={() => setActiveSolution(null)}>Batal</Button>
                        <Button onClick={handleSaveProgress}>Simpan Update</Button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
