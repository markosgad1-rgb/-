import React, { useState } from 'react';
import { User } from '../types';
import { Plus, Trash2, Shield, User as UserIcon, Key } from 'lucide-react';

interface UsersViewProps {
  users: User[];
  currentUserId: string;
  onAddUser: (u: User) => void;
  onDeleteUser: (id: string) => void;
}

export const UsersView: React.FC<UsersViewProps> = ({ users, currentUserId, onAddUser, onDeleteUser }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({ role: 'user' });

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
      role: (formData.role as 'admin' | 'user') || 'user',
    });
    setFormData({ role: 'user' });
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
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
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
                  value={formData.role || 'user'}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:outline-none bg-white"
                >
                  <option value="user">مستخدم (عرض فقط)</option>
                  <option value="admin">مدير (تحكم كامل)</option>
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
              <div className={`p-2 rounded-full ${user.role === 'admin' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600'}`}>
                {user.role === 'admin' ? <Shield size={20} /> : <UserIcon size={20} />}
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{user.name}</h3>
                <div className="flex items-center text-xs text-gray-400 gap-2">
                  <span className="bg-gray-50 px-1.5 rounded border border-gray-100">{user.username}</span>
                  <span>•</span>
                  <span>{user.role === 'admin' ? 'مدير النظام' : 'مستخدم'}</span>
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