// src/components/employee/components/EmployeeModal.jsx
import React, { useState } from 'react';

export const EmployeeModal = ({ employee, reports, loading, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white animate-fade-in w-full h-full" style={{ direction: 'rtl' }}>
      
      <div className="w-full h-full flex flex-col overflow-hidden">
        
        <div className="p-8 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-extrabold text-gray-900">{employee.name}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${employee.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {employee.is_active ? 'סטטוס: פעיל' : 'סטטוס: לא פעיל'}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">  מזהה מערכת #{employee.id}</p>
          </div>
          
          <button 
            onClick={onClose} 
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-lg transition-all border border-gray-300 shadow-sm font-medium"
          >
            <span> </span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="flex border-b border-gray-200 bg-white px-8 gap-2 shrink-0 shadow-sm z-10">
          <button 
            onClick={() => setActiveTab('overview')} 
            className={`py-4 px-6 font-bold text-sm border-b-2 transition-all ${activeTab === 'overview' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
          >
            📊 סקירה כללית ומדדי ביצוע
          </button>
          <button 
            onClick={() => setActiveTab('reports')} 
            className={`py-4 px-6 font-bold text-sm border-b-2 transition-all ${activeTab === 'reports' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
          >
            📝 דוחות וסיכומי מנהלים ({reports?.length || 0})
          </button>
          <button 
            onClick={() => setActiveTab('messages')} 
            className={`py-4 px-6 font-bold text-sm border-b-2 transition-all ${activeTab === 'messages' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
          >
            💬 היסטוריית הודעות ועדכונים
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex-1 bg-gray-50">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-full gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
              <p className="text-gray-500 text-sm font-medium">מושך נתונים מורחבים מהשרת...</p>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">נתוני מדדים מתוך בסיס הנתונים (JSONB)</h3>
                    {reports && Array.isArray(reports) && reports.length > 0 && reports[0].metric_scores ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(reports[0].metric_scores).map(([key, value]) => (
                          <div key={key} className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-semibold text-gray-700">{key}</span>
                              <span className="text-base font-extrabold text-indigo-600">{value}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div className="bg-indigo-600 h-3 rounded-full transition-all duration-500" style={{ width: `${value}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">לא קיימים מדדים כמותיים מוגדרים עבור עובד זה.</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'reports' && (
                <div className="space-y-4">
                  {reports && Array.isArray(reports) && reports.length > 0 ? (
                    reports.map((report) => (
                      <div key={report.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 hover:border-gray-300 transition-all">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                            <span>📅 הופק בתאריך: {new Date(report.created_at).toLocaleDateString('he-IL')}</span>
                            <span>•</span>
                            <span>👤 מזהה מנהל: #{report.manager_id}</span>
                          </div>
                          <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-lg">מזהה דו"ח: {report.id}</span>
                        </div>
                        <p className="text-gray-800 text-base leading-relaxed whitespace-pre-line">{report.text_summary}</p>
                        
                        {report.audio_link && (
                          <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-3 max-w-xl border border-gray-200">
                            <span className="text-xs font-bold text-gray-600 shrink-0">🔊 הקלטת סיכום:</span>
                            <audio controls src={report.audio_link} className="w-full h-8" />
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                      <p className="text-gray-500 font-medium">לא נמצאו דוחות ביצוע במערכת עבור עובד זה.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'messages' && (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 font-medium">
                    🛈 היסטוריית התכתבויות, הודעות מערכת והערות ארגוניות שנרשמו בנוגע לעובד.
                  </div>
                   {reports && Array.isArray(reports) && reports.map((report, index) => (
                    <div key={index} className="flex gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold shrink-0">
                        MSG
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-800">עדכון סטטוס תקופתי מאת הנהלת החברה</div>
                        <div className="text-xs text-gray-500 mt-0.5 mb-2">{new Date(report.created_at).toLocaleString('he-IL')}</div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          הודעה אוטומטית: עודכן דוח ביצועים חודשי בהצלחה. כל מערכות המדדים עודכנו בהתאם לנתוני ה-JSONB בשרת.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};