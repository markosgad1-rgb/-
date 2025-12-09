import React, { useState } from 'react';
import { Employee } from '../types';
import { Plus, Trash2, Users, MapPin, CreditCard, Phone, Briefcase } from 'lucide-react';

interface EmployeeViewProps {
  employees: Employee[];
  isAdmin: boolean;
  onAddEmployee: (e: Employee) => void;
  onDeleteEmployee: (id: string) => void;
}

export const EmployeeView: React.FC<EmployeeViewProps> = ({ employees, isAdmin, onAddEmployee, onDeleteEmployee }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Employee>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobileNumber) return;

    onAddEmployee({
      id: crypto.randomUUID(),
      name: formData.name!,
      jobTitle: formData.jobTitle || 'موظف',
      accountNumber: formData.accountNumber || '',
      mobileNumber: formData.mobileNumber!,
      address: formData.address || '',
    });
    setFormData({});
    setIsFormOpen(false);
  };

  return (
    <div className="pb-20 pt-4 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">سجل الموظفين</h2>
        {isAdmin && (
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-primary text-white p-2 rounded-full shadow-lg hover:bg-teal-800 transition-colors"
          >
            <Plus size={24} />
          </button>
        )}
      </div>

      {isFormOpen && isAdmin && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-4 text-primary">إضافة موظف جديد</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">الاسم <span className="text-red-500">*</span></label>
                <input
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="الاسم الثلاثي"
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
                  placeholder="مثال: محاسب، مهندس موقع"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">رقم الموبايل <span className="text-red-500">*</span></label>
                <input
                  name="mobileNumber"
                  type="tel"
                  value={formData.mobileNumber || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="01xxxxxxxxx"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">رقم الحساب البنكي</label>
                <input
                  name="accountNumber"
                  value={formData.accountNumber || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="SAOxxxxxxxx"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">عنوان السكن</label>
                <input
                  name="address"
                  value={formData.address || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="المدينة، الشارع"
                />
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
        {employees.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <Users size={48} className="mx-auto mb-2 opacity-50" />
            <p>لا يوجد موظفين مسجلين</p>
          </div>
        ) : (
          employees.map(emp => (
            <div key={emp.id} className="bg-white rounded-xl shadow-sm border-r-4 border-r-primary border-t border-b border-l border-gray-100 overflow-hidden">
              <div className="p-4 flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-800 text-lg">{emp.name}</h3>
                    {emp.jobTitle && (
                      <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-100">
                        {emp.jobTitle}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 mt-3">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Phone size={14} className="ml-2 text-primary shrink-0" />
                      <span dir="ltr" className="text-right font-medium">{emp.mobileNumber}</span>
                    </div>
                    
                    {emp.accountNumber && (
                       <div className="flex items-center text-gray-600 text-sm">
                        <CreditCard size={14} className="ml-2 text-primary shrink-0" />
                        <span className="font-mono text-xs bg-gray-50 px-1 rounded">{emp.accountNumber}</span>
                      </div>
                    )}
                    
                    {emp.address && (
                       <div className="flex items-center text-gray-600 text-sm">
                        <MapPin size={14} className="ml-2 text-primary shrink-0" />
                        <span className="truncate">{emp.address}</span>
                      </div>
                    )}
                  </div>
                </div>
                {isAdmin && (
                  <button 
                    onClick={() => onDeleteEmployee(emp.id)}
                    className="text-gray-300 p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors -ml-2"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};