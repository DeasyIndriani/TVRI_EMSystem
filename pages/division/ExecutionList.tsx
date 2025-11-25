
import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CaseStatus } from '../../types';
import { Button } from '../../components/Button';

export const ExecutionList: React.FC = () => {
  const { currentUser, subtasks, cases, getCaseProgress } = useStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!currentUser || !currentUser.division) return <div>Access Denied</div>;

  // Filter: Cases IN_EXECUTION where this division has a subtask
  const executionTasks = subtasks.filter(t => 
      t.division === currentUser.division && 
      cases.find(c => c.id === t.caseId)?.status === CaseStatus.IN_EXECUTION
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Eksekusi Divisi {currentUser.division}</h2>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
         <ul className="divide-y divide-gray-200">
             {executionTasks.length === 0 ? (
                 <li className="p-8 text-center text-gray-500">Tidak ada permintaan dalam tahap eksekusi untuk divisi ini.</li>
             ) : (
                 executionTasks.map(task => {
                     const parentCase = cases.find(c => c.id === task.caseId);
                     if (!parentCase) return null;
                     const progress = getCaseProgress(parentCase.id); // Overall progress, but could be specific

                     return (
                         <li key={task.id} className="p-4 hover:bg-gray-50">
                             <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
                                 <div className="flex-1">
                                     <h3 className="text-lg font-bold text-tvriBlue">{parentCase.title}</h3>
                                     <p className="text-sm text-gray-600">{parentCase.description}</p>
                                     <div className="mt-2 flex gap-4 text-xs text-gray-500">
                                         <span>Keputusan Eksekutif: <strong className="text-green-600">{parentCase.executiveDecision}</strong></span>
                                         <span>Deadline: {parentCase.targetDate}</span>
                                     </div>
                                 </div>
                                 <div className="flex items-center gap-4">
                                     <div className="text-right">
                                         <span className="text-xs text-gray-500 block">Progress Permintaan</span>
                                         <span className="font-bold text-lg">{progress}%</span>
                                     </div>
                                     <Button onClick={() => navigate(`/division/executions/${parentCase.id}`)}>
                                         Kelola Eksekusi &rarr;
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
