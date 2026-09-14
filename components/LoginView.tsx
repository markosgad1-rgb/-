import React, { useState } from 'react';
import { User } from '../types';
import { Lock, User as UserIcon, LogIn } from 'lucide-react';

interface LoginViewProps {
  users: User[];
  onLogin: (user: User) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ users, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
    
    if (user) {
      onLogin(user);
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border-t-4 border-primary">
        <div className="text-center mb-8">
          <div className="bg-teal-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
            <Lock size={40} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">تسجيل الدخول</h1>
          <p className="text-gray-500 text-sm mt-1">نظام الحضور والانصراف</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">اسم المستخدم</label>
            <div className="relative">
              <UserIcon size={18} className="absolute top-3 right-3 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                placeholder="ادخل اسم المستخدم"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
            <div className="relative">
              <Lock size={18} className="absolute top-3 right-3 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                placeholder="••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-teal-800 transition-colors flex items-center justify-center gap-2 mt-4 shadow-lg shadow-teal-700/20"
          >
            <LogIn size={20} />
            <span>دخول</span>
          </button>
        </form>
        
        <div className="mt-6 text-center text-xs text-gray-400">
          نسخة تجريبية v1.0
        </div>
      </div>
    </div>
  );
};