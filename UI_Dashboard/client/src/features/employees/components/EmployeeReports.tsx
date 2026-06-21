import React, { useState, useMemo, ChangeEvent } from 'react';

// --- הגדרת טיפוסים ---

interface MetricScores {
  [key: string]: number | string | null | undefined;
}

interface Report {
  id: string | number;
  created_at: string;
  manager_id?: string | number;
  text_summary?: string;
  metric_scores?: MetricScores;
}

interface EmployeeReportsProps {
  reports: Report[] | undefined;
}

export const EmployeeReports: React.FC<EmployeeReportsProps> = ({ reports }) => {
  const [filterMonth, setFilterMonth] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // שליפת קטגוריות ייחודיות מתוך כל הדו"חות
  const availableCategories = useMemo(() => {
    if (!reports) return [];
    const categoriesSet = new Set<string>();
    reports.forEach(report => {
      if (report.metric_scores) {
        Object.keys(report.metric_scores).forEach(key => categoriesSet.add(key));
      }
    });
    return Array.from(categoriesSet);
  }, [reports]);

  // סינון ומיון הדו"חות
  const filteredAndSortedReports = useMemo(() => {
    if (!reports) return [];
    
    // מיון לפי תאריך (חדש לישן)
    let result = [...reports].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // סינון לפי חודש
    if (filterMonth) {
      result = result.filter(report => 
        new Date(report.created_at).toISOString().slice(0, 7) === filterMonth
      );
    }

    // סינון לפי קטגוריה
    if (filterCategory !== 'all') {
      result = result.filter(report => {
        if (!report.metric_scores) return false;
        const score = report.metric_scores[filterCategory];
        return score !== undefined && score !== null && score !== '';
      });
    }
    return result;
  }, [reports, filterMonth, filterCategory]);

  return (
    <div className="animate-fade-in py-4 max-w-4xl mx-auto flex flex-col gap-6">
      {/* סרגל סינון */}
      <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-800 font-bold text-sm">סינון דוחות:</div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <input 
            type="month" 
            value={filterMonth} 
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFilterMonth(e.target.value)} 
            className="bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500" 
          />
          <select 
            value={filterCategory} 
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterCategory(e.target.value)} 
            className="bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">כל הקטגוריות</option>
            {availableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          {(filterMonth || filterCategory !== 'all') && (
            <button 
              onClick={() => { setFilterMonth(''); setFilterCategory('all'); }} 
              className="text-xs font-bold text-red-500 bg-red-50 px-3 py-2.5 rounded-xl"
            >
              איפוס
            </button>
          )}
        </div>
      </div>

      {/* רשימת דוחות */}
      {filteredAndSortedReports.length > 0 ? (
        <div className="relative border-r-2 border-indigo-100 pr-6 mr-3 space-y-8">
          {filteredAndSortedReports.map((report) => (
            <div key={report.id} className="relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-indigo-200 group">
              <div className="absolute -right-[35px] top-6 w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-slate-50 group-hover:bg-indigo-600"></div>
              
              <div className="flex justify-between items-center border-b border-gray-50 pb-4 mb-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-bold">מזהה דו"ח: #{report.id}</div>
                  <span className="text-sm font-medium text-gray-500">📅 {new Date(report.created_at).toLocaleDateString('he-IL')}</span>
                </div>
                <span className="text-xs text-gray-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">👤 מנהל: #{report.manager_id}</span>
              </div>
              
              <p className="text-slate-700 text-base mb-4 font-medium">{report.text_summary}</p>
              
              {report.metric_scores && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {Object.entries(report.metric_scores)
                    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
                    .map(([key, value]) => (
                    <span key={key} className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                      {key}: <span className="text-indigo-600">{value}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm mt-4">
          <p className="text-slate-600 font-bold text-lg">לא נמצאו דוחות התואמים לסינון.</p>
        </div>
      )}
    </div>
  );
};