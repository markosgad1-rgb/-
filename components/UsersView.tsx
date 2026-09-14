import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Plus, Trash2, Shield, UserCog, User as UserIcon } from 'lucide-react';

interface UsersViewProps {
  users: User[];
  currentUserId: string;
  onAddUser: (u: User) => void;
  onDeleteUser: (id: string) => void;
}

const ROLE_LABEL: Record<UserRole, string> = {
  admin: 'مدير عام',
  manager: 'مدير',
  employee: 'موظف',
};

const roleIcon = (role: UserRole) => {
  switch (role) {
    case 'admin': return <Shield size={20} />;
    case 'manager': return <UserCog size={20} />;
    default: return <UserIcon size={20} />;
  }
};

const roleColor = (role: UserRole) => {
  switch (role) {
    case 'admin': return 'bg-amber-100 text-amber-600';
    case 'manager': return 'bg-blue-100 text-blue-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};

export const UsersView: React.FC<UsersViewProps> = ({ users, currentUserId, onAddUser, onDeleteUser }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({ role: 'employee' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.name) return;

    onAddUser({
      id: crypto.randomUUID(),
      name: formData.name!,
      username: formData.username!,
      password: formData.password!,
      role: (formData.role as UserRole) || 'employee',
      jobTitle: formData.jobTitle || '',
      mobileNumber: formData.mobileNumber || '',
    });
    setFormData({ role: 'employee' });
    setIsFormOpen(false);
  };

  return (
    <div className="pb-20 pt-4 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">إدارة المستخدمين</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-primary text-white p-2 rounded-full shadow-lg hover:bg-teal-800 transition-colors"
        >
          <Plus size={24} />
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-4 text-primary">إضافة مستخدم جديد</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">الاسم الكامل</label>
                <input
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="اسم الموظف"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">المسمى الوظيفي</label>
                <input
                  name="jobTitle"
                  value={formData.jobTitle || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="مثال: محاسب، مندوب مبيعات"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">رقم الموبايل</label>
                <input
                  name="mobileNumber"
                  type="tel"
                  value={formData.mobileNumber || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="01xxxxxxxxx"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">اسم المستخدم (للدخول)</label>
                <input
                  name="username"
                  value={formData.username || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="username"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">كلمة المرور</label>
                <input
                  name="password"
                  value={formData.password || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="******"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">الصلاحية</label>
                <select
                  name="role"
                  value={formData.role || 'employee'}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:outline-none bg-white"
                >
                  <option value="employee">موظف (تسجيل حضور فقط)</option>
                  <option value="manager">مدير (متابعة وتقارير)</option>
                  <option value="admin">مدير عام (تحكم كامل)</option>
                </select>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-white bg-primary rounded-xl hover:bg-teal-800"
                >
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {users.map(user => (
          <div key={user.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${roleColor(user.role)}`}>
                {roleIcon(user.role)}
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{user.name}</h3>
                <div className="flex items-center text-xs text-gray-400 gap-2 flex-wrap">
                  <span className="bg-gray-50 px-1.5 rounded border border-gray-100">{user.username}</span>
                  <span>•</span>
                  <span>{ROLE_LABEL[user.role]}</span>
                  {user.jobTitle && (
                    <>
                      <span>•</span>
                      <span>{user.jobTitle}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {user.id !== currentUserId && (
              <button
                onClick={() => onDeleteUser(user.id)}
                className="text-red-400 p-2 hover:bg-red-50 rounded-full"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
