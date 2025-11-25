
import React from 'react';
import { useStore } from '../../store/useStore';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { CaseStatus, Urgency } from '../../types';

export const ExecutiveKPI: React.FC = () => {
  const { cases } = useStore();
  const navigate = useNavigate();

  // Status Distribution
  const statusData = Object.values(CaseStatus).map(status => ({
    name: status.replace('_', ' '),
    value: cases.filter(c => c.status === status).length
  })).filter(d => d.value > 0);

  const STATUS_COLORS = ['#9CA3AF', '#FBBF24', '#F59E0B', '#8B5CF6', '#3B82F6', '#10B981', '#EF4444', '#059669'];

  // Urgency Distribution
  const urgencyData = Object.values(Urgency).map(u => ({
      name: u,
      value: cases.filter(c => c.urgency === u).length
  }));

  // SLA Analysis (Simple: Created vs Updated diff for Completed cases)
  const completedCases = cases.filter(c => c.status === CaseStatus.COMPLETED);
  const avgSLA = completedCases.length > 0 
    ? completedCases.reduce((acc, c) => {
        const diff = new Date(c.updatedAt).getTime() - new Date(c.createdAt).getTime();
        return acc + diff;
    }, 0) / completedCases.length / (1000 * 3600 * 24) // in days
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/executive')}>&larr; Kembali ke Cockpit</Button>
        <h2 className="text-2xl font-bold text-gray-900">KPI & Statistik</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-sm text-gray-500 uppercase">Rata-rata Penyelesaian</p>
              <p className="text-3xl font-bold text-tvriBlue">{avgSLA.toFixed(1)} <span className="text-sm text-gray-400 font-normal">Hari</span></p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-sm text-gray-500 uppercase">Permintaan Selesai</p>
              <p className="text-3xl font-bold text-green-600">{completedCases.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-sm text-gray-500 uppercase">Permintaan Ditolak</p>
              <p className="text-3xl font-bold text-red-600">{cases.filter(c => c.status === CaseStatus.REJECTED).length}</p>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold mb-4">Distribusi Status Permintaan</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {statusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
              </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold mb-4">Permintaan per Urgensi</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={urgencyData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#0A64BC" />
                    </BarChart>
                </ResponsiveContainer>
              </div>
          </div>
      </div>
    </div>
  );
};
