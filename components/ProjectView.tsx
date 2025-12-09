
import React, { useState } from 'react';
import { Project } from '../types';
import { Plus, Trash2, FolderKanban, Hash, MapPin, Navigation, ChevronDown, ChevronUp, FileText } from 'lucide-react';

interface ProjectViewProps {
  projects: Project[];
  isAdmin: boolean;
  onAddProject: (p: Project) => void;
  onDeleteProject: (id: string) => void;
  onOpenReports: (projectId: string) => void;
}

export const ProjectView: React.FC<ProjectViewProps> = ({ projects, isAdmin, onAddProject, onDeleteProject, onOpenReports }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.number) return;

    onAddProject({
      id: crypto.randomUUID(),
      name: formData.name!,
      number: formData.number!,
      address: formData.address || '',
      locationUrl: formData.locationUrl || ''
    });
    setFormData({});
    setIsFormOpen(false);
  };

  const toggleExpand = (id: string) => {
    setExpandedProjectId(expandedProjectId === id ? null : id);
  };

  const openLocation = (url: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling accordion
    if (!url) return;
    window.open(url, '_blank');
  };

  return (
    <div className="pb-20 pt-4 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">المشاريع الحالية</h2>
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
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold mb-4 text-primary">إضافة مشروع جديد</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">اسم المشروع <span className="text-red-500">*</span></label>
                <input
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="مثال: برج التحرير"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">كود/رقم المشروع <span className="text-red-500">*</span></label>
                <input
                  name="number"
                  value={formData.number || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="مثال: PRJ-2024-01"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">عنوان المشروع</label>
                <input
                  name="address"
                  value={formData.address || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="المدينة، المنطقة، الشارع"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">رابط الموقع (GPS Link)</label>
                <input
                  name="locationUrl"
                  value={formData.locationUrl || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:outline-none text-left"
                  dir="ltr"
                  placeholder="https://maps.google.com/..."
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

      <div className="space-y-3">
        {projects.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <FolderKanban size={48} className="mx-auto mb-2 opacity-50" />
            <p>لا توجد مشاريع مضافة بعد</p>
          </div>
        ) : (
          projects.map(project => {
            const isExpanded = expandedProjectId === project.id;
            return (
              <div 
                key={project.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200"
              >
                {/* Header - Always Visible */}
                <div 
                  onClick={() => toggleExpand(project.id)}
                  className="p-4 flex justify-between items-center cursor-pointer active:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-800 text-lg">{project.name}</h3>
                      {isAdmin && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); onDeleteProject(project.id); }}
                          className="text-gray-300 p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors mr-2"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center text-primary text-sm font-mono mt-1">
                      <Hash size={12} className="ml-1" />
                      <span>{project.number}</span>
                    </div>
                  </div>
                  <div className="text-gray-400 mr-2">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="bg-gray-50 p-4 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-3">
                      {project.address ? (
                        <div className="flex items-start text-gray-600 text-sm">
                          <MapPin size={16} className="ml-2 mt-0.5 text-secondary shrink-0" />
                          <span>{project.address}</span>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400 italic mr-6">لا يوجد عنوان مسجل</div>
                      )}
                      
                      <div className="flex gap-2 mt-4">
                        {project.locationUrl && (
                          <button 
                            onClick={(e) => openLocation(project.locationUrl!, e)}
                            className="flex-1 flex items-center text-sm text-blue-600 hover:text-blue-800 bg-white border border-blue-100 px-3 py-2 rounded-lg justify-center shadow-sm transition-colors"
                          >
                            <Navigation size={14} className="ml-2" />
                            الموقع
                          </button>
                        )}
                        <button 
                           onClick={(e) => { e.stopPropagation(); onOpenReports(project.id); }}
                           className="flex-1 flex items-center text-sm text-teal-700 hover:text-teal-900 bg-white border border-teal-100 px-3 py-2 rounded-lg justify-center shadow-sm transition-colors"
                        >
                           <FileText size={14} className="ml-2" />
                           الملفات والتقارير
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
