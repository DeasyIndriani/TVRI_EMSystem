
import React from 'react';
import { useStore } from '../../store/useStore';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { TaskStatus, CaseStatus } from '../../types';
import { Button } from '../../components/Button';

export const DivisionDashboard: React.FC = () => {
  const { currentUser, subtasks, cases } = useStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  if (!currentUser || !currentUser.division) return <div className="p-8 text-center text-red-600">Access Denied: No Division Assigned</div>;

  const getCaseInfo = (caseId: string) => cases.find(c => c.id === caseId);

  // Filter tasks: Show all tasks where the case is in the Assessment/Planning phase
  const myTasks = subtasks.filter(t => {
      if (t.division !== currentUser.division) return false;
      
      const parentCase = getCaseInfo(t.caseId);
      if (!parentCase) return false;

      // Include statuses: NEW, IN_ASSESSMENT, REVISION
      // Exclude: WAITING_EXEC_DECISION (Wait for Exec), IN_EXECUTION (Execution phase), COMPLETED, REJECTED, APPROVED
      // This ensures the Inbox only contains items that require active attention/work.
      // Once finalized and waiting for decision, it disappears from Inbox (still visible in Case List).
      const ongoingStatuses = [CaseStatus.NEW, CaseStatus.IN_ASSESSMENT, CaseStatus.REVISION];
      return ongoingStatuses.includes(parentCase.status);
  }).sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
            {t('review.myInbox')} - Divisi {currentUser.division}
        </h2>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
            {myTasks.length === 0 ? (
                <li className="p-12 text-center text-gray-500 text-lg flex flex-col items-center justify-center">
                    <span className="text-4xl mb-2">📭</span>
                    <span>{t('common.noData')}</span>
                    <p className="text-sm text-gray-400 mt-2">Tidak ada tugas aktif yang perlu dikerjakan.</p>
                </li>
            ) : (
                myTasks.map(task => {
                    const parentCase = getCaseInfo(task.caseId);
                    if (!parentCase) return null;

                    const isTaskFinal = task.status === TaskStatus.OK || task.status === TaskStatus.NO || task.status === TaskStatus.DONE;

                    return (
                        <li key={task.id} className={`p-4 hover:bg-gray-50 transition-colors ${isTaskFinal ? 'bg-gray-50 opacity-90' : ''}`}>
                            <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                            task.status === TaskStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                                            task.status === TaskStatus.REVISION ? 'bg-orange-100 text-orange-800' :
                                            task.status === TaskStatus.OK ? 'bg-green-100 text-green-800' :
                                            task.status === TaskStatus.NO ? 'bg-red-100 text-red-800' :
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                            {t(`task.${task.status}`)}
                                        </span>
                                        <span className="text-xs text-gray-700">
                                            Update: {new Date(task.updatedAt).toLocaleDateString()}
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded border ${
                                          parentCase.status === CaseStatus.WAITING_EXEC_DECISION ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-gray-100 text-gray-600 border-gray-200'
                                        }`}>
                                            Status Permintaan: {t(`status.${parentCase.status}`)}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-tvriBlue">{parentCase.title}</h3>
                                    <p className="text-sm text-gray-800 mb-1">{parentCase.description.substring(0, 100)}...</p>
                                    <p className="text-xs text-gray-700">
                                        Requester: {parentCase.requesterName} | Urgensi: {parentCase.urgency}
                                    </p>
                                </div>
                                
                                <div>
                                    <Button onClick={() => navigate(`/division/subtasks/${task.id}`)}>
                                        {isTaskFinal ? 'Lihat Detail' : 'Proses / Review →'}
                                    </Button>
                                </div>
                            </div>
                        </li>
                    );
                })
            )}
        </ul>
      </div>
    </div>
  );
};
