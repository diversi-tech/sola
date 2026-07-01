import React, { useMemo, useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, Legend,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
// ייבוא ה-API (וודאי שהנתיב תואם למיקום הקובץ בפרויקט שלך)
import { employeeApi } from '../api/employeeApi'; 

interface MetricScores {
  [key: string]: number; 
}

interface Report {
  id: string | number;
  created_at: string;
  metric_scores: MetricScores;
}

interface EmployeeMetricsProps {
  reports: Report[];
}

// הגדרת הטיפוסים עבור ה-Tooltip של Recharts
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export const EmployeeMetrics: React.FC<EmployeeMetricsProps> = ({ reports }) => {
  // סטייט דינמי לשמירת הקטגוריות מהדטאבייס
  const [categoriesFromDB, setCategoriesFromDB] = useState<string[]>([]);

  // שליפת הקטגוריות בעת טעינת הקומפוננטה
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await employeeApi.fetchCategories();
        setCategoriesFromDB(data.map(cat => cat.name));
      } catch (error) {
        console.error("שגיאה בטעינת קטגוריות לגרפים:", error);
      }
    };
    loadCategories();
  }, []);

  const { timelineData, latestRadarData, activeCategories } = useMemo(() => {
    if (!reports || !Array.isArray(reports) || reports.length === 0) {
      return { timelineData: [], latestRadarData: [], activeCategories: [] };
    }

    const sortedReports = [...reports].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    
    const reportCategoryKeys = new Set<string>();
    sortedReports.forEach(report => {
      if (report.metric_scores) {
        Object.keys(report.metric_scores).forEach(key => reportCategoryKeys.add(key.toLowerCase()));
      }
    });

    const combinedCategories = Array.from(new Set([
      ...categoriesFromDB.map(c => c.toLowerCase()),
      ...Array.from(reportCategoryKeys)
    ]));

    const timeline = sortedReports.map(report => {
      const normalizedScores: Record<string, number> = {};
      if (report.metric_scores) {
        Object.entries(report.metric_scores).forEach(([key, value]) => {
          normalizedScores[key.toLowerCase()] = value;
        });
      }

      return {
        date: new Date(report.created_at).toLocaleDateString('he-IL', { day: 'numeric', month: 'short', year: 'numeric' }),
        reportId: report.id,
        ...normalizedScores
      };
    });

    const latestReport = sortedReports[sortedReports.length - 1];
    const latestNormalizedScores: Record<string, number> = {};
    if (latestReport && latestReport.metric_scores) {
      Object.entries(latestReport.metric_scores).forEach(([key, value]) => {
        latestNormalizedScores[key.toLowerCase()] = value;
      });
    }
    
    const radar = combinedCategories.map(cat => ({
      subject: cat,
      score: latestNormalizedScores[cat] || 0,
      fullMark: 10,
    }));

    return { timelineData: timeline, latestRadarData: radar, activeCategories: combinedCategories };
  }, [reports, categoriesFromDB]);

  const colors = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6'];

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const currentPointData = payload[0].payload; 
      const reportId = currentPointData.reportId;
      const reportDate = currentPointData.date; 

      return (
        <div className="bg-white p-4 border border-gray-200 shadow-xl rounded-xl" style={{ direction: 'rtl' }}>
          <div className="border-b border-gray-100 pb-2 mb-3">
            <p className="font-bold text-gray-800 text-sm">תאריך: {reportDate}</p>
            <p className="text-xs text-indigo-600 font-extrabold mt-1 bg-indigo-50 inline-block px-2 py-0.5 rounded-md">מזהה דו"ח: #{reportId}</p>
          </div>
          <div className="space-y-1.5">
            {payload.map((entry, index) => (
              <p key={index} style={{ color: entry.color }} className="text-sm font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                {entry.name} : {entry.value}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  if (!reports || reports.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center shadow-sm">
        <p className="text-gray-500 font-medium">לא קיימים נתוני מדדים להצגה עבור עובד זה.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[450px]">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:col-span-1">
           <h3 className="text-lg font-bold text-gray-800 mb-2">פרופיל מדדים עדכני</h3>
           <div className="flex-1 w-full min-h-[250px]">
             <ResponsiveContainer width="100%" height="100%">
               {/* מספר הקודקודים יהיה לפי כמות הקטגוריות במשתנה latestRadarData */}
               <RadarChart cx="50%" cy="50%" outerRadius="70%" data={latestRadarData}>
                 <PolarGrid stroke="#e5e7eb" />
                 <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 12, fontWeight: 600 }} />
                 <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                 <Radar name="ציון" dataKey="score" stroke="#4f46e5" strokeWidth={2} fill="#4f46e5" fillOpacity={0.4} />
               </RadarChart>
             </ResponsiveContainer>
           </div>
         </div>

         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:col-span-2">
           <h3 className="text-lg font-bold text-gray-800 mb-2">מגמת התפתחות</h3>
           <div className="flex-1 w-full min-h-[250px]">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={timelineData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                 
                 <XAxis 
                   dataKey="reportId" 
                   tickFormatter={(value) => {
                     const item = timelineData.find(d => d.reportId === value);
                     return item ? item.date : value;
                   }}
                   tick={{ fill: '#6b7280', fontSize: 12 }} 
                   axisLine={false} 
                   tickLine={false} 
                   dy={10} 
                 />
                 
                 <YAxis domain={[0, 10]} tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} dx={-10} />
                 <ChartTooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }} />
                 <Legend wrapperStyle={{ paddingTop: '20px' }} />
                 
                 {activeCategories.map((cat, index) => (
                   <Line 
                     key={cat} 
                     type="monotone" 
                     dataKey={cat} 
                     name={cat} 
                     stroke={colors[index % colors.length]} 
                     strokeWidth={3} 
                     dot={{ r: 4, strokeWidth: 2 }} 
                     activeDot={{ r: 6 }} 
                     connectNulls={true} 
                   />
                 ))}
               </LineChart>
             </ResponsiveContainer>
           </div>
         </div>
      </div>
    </div>
  );
};