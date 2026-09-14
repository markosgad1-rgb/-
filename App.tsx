
import React, { useState, useEffect } from 'react';
import { AttendanceRecord, User, ViewState } from './types';
import { AttendanceView } from './components/AttendanceView';
import { UsersView } from './components/UsersView';
import { LoginView } from './components/LoginView';
import { ReportsView } from './components/ReportsView';
import { Fingerprint, ShieldCheck, LogOut, FileBarChart } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>('attendance');

  // Data State
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('app_users');
    if (saved) return JSON.parse(saved);
    // Default Admin User if no users exist
    return [{
      id: 'admin-001',
      username: 'admin',
      password: 'admin',
      name: 'المدير العام',
      role: 'admin',
    }];
  });
  const [records, setRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('app_records');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence
  useEffect(() => { localStorage.setItem('app_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('app_records', JSON.stringify(records)); }, [records]);

  // Actions
  const addUser = (u: User) => setUsers([...users, u]);
  const deleteUser = (id: string) => setUsers(users.filter(u => u.id !== id));
  const addRecord = (r: AttendanceRecord) => setRecords([...records, r]);

  const handleLogout = () => {
    setCurrentUser(null);
    setView('attendance');
  };

  if (!currentUser) {
    return <LoginView users={users} onLogin={setCurrentUser} />;
  }

  const isAdmin = currentUser.role === 'admin';
  const canSeeReports = currentUser.role === 'admin' || currentUser.role === 'manager';

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-right">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40 h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="bg-teal-50 text-primary p-2 rounded-lg">
            <Fingerprint size={20} />
          </div>
          <h1 className="text-lg font-bold text-primary">الحضور والانصراف</h1>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-xs text-red-500 bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-100"
        >
          <LogOut size={14} />
          <span>خروج</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="max-w-md mx-auto min-h-[calc(100vh-8rem)]">
        {view === 'attendance' && (
          <AttendanceView user={currentUser} records={records} onAddRecord={addRecord} />
        )}
        {view === 'reports' && canSeeReports && (
          <ReportsView users={users} records={records} />
        )}
        {view === 'users' && isAdmin && (
          <UsersView
            users={users}
            currentUserId={currentUser.id}
            onAddUser={addUser}
            onDeleteUser={deleteUser}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
        <div className={`max-w-md mx-auto flex items-center h-16 ${isAdmin ? 'justify-between px-6' : canSeeReports ? 'justify-around' : 'justify-center'}`}>
          <button
            onClick={() => setView('attendance')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${view === 'attendance' ? 'text-primary font-bold' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Fingerprint size={view === 'attendance' ? 24 : 22} strokeWidth={view === 'attendance' ? 2.5 : 2} />
            <span className="text-[10px]">الحضور</span>
          </button>

          {canSeeReports && (
            <button
              onClick={() => setView('reports')}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${view === 'reports' ? 'text-primary font-bold' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <FileBarChart size={view === 'reports' ? 24 : 22} strokeWidth={view === 'reports' ? 2.5 : 2} />
              <span className="text-[10px]">التقارير</span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => setView('users')}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${view === 'users' ? 'text-teal-800 font-bold' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <ShieldCheck size={view === 'users' ? 24 : 22} strokeWidth={view === 'users' ? 2.5 : 2} />
              <span className="text-[10px]">المستخدمين</span>
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}
