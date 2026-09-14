import React, { useState } from 'react';
import { Task, User } from '../types';
import { getCurrentLocation, LocationError, mapsLinkFor } from '../services/locationService';
import { Plus, Trash2, Briefcase, MapPin, Users, Navigation, Loader2, Crosshair } from 'lucide-react';

interface TasksViewProps {
  tasks: Task[];
  users: User[];
  onAddTask: (t: Task) => void;
  onDeleteTask: (id: string) => void;
}

const DEFAULT_RADIUS = 200;

export const TasksView: React.FC<TasksViewProps> = ({ tasks, users, onAddTask, onDeleteTask }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radiusMeters, setRadiusMeters] = useState(String(DEFAULT_RADIUS));
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setName('');
    setSelectedEmployeeIds([]);
    setLatitude('');
    setLongitude('');
    setRadiusMeters(String(DEFAULT_RADIUS));
    setError('');
  };

  const toggleEmployee = (id: string) => {
    setSelectedEmployeeIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const useCurrentLocation = async () => {
    setError('');
    setIsLocating(true);
    try {
      const location = await getCurrentLocation();
      setLatitude(location.latitude.toFixed(6));
      setLongitude(location.longitude.toFixed(6));
    } catch (err) {
      setError(err instanceof LocationError ? err.message : 'تعذر تحديد الموقع الحالي');
    } finally {
      setIsLocating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const radius = parseInt(radiusMeters, 10);

    if (!name.trim()) { setError('اكتب اسم المهمة'); return; }
    if (Number.isNaN(lat) || Number.isNaN(lng)) { setError('حدد موقع المهمة (خط العرض وخط الطول)'); return; }
    if (Number.isNaN(radius) || radius <= 0) { setError('حدد نطاق الموقع بالمتر'); return; }

    onAddTask({
      id: crypto.randomUUID(),
      name: name.trim(),
      employeeIds: selectedEmployeeIds,
      location: { latitude: lat, longitude: lng, radiusMeters: radius },
    });
    resetForm();
    setIsFormOpen(false);
  };

  const employeeName = (id: string) => users.find(u => u.id === id)?.name || 'موظف محذوف';

  return (
    <div className="pb-20 pt-4 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">المهام والمواقع</h2>
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
            <h3 className="text-xl font-bold mb-4 text-primary">إضافة مهمة جديدة</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">اسم المهمة <span className="text-red-500">*</span></label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="مثال: مشروع برج التحرير"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">الموظفون المكلّفون</label>
                <div className="border border-gray-200 rounded-lg max-h-36 overflow-y-auto divide-y divide-gray-50">
                  {users.length === 0 ? (
                    <p className="text-xs text-gray-400 p-3 text-center">لا يوجد مستخدمون بعد</p>
                  ) : (
                    users.map(u => (
                      <label key={u.id} className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={selectedEmployeeIds.includes(u.id)}
                          onChange={() => toggleEmployee(u.id)}
                          className="accent-primary"
                        />
                        <span className="text-gray-700">{u.name}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">موقع المهمة <span className="text-red-500">*</span></label>
                <button
                  type="button"
                  onClick={useCurrentLocation}
                  disabled={isLocating}
                  className="w-full flex items-center justify-center gap-2 border border-primary text-primary rounded-lg py-2 text-sm font-bold hover:bg-teal-50 disabled:opacity-60"
                >
                  {isLocating ? <Loader2 size={16} className="animate-spin" /> : <Crosshair size={16} />}
                  استخدام موقعي الحالي
                </button>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <input
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="خط العرض"
                    dir="ltr"
                    inputMode="decimal"
                  />
                  <input
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="خط الطول"
                    dir="ltr"
                    inputMode="decimal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">النطاق المسموح به (بالمتر)</label>
                <input
                  value={radiusMeters}
                  onChange={(e) => setRadiusMeters(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="200"
                  dir="ltr"
                  inputMode="numeric"
                />
                <p className="text-[11px] text-gray-400 mt-1">لن يتمكن الموظف من تسجيل الحضور إذا كان أبعد من هذا النطاق عن الموقع.</p>
              </div>

              {error && <div className="text-red-500 text-xs bg-red-50 p-2 rounded text-center">{error}</div>}

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => { resetForm(); setIsFormOpen(false); }}
                  className="flex-1 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200"
                >
                  إلغاء
                </button>
                <button type="submit" className="flex-1 py-3 text-white bg-primary rounded-xl hover:bg-teal-800">
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <Briefcase size={48} className="mx-auto mb-2 opacity-50" />
            <p>لا توجد مهام مضافة بعد</p>
          </div>
        ) : (
          tasks.map(task => {
            const link = mapsLinkFor(task.location);
            return (
              <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-800 text-lg">{task.name}</h3>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="text-gray-300 p-1.5 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors -mt-1 -ml-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
                  <Users size={13} className="text-primary" />
                  {task.employeeIds.length === 0 ? (
                    <span>لا يوجد موظفون مكلّفون</span>
                  ) : (
                    <span className="truncate">{task.employeeIds.map(employeeName).join('، ')}</span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1" dir="ltr">
                    <MapPin size={13} /> {task.location.latitude.toFixed(5)}, {task.location.longitude.toFixed(5)}
                  </span>
                  <span>نطاق {task.location.radiusMeters} م</span>
                </div>

                {link && (
                  <a href={link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 mt-2">
                    <Navigation size={11} /> عرض على الخريطة
                  </a>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
