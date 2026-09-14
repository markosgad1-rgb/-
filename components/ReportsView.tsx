import React, { useMemo, useState } from 'react';
import { AttendanceRecord, Task, User } from '../types';
import { formatLocation, mapsLinkFor } from '../services/locationService';
import { FileBarChart, LogIn, LogOut, Navigation, MapPin, CheckCircle2, Briefcase } from 'lucide-react';

interface ReportsViewProps {
  users: User[];
  records: AttendanceRecord[];
  tasks: Task[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ users, records, tasks }) => {
  const [userFilter, setUserFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');

  const userMap = useMemo(() => new Map(users.map(u => [u.id, u])), [users]);
  const taskMap = useMemo(() => new Map(tasks.map(t => [t.id, t])), [tasks]);

  const filtered = useMemo(() => {
    return records
      .filter(r => userFilter === 'all' || r.userId === userFilter)
      .filter(r => !dateFilter || r.timestamp.slice(0, 10) === dateFilter)
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }, [records, userFilter, dateFilter]);

  return (
    <div className="pb-20 pt-4 px-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">تقارير الحضور والانصراف</h2>
        <p className="text-sm text-gray-500 mt-1">{filtered.length} حركة</p>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-5 space-y-3">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">الموظف</label>
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-primary focus:outline-none"
          >
            <option value="all">كل الموظفين</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">التاريخ</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FileBarChart size={48} className="mx-auto mb-3 opacity-30" />
            <p>لا توجد حركات مطابقة</p>
          </div>
        ) : (
          filtered.map(record => {
            const person = userMap.get(record.userId);
            const task = record.taskId ? taskMap.get(record.taskId) : undefined;
            const link = mapsLinkFor(record.location);
            return (
              <div key={record.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-2 rounded-full ${
                        record.type === 'check-in' ? 'bg-teal-50 text-primary' : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      {record.type === 'check-in' ? <LogIn size={16} /> : <LogOut size={16} />}
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 text-sm">{person?.name || 'مستخدم محذوف'}</div>
                      <div className="text-xs text-gray-400">{record.type === 'check-in' ? 'حضور' : 'انصراف'}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 font-mono">
                      {new Date(record.timestamp).toLocaleDateString('ar-EG')}
                    </div>
                    <div className="text-xs text-gray-400 font-mono">
                      {new Date(record.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
                {task && (
                  <div className="flex items-center gap-1 text-xs text-teal-700 bg-teal-50 rounded px-2 py-1 mt-2 w-fit">
                    <Briefcase size={11} /> {task.name}
                  </div>
                )}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <CheckCircle2 size={12} className="text-green-500" /> بصمة مؤكدة
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500" dir="ltr">
                    <MapPin size={12} /> {formatLocation(record.location)}
                  </span>
                  {link && (
                    <a href={link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-blue-600">
                      <Navigation size={11} /> الخريطة
                    </a>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
