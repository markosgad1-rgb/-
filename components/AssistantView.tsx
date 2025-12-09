import React, { useState } from 'react';
import { Sparkles, Loader2, Save } from 'lucide-react';
import { generateSampleData } from '../services/geminiService';
import { Project, Employee } from '../types';

interface AssistantViewProps {
  onImportData: (projects: Project[], employees: Employee[]) => void;
}

export const AssistantView: React.FC<AssistantViewProps> = ({ onImportData }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState<{projects: Project[], employees: Employee[]} | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setGeneratedData(null);
    try {
      const result = await generateSampleData(prompt);
      setGeneratedData({
        projects: result.projects || [],
        employees: result.employees || []
      });
    } catch (e) {
      alert('حدث خطأ أثناء الاتصال بالمساعد الذكي');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (generatedData) {
      onImportData(generatedData.projects, generatedData.employees);
      setGeneratedData(null);
      setPrompt('');
      alert('تم حفظ البيانات بنجاح في التطبيق');
    }
  };

  return (
    <div className="pb-20 pt-4 px-4">
      <div className="bg-gradient-to-br from-primary to-teal-900 rounded-2xl p-6 text-white mb-6 shadow-xl">
        <div className="flex items-center mb-2">
          <Sparkles className="ml-2 text-yellow-300" />
          <h2 className="text-xl font-bold">المساعد الذكي</h2>
        </div>
        <p className="text-teal-100 text-sm opacity-90">
          اطلب من الذكاء الاصطناعي إنشاء بيانات تجريبية للمشاريع أو الموظفين.
        </p>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <label className="block text-sm font-bold text-gray-700 mb-2">ماذا تريد أن أنشئ لك؟</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="مثال: أنشئ قائمة بـ 3 مشاريع مقاولات في القاهرة و 5 موظفين بأسماء مصرية وعناوين مختلفة."
          className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-primary focus:outline-none text-sm resize-none"
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading || !prompt}
          className="w-full mt-3 bg-secondary text-white font-bold py-3 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-600 transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin ml-2" size={20} />
              جاري المعالجة...
            </>
          ) : (
            'توليد البيانات'
          )}
        </button>
      </div>

      {generatedData && (
        <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-3">
             <h3 className="font-bold text-gray-800">النتيجة المقترحة:</h3>
             <button 
               onClick={handleSave}
               className="flex items-center text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-teal-800"
             >
                <Save size={16} className="ml-1" />
                حفظ الكل
             </button>
          </div>
          
          <div className="space-y-4">
            {generatedData.projects.length > 0 && (
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <h4 className="text-primary font-bold text-sm mb-2 border-b pb-2">المشاريع ({generatedData.projects.length})</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  {generatedData.projects.map((p, i) => (
                    <li key={i}>• {p.name} ({p.number})</li>
                  ))}
                </ul>
              </div>
            )}
            
            {generatedData.employees.length > 0 && (
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <h4 className="text-primary font-bold text-sm mb-2 border-b pb-2">الموظفين ({generatedData.employees.length})</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  {generatedData.employees.map((e, i) => (
                    <li key={i}>• {e.name} - {e.address}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};