
import React, { useState, useRef } from 'react';
import { Report, Project } from '../types';
import { FileText, Table, File, Image, Trash2, Upload, ArrowRight, Paperclip, Calendar } from 'lucide-react';

interface ReportsViewProps {
  project: Project;
  reports: Report[];
  isAdmin: boolean;
  onAddReport: (report: Report) => void;
  onDeleteReport: (id: string) => void;
  onBack: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ project, reports, isAdmin, onAddReport, onDeleteReport, onBack }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [note, setNote] = useState('');

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'excel': return <Table className="text-green-600" size={24} />;
      case 'word': return <FileText className="text-blue-600" size={24} />;
      case 'image': return <Image className="text-purple-600" size={24} />;
      case 'pdf': return <FileText className="text-red-600" size={24} />;
      default: return <File className="text-gray-500" size={24} />;
    }
  };

  const getFileType = (fileName: string): Report['fileType'] => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['xls', 'xlsx', 'csv'].includes(ext || '')) return 'excel';
    if (['doc', 'docx'].includes(ext || '')) return 'word';
    if (['pdf'].includes(ext || '')) return 'pdf';
    if (['jpg', 'jpeg', 'png'].includes(ext || '')) return 'image';
    return 'other';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newReport: Report = {
        id: crypto.randomUUID(),
        projectId: project.id,
        fileName: file.name,
        fileType: getFileType(file.name),
        date: new Date().toLocaleDateString('ar-EG'),
        size: formatFileSize(file.size),
        notes: note || 'تحديث حالة المشروع'
      };
      onAddReport(newReport);
      setNote(''); // Reset note
      if (fileInputRef.current) fileInputRef.current.value = '';
      setIsUploading(false);
    }
  };

  return (
    <div className="pb-20 pt-4 px-4 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={onBack}
          className="p-2 bg-white rounded-full shadow-sm text-gray-600 hover:text-primary transition-colors"
        >
          <ArrowRight size={20} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-800">تقارير وملفات</h2>
          <p className="text-xs text-gray-500">{project.name} ({project.number})</p>
        </div>
      </div>

      {/* Upload Area */}
      {isAdmin && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-dashed border-primary mb-6">
           {!isUploading ? (
             <button 
               onClick={() => setIsUploading(true)}
               className="w-full py-4 flex flex-col items-center justify-center text-primary hover:bg-teal-50 rounded-lg transition-colors gap-2"
             >
               <div className="bg-teal-100 p-3 rounded-full">
                 <Upload size={24} />
               </div>
               <span className="font-bold text-sm">إرفاق ملف جديد (Excel, Word, PDF)</span>
             </button>
           ) : (
             <div className="space-y-3 animate-in fade-in zoom-in duration-200">
               <label className="block text-xs font-bold text-gray-500">ملاحظات على الملف (اختياري)</label>
               <input 
                 type="text" 
                 value={note}
                 onChange={(e) => setNote(e.target.value)}
                 placeholder="مثال: محضر تركيبات شهر يناير"
                 className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
               />
               <div className="flex gap-2">
                 <button 
                   onClick={() => fileInputRef.current?.click()}
                   className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-bold hover:bg-teal-800 flex items-center justify-center gap-2"
                 >
                   <Paperclip size={16} />
                   اختر الملف
                 </button>
                 <button 
                   onClick={() => setIsUploading(false)}
                   className="px-4 bg-gray-100 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-200"
                 >
                   إلغاء
                 </button>
               </div>
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 onChange={handleFileSelect}
               />
             </div>
           )}
        </div>
      )}

      {/* Files List */}
      <div className="space-y-3">
        {reports.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FileText size={48} className="mx-auto mb-3 opacity-30" />
            <p>لا توجد ملفات أو تقارير مرفقة لهذا المشروع</p>
          </div>
        ) : (
          reports.map(report => (
            <div key={report.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-start gap-3">
              <div className="mt-1 bg-gray-50 p-2 rounded-lg">
                {getFileIcon(report.fileType)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-800 text-sm truncate" dir="ltr">{report.fileName}</h3>
                  {isAdmin && (
                    <button 
                      onClick={() => onDeleteReport(report.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">{report.notes}</p>
                <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />
                    {report.date}
                  </span>
                  {report.size && <span>{report.size}</span>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
