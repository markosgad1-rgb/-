import React, { useMemo, useState } from 'react';
import { AttendanceRecord, User } from '../types';
import { verifyBiometric, BiometricError } from '../services/biometricService';
import { getCurrentLocation, LocationError, formatLocation, mapsLinkFor } from '../services/locationService';
import { Fingerprint, MapPin, LogIn, LogOut, Loader2, CheckCircle2, Navigation, Clock } from 'lucide-react';

interface AttendanceViewProps {
  user: User;
  records: AttendanceRecord[];
  onAddRecord: (r: AttendanceRecord) => void;
}

const isSameDay = (isoA: string, isoB: string) => {
  const a = new Date(isoA);
  const b = new Date(isoB);
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
};

export const AttendanceView: React.FC<AttendanceViewProps> = ({ user, records, onAddRecord }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const myRecords = useMemo(
    () => records.filter(r => r.userId === user.id).sort((a, b) => b.timestamp.localeCompare(a.timestamp)),
    [records, user.id]
  );

  const todaysRecords = useMemo(
    () => myRecords.filter(r => isSameDay(r.timestamp, new Date().toISOString())),
    [myRecords]
  );

  const lastRecord = myRecords[0];
  const isCheckedIn = lastRecord?.type === 'check-in';
  const nextAction = isCheckedIn ? 'check-out' : 'check-in';

  const handleAttendance = async () => {
    setError('');
    setIsProcessing(true);
    try {
      const reason = nextAction === 'check-in' ? 'تأكيد تسجيل الحضور' : 'تأكيد تسجيل الانصراف';
      await verifyBiometric(reason);
      const location = await getCurrentLocation();

      onAddRecord({
        id: crypto.randomUUID(),
        userId: user.id,
        type: nextAction,
        timestamp: new Date().toISOString(),
        location,
        verifiedByBiometric: true,
      });
    } catch (err) {
      if (err instanceof BiometricError || err instanceof LocationError) {
        setError(err.message);
      } else {
        setError('حدث خطأ غير متوقع، حاول مرة أخرى');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="pb-20 pt-4 px-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">تسجيل الحضور</h2>
        <p className="text-sm text-gray-500 mt-1">أهلاً {user.name}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center mb-6">
        <div
          className={`mx-auto mb-4 w-24 h-24 rounded-full flex items-center justify-center ${
            isCheckedIn ? 'bg-teal-50 text-primary' : 'bg-gray-50 text-gray-400'
          }`}
        >
          <Fingerprint size={48} />
        </div>

        <div className="mb-5">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
              isCheckedIn ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {isCheckedIn ? 'أنت حالياً في العمل' : 'لم يتم تسجيل الحضور بعد'}
          </span>
        </div>

        <button
          onClick={handleAttendance}
          disabled={isProcessing}
          className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-colors ${
            nextAction === 'check-in'
              ? 'bg-primary hover:bg-teal-800 shadow-teal-700/20'
              : 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
          } disabled:opacity-60`}
        >
          {isProcessing ? (
            <Loader2 size={22} className="animate-spin" />
          ) : nextAction === 'check-in' ? (
            <LogIn size={22} />
          ) : (
            <LogOut size={22} />
          )}
          <span>{isProcessing ? 'جاري التحقق...' : nextAction === 'check-in' ? 'تسجيل حضور' : 'تسجيل انصراف'}</span>
        </button>

        <p className="text-[11px] text-gray-400 mt-3 flex items-center justify-center gap-1">
          <Fingerprint size={12} /> يتطلب بصمة الإصبع
          <span className="mx-1">•</span>
          <MapPin size={12} /> وتحديد الموقع
        </p>

        {error && <div className="text-red-500 text-sm bg-red-50 p-2.5 rounded-lg mt-4 text-right">{error}</div>}
      </div>

      <h3 className="text-sm font-bold text-gray-600 mb-3">سجل اليوم</h3>
      <div className="space-y-3">
        {todaysRecords.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            <Clock size={32} className="mx-auto mb-2 opacity-40" />
            لا توجد حركات اليوم
          </div>
        ) : (
          todaysRecords.map(record => {
            const link = mapsLinkFor(record.location);
            return (
              <div key={record.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-start gap-3">
                <div
                  className={`p-2 rounded-full mt-0.5 ${
                    record.type === 'check-in' ? 'bg-teal-50 text-primary' : 'bg-amber-50 text-amber-600'
                  }`}
                >
                  {record.type === 'check-in' ? <LogIn size={18} /> : <LogOut size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-800 text-sm">
                      {record.type === 'check-in' ? 'حضور' : 'انصراف'}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      {new Date(record.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={12} className="text-green-500" /> بصمة مؤكدة
                    </span>
                    <span className="flex items-center gap-1" dir="ltr">
                      <MapPin size={12} /> {formatLocation(record.location)}
                    </span>
                  </div>
                  {link && (
                    <a
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 mt-1.5"
                    >
                      <Navigation size={11} /> عرض على الخريطة
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
