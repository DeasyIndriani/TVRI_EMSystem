
import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Button } from '../../components/Button';
import { Role, Division, User } from '../../types';

export const UserManagement: React.FC = () => {
  const { users, updateUser, addUser, deleteUser, currentUser, divisions } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('requester');
  const [division, setDivision] = useState<Division | ''>('');

  const openAddModal = () => {
    setIsEditing(false);
    setUserId('');
    setName('');
    setRole('requester');
    setDivision('');
    setShowModal(true);
  };

  const openEditModal = (user: User) => {
    setIsEditing(true);
    setUserId(user.id);
    setName(user.name);
    setRole(user.role);
    setDivision(user.division || '');
    setShowModal(true);
  };

  const handleSave = () => {
    if (!name) return alert('Nama wajib diisi');
    if (role === 'reviewer' && !division) return alert('Role Reviewer wajib memiliki Divisi');

    const userData: any = {
        name,
        role,
        division: role === 'reviewer' ? division : undefined,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
    };

    if (isEditing) {
        updateUser(userId, userData);
    } else {
        addUser({
            id: `u-${Date.now()}`,
            ...userData
        });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
      if (window.confirm('Hapus user ini?')) {
          deleteUser(id);
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manajemen User</h2>
        <Button onClick={openAddModal}>+ Tambah User</Button>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                  <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Divisi</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                  {users.map(u => (
                      <tr key={u.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                  <img className="h-10 w-10 rounded-full" src={u.avatar} alt="" />
                                  <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{u.name}</div>
                                      <div className="text-xs text-gray-500">ID: {u.id}</div>
                                  </div>
                              </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${u.role === 'admin' ? 'bg-gray-100 text-gray-800' : 
                                  u.role === 'executive' ? 'bg-purple-100 text-purple-800' :
                                  u.role === 'reviewer' ? 'bg-blue-100 text-blue-800' : 
                                  'bg-green-100 text-green-800'}`}>
                                  {u.role.toUpperCase()}
                              </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {u.division || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button onClick={() => openEditModal(u)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                              {u.id !== currentUser?.id && (
                                  <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:text-red-900">Hapus</button>
                              )}
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
                  <h3 className="text-lg font-bold mb-4">{isEditing ? 'Edit User' : 'Tambah User'}</h3>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-bold text-gray-700">Nama Lengkap</label>
                          <input className="w-full border p-2 rounded" value={name} onChange={e => setName(e.target.value)} />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700">Role</label>
                          <select className="w-full border p-2 rounded" value={role} onChange={e => setRole(e.target.value as Role)}>
                              <option value="requester">Requester</option>
                              <option value="reviewer">Reviewer</option>
                              <option value="executive">Executive</option>
                              <option value="admin">Admin</option>
                          </select>
                      </div>
                      {role === 'reviewer' && (
                          <div>
                              <label className="block text-sm font-bold text-gray-700">Divisi</label>
                              <select className="w-full border p-2 rounded" value={division} onChange={e => setDivision(e.target.value as Division)}>
                                  <option value="">Pilih Divisi...</option>
                                  {divisions.map(d => <option key={d.id} value={d.code}>{d.code} - {d.name}</option>)}
                              </select>
                          </div>
                      )}
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
