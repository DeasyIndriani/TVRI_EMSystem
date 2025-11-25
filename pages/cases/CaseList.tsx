
import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { CaseStatus } from '../../types';

export const CaseList: React.FC = () => {
  const { cases, subtasks, getCaseProgress, currentUser } = useStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Local State for Filters
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Load filters from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('tvri_case_filters');
    if (saved) {
      const parsed = JSON.parse(saved);
      setFilterStatus(parsed.status || 'ALL');
      setSortBy(parsed.sort || 'newest');
    }
  }, []);

  // Save filters to localStorage
  useEffect(() => {
    localStorage.setItem('tvri_case_filters', JSON.stringify({
      status: filterStatus,
      sort: sortBy
    }));
  }, [filterStatus, sortBy]);

  // --- Filter Logic Based on Role ---
  let myCases = cases;

  if (currentUser?.role === 'requester') {
      // Requester only sees their own cases
      myCases = cases.filter(c => c.requesterId === currentUser.id);
  } else if (currentUser?.role === 'reviewer') {
      // Reviewer sees cases where they are the requester OR their division has a subtask
      myCases = cases.filter(c => 
          c.requesterId === currentUser.id || 
          subtasks.some(t => t.caseId === c.id && t.division === currentUser.division)
      );
  } 
  // Admin and Executive see ALL cases (no filtering needed on top of 'cases')

  const filteredCases = myCases
    .filter(c => filterStatus === 'ALL' || c.status === filterStatus)
    .filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const getStatusColor = (status: CaseStatus) => {
    switch(status) {
      case CaseStatus.COMPLETED: return 'bg-green-100 text-green-800 border-green-200';
      case CaseStatus.APPROVED: return 'bg-green-100 text-green-800 border-green-200';
      case CaseStatus.IN_ASSESSMENT: return 'bg-tvriBlueLight text-tvriBlueDark border-blue-200';
      case CaseStatus.IN_EXECUTION: return 'bg-blue-600 text-white border-blue-700';
      case CaseStatus.WAITING_EXEC_DECISION: return 'bg-purple-100 text-purple-800 border-purple-200';
      case CaseStatus.NEW: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case CaseStatus.REVISION: return 'bg-orange-100 text-orange-800 border-orange-200';
      case CaseStatus.REJECTED: return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-900">{t('nav.cases')}</h2>
        
        {/* Only Allow Create for Requester and Admin */}
        {(currentUser?.role === 'requester' || currentUser?.role === 'admin') && (
            <Button onClick={() => navigate('/cases/new')}>
              + {t('case.new')}
            </Button>
        )}
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full">
            <input 
                type="text" 
                placeholder={t('list.search')} 
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-tvriBlue focus:border-tvriBlue sm:text-sm p-2 border bg-white text-gray-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
        <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:ring-tvriBlue focus:border-tvriBlue sm:text-sm p-2 border bg-white text-gray-900"
        >
            <option value="ALL">Semua Status</option>
            {Object.keys(CaseStatus).map(s => (
                <option key={s} value={s}>{t(`status.${s}`)}</option>
            ))}
        </select>
        <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border-gray-300 rounded-md shadow-sm focus:ring-tvriBlue focus:border-tvriBlue sm:text-sm p-2 border bg-white text-gray-900"
        >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
        </select>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredCases.length === 0 ? (
             <li className="px-6 py-4 text-center text-gray-500">{t('common.noData')}</li>
          ) : (
            filteredCases.map((c) => {
              const progress = getCaseProgress(c.id);
              return (
                <li key={c.id}>
                  <div 
                    onClick={() => navigate(`/cases/${c.id}`)}
                    className="block hover:bg-gray-50 cursor-pointer transition duration-150 ease-in-out"
                  >
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <p className="text-sm font-medium text-tvriBlue truncate">
                            {c.title}
                            </p>
                            {c.urgency === 'CRITICAL' && (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-600 text-white animate-pulse">
                                    CRITICAL
                                </span>
                            )}
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(c.status)}`}>
                            {t(`status.${c.status}`)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex flex-col">
                          <p className="flex items-center text-sm text-gray-500">
                            {c.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                             Target: {c.targetDate || '-'} | Lokasi: {c.location || '-'} | Req: {c.requesterName}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>Progress: {progress}%</p>
                          <div className="ml-2 w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-tvriBlue" 
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
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
