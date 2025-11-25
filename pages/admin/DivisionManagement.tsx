
import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Button } from '../../components/Button';
import { DivisionConfig } from '../../types';

export const DivisionManagement: React.FC = () => {
  const { divisions, addDivision, updateDivision, deleteDivision } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State
  const [divId, setDivId] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const openAddModal = () => {
    setIsEditing(false);
    setDivId('');
    setCode('');
    setName('');
    setDescription('');
    setShowModal(true);
  };

  const openEditModal = (div: DivisionConfig) => {
    setIsEditing(true);
    setDivId(div.id);
    setCode(div.code);
    setName(div.name);
    setDescription(div.description || '');
    setShowModal(true);
  };

  const handleSave = () => {
    if (!code || !name) return alert('Kode dan Nama Divisi wajib diisi');

    const divData: DivisionConfig = {
        id: isEditing ? divId : `d-${Date.now()}`,
        code: code.toUpperCase(),
        name,
        description
    };

    if (isEditing) {
        updateDivision(divId, divData);
    } else {
        // Check duplication
        if (divisions.some(d => d.code === code.toUpperCase())) {
            return alert('Kode divisi sudah ada!');
        }
        addDivision(divData);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
      if (window.confirm('Hapus divisi ini?')) {
          deleteDivision(id);
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manajemen Divisi</h2>
        <Button onClick={openAddModal}>+ Tambah Divisi</Button>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                  <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Divisi</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                  {divisions.length === 0 && (
                      <tr>
                          <td colSpan={4} className="px-6 py-4 text-center text-gray-500">Belum ada data divisi.</td>
                      </tr>
                  )}
                  {divisions.map(d => (
                      <tr key={d.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-bold rounded-full bg-blue-100 text-blue-800">
                                  {d.code}
                              </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {d.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                              {d.description || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button onClick={() => openEditModal(d)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                              <button onClick={() => handleDelete(d.id)} className="text-red-600 hover:text-red-900">Hapus</button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>

      {/* Modal */}
      {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-md">
                  <h3 className="text-lg font-bold mb-4">{isEditing ? 'Edit Divisi' : 'Tambah Divisi'}</h3>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-bold text-gray-700">Kode Divisi (Singkatan)</label>
                          <input 
                            className="w-full border p-2 rounded uppercase" 
                            value={code} 
                            onChange={e => setCode(e.target.value.toUpperCase())} 
                            placeholder="Contoh: TEK, KEU, SDM"
                            maxLength={5}
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700">Nama Divisi</label>
                          <input 
                            className="w-full border p-2 rounded" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            placeholder="Nama Lengkap Divisi"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700">Deskripsi</label>
                          <textarea 
                            className="w-full border p-2 rounded" 
                            rows={3}
                            value={description} 
                            onChange={e => setDescription(e.target.value)} 
                            placeholder="Deskripsi tugas divisi..."
                          />
                      </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-2">
                      <Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
                      <Button onClick={handleSave}>Simpan</Button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
