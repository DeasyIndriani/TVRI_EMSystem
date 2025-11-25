
import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Role, Division } from '../types';
import { Button } from '../components/Button';

export const Login: React.FC = () => {
  const { login, divisions } = useStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [selectedRole, setSelectedRole] = useState<Role>('requester');
  const [selectedDivision, setSelectedDivision] = useState<Division>('TEK');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole, selectedRole === 'reviewer' ? selectedDivision : undefined);
    
    // Redirect based on role
    if (selectedRole === 'executive') navigate('/executive');
    else if (selectedRole === 'reviewer') navigate('/division');
    else navigate('/cases');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="h-24 w-24 bg-tvriBlue rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-3xl font-bold tracking-widest">TVRI</span>
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-tvriBlueDark">
          {t('login.title')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Silakan pilih peran untuk simulasi masuk
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border-t-4 border-tvriBlue">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                {t('login.selectRole')}
              </label>
              <select
                id="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as Role)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-tvriBlue focus:border-tvriBlue sm:text-sm rounded-md border bg-white text-gray-900"
              >
                <option value="requester">{t('roles.requester')}</option>
                <option value="reviewer">{t('roles.reviewer')}</option>
                <option value="executive">{t('roles.executive')}</option>
                <option value="admin">{t('roles.admin')}</option>
              </select>
            </div>

            {selectedRole === 'reviewer' && (
              <div>
                <label htmlFor="division" className="block text-sm font-medium text-gray-700">
                  Divisi
                </label>
                <select
                  id="division"
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value as Division)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-tvriBlue focus:border-tvriBlue sm:text-sm rounded-md border bg-white text-gray-900"
                >
                  {divisions.map(d => (
                    <option key={d.id} value={d.code}>{d.code} - {d.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <Button type="submit" className="w-full">
                {t('login.button')}
              </Button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Sistem Mock Data
                </span>
              </div>
            </div>
            <div className="mt-2 text-xs text-center text-gray-400">
              Data disimpan di LocalStorage browser Anda.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
