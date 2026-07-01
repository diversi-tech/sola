import React, { useState, useEffect } from 'react';
import { EmployeeMetrics } from './EmployeeMetrics';
import { EmployeeReports } from './EmployeeReports';
import { EmployeeMeetings } from './EmployeeMeetings';
import { Meeting } from '../api/employeeApi';

interface Employee {
  id: string | number;
  name: string;
  is_active: boolean;
}

interface Report {
  id: string | number;
  created_at: string;
  metric_scores: { [key: string]: number };
}

interface EmployeeModalProps {
  employee: Employee;
  reports: Report[];
  meetings: Meeting[];
  loading: boolean;
  meetingsLoading: boolean;
  initialTab?: 'overview' | 'reports' | 'meetings';
  onClose: () => void;
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  employee,
  reports,
  meetings,
  loading,
  meetingsLoading,
  initialTab = 'overview',
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'meetings'>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, employee.id]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/50 backdrop-blur-sm animate-fade-in w-full h-full p-4 md:p-8" style={{ direction: 'rtl' }}>
      <div className="bg-white rounded-2xl w-full h-full flex flex-col overflow-hidden shadow-2xl border border-gray-100 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
          <div>
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{employee.name}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${employee.is_active ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                {employee.is_active ? 'סטטוס: פעיל' : 'סטטוס: לא פעיל'}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1.5 font-medium">מזהה מערכת ארגוני: #{employee.id}</p>
          </div>
          
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-red-600 bg-white hover:bg-red-50 rounded-xl transition-all border border-gray-200 shadow-sm"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="flex border-b border-gray-200 bg-white px-8 gap-4 shrink-0 shadow-sm z-10 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-2 font-bold text-sm border-b-2 transition-all whitespace-nowrap ${activeTab === 'overview' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
          >
            📊 סקירה והתפתחות מדדים
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-4 px-2 font-bold text-sm border-b-2 transition-all whitespace-nowrap ${activeTab === 'reports' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
          >
            📝 היסטוריית דוחות
          </button>
          <button
            onClick={() => setActiveTab('meetings')}
            className={`py-4 px-2 font-bold text-sm border-b-2 transition-all whitespace-nowrap ${activeTab === 'meetings' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
          >
            📅 פגישות
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-slate-50/50">
          {loading && activeTab !== 'meetings' ? (
            <div className="flex flex-col justify-center items-center h-full gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
              <p className="text-gray-500 text-sm font-bold tracking-wide">מעבד נתונים אנליטיים...</p>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto h-full">
              {activeTab === 'overview' && <EmployeeMetrics reports={reports} />}
              {activeTab === 'reports' && <EmployeeReports reports={reports} />}
              {activeTab === 'meetings' && <EmployeeMeetings meetings={meetings} loading={meetingsLoading} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};