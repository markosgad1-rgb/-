
import React, { useState, useEffect } from 'react';
import { Project, Employee, ViewState, User, Report } from './types';
import { ProjectView } from './components/ProjectView';
import { EmployeeView } from './components/EmployeeView';
import { UsersView } from './components/UsersView';
import { LoginView } from './components/LoginView';
import { ReportsView } from './components/ReportsView';
import { FolderKanban, Users, Menu, ShieldCheck, LogOut, ChevronLeft } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>('projects');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Data State
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('app_projects');
    return saved ? JSON.parse(saved) : [];
  });
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('app_employees');
    return saved ? JSON.parse(saved) : [];
  });
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('app_users');
    if (saved) return JSON.parse(saved);
    // Default Admin User if no users exist
    return [{
      id: 'admin-001',
      username: 'admin',
      password: 'admin',
      name: 'المدير العام',
      role: 'admin'
    }];
  });
  const [reports, setReports] = useState<Report[]>(() => {
    const saved = localStorage.getItem('app_reports');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence
  useEffect(() => { localStorage.setItem('app_projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('app_employees', JSON.stringify(employees)); }, [employees]);
  useEffect(() => { localStorage.setItem('app_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('app_reports', JSON.stringify(reports)); }, [reports]);

  // Actions
  const addProject = (p: Project) => setProjects([...projects, p]);
  const deleteProject = (id: string) => setProjects(projects.filter(p => p.id !== id));

  const addEmployee = (e: Employee) => setEmployees([...employees, e]);
  const deleteEmployee = (id: string) => setEmployees(employees.filter(e => e.id !== id));

  const addUser = (u: User) => setUsers([...users, u]);
  const deleteUser = (id: string) => setUsers(users.filter(u => u.id !== id));

  const addReport = (r: Report) => setReports([...reports, r]);
  const deleteReport = (id: string) => setReports(reports.filter(r => r.id !== id));

  const handleLogout = () => {
    setCurrentUser(null);
    setView('projects');
    setIsMenuOpen(false);
  };

  const handleProjectClick = () => {
    setView('projects');
    setIsMenuOpen(false);
  };

  const handleOpenReports = (projectId: string) => {
    setActiveProjectId(projectId);
    setView('project-reports');
  };

  if (!currentUser) {
    return <LoginView users={users} onLogin={setCurrentUser} />;
  }

  const isAdmin = currentUser.role === 'admin';
  const activeProject = projects.find(p => p.id === activeProjectId);

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-right">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40 h-16 flex items-center justify-between px-4 relative">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold text-primary">مدير المشروعات</h1>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-1 text-xs text-red-500 bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-100"
        >
          <LogOut size={14} />
          <span>خروج</span>
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <>
            <div className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px]" onClick={() => setIsMenuOpen(false)} />
            <div className="absolute top-full right-2 mt-1 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden ring-1 ring-black/5 animate-in slide-in-from-top-2 fade-in duration-200">
               <div className="bg-teal-50 p-3 border-b border-teal-100 flex justify-between items-center">
                 <span className="font-bold text-teal-800 text-sm">قائمة المشاريع السريعة</span>
                 <span className="text-xs bg-white text-teal-700 px-2 py-0.5 rounded-full border border-teal-100 font-mono">
                   {projects.length}
                 </span>
               </div>
               <div className="max-h-[60vh] overflow-y-auto">
                 {projects.length === 0 ? (
                   <div className="p-6 text-center text-gray-400 text-sm">
                     <FolderKanban className="mx-auto mb-2 opacity-50" size={24} />
                     لا توجد مشاريع مضافة
                   </div>
                 ) : (
                   projects.map((p) => (
                     <button
                       key={p.id}
                       onClick={handleProjectClick}
                       className="w-full text-right px-4 py-3.5 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50 last:border-0 flex justify-between items-center group transition-colors"
                     >
                       <div className="flex-1 truncate ml-2">
                         <div className="font-bold text-gray-800 truncate">{p.name}</div>
                         <div className="text-[10px] text-gray-400 font-mono mt-0.5">{p.number}</div>
                       </div>
                       <ChevronLeft size={16} className="text-gray-300 group-hover:text-primary transition-colors" />
                     </button>
                   ))
                 )}
               </div>
            </div>
          </>
        )}
      </header>

      {/* Main Content Area */}
      <main className="max-w-md mx-auto min-h-[calc(100vh-8rem)]">
        {view === 'projects' && (
          <ProjectView 
            projects={projects} 
            isAdmin={isAdmin}
            onAddProject={addProject} 
            onDeleteProject={deleteProject}
            onOpenReports={handleOpenReports}
          />
        )}
        {view === 'project-reports' && activeProject && (
          <ReportsView 
            project={activeProject}
            reports={reports.filter(r => r.projectId === activeProjectId)}
            isAdmin={isAdmin}
            onAddReport={addReport}
            onDeleteReport={deleteReport}
            onBack={() => setView('projects')}
          />
        )}
        {view === 'employees' && (
          <EmployeeView 
            employees={employees} 
            isAdmin={isAdmin}
            onAddEmployee={addEmployee} 
            onDeleteEmployee={deleteEmployee} 
          />
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
      {view !== 'project-reports' && (
        <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
          <div className={`max-w-md mx-auto flex items-center h-16 ${isAdmin ? 'justify-between px-8' : 'justify-around'}`}>
            <button 
              onClick={() => setView('projects')}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${view === 'projects' ? 'text-primary font-bold' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <FolderKanban size={view === 'projects' ? 24 : 22} strokeWidth={view === 'projects' ? 2.5 : 2} />
              <span className="text-[10px]">المشاريع</span>
            </button>
            
            <button 
              onClick={() => setView('employees')}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${view === 'employees' ? 'text-primary font-bold' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Users size={view === 'employees' ? 24 : 22} strokeWidth={view === 'employees' ? 2.5 : 2} />
              <span className="text-[10px]">الموظفين</span>
            </button>

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
      )}
    </div>
  );
}
