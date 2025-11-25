
import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { CaseStatus } from '../../types';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';

export const KnowledgeBase: React.FC = () => {
  const { cases } = useStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Filter archived cases
  const archivedCases = cases.filter(c => 
      c.status === CaseStatus.COMPLETED || 
      c.status === CaseStatus.REJECTED || 
      c.status === CaseStatus.APPROVED
  ).filter(c => 
      c.title.toLowerCase().includes(search.toLowerCase()) || 
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleClone = (caseId: string) => {
      // In a real app, we might pass state via router location, 
      // but here we rely on the user manually selecting in the "Clone" tab of NewCase.
      // Or we can navigate with state to pre-fill. 
      // For now, let's just navigate to New Case and let them pick from the clone list there.
      navigate('/cases/new'); 
      // Ideally pass state: navigate('/cases/new', { state: { cloneId: caseId } });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Knowledge Base (Arsip Permintaan)</h2>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
          <input 
            type="text" 
            placeholder="Cari arsip permintaan..." 
            className="w-full border p-2 rounded text-gray-900 border-gray-300 focus:ring-tvriBlue focus:border-tvriBlue bg-white"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {archivedCases.length === 0 && <p className="col-span-3 text-center text-gray-500 py-8">Tidak ada data arsip.</p>}
          
          {archivedCases.map(c => (
              <div key={c.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-100 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2">
                      <span className={`text-xs px-2 py-1 rounded font-bold ${c.status === CaseStatus.COMPLETED ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {c.status}
                      </span>
                      <span className="text-xs text-gray-600">{new Date(c.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-lg font-bold text-tvriBlue mb-2">{c.title}</h3>
                  <p className="text-gray-800 text-sm flex-1">{c.description.substring(0, 150)}...</p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                          <button onClick={() => navigate(`/cases/${c.id}`)} className="text-sm text-tvriBlue hover:underline">Lihat Detail</button>
                          <Button size="sm" variant="secondary" onClick={() => handleClone(c.id)}>Jadikan Template</Button>
                      </div>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};
