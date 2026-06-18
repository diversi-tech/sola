import React, { useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, Legend,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

export const EmployeeMetrics = ({ reports }) => {
  const CATEGORIES = ['teamwork', 'independence', 'responsibility'];

  const { timelineData, latestRadarData } = useMemo(() => {
    if (!reports || !Array.isArray(reports) || reports.length === 0) {
      return { timelineData: [], latestRadarData: [] };
    }

    const sortedReports = [...reports].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    
    const timeline = sortedReports.map(report => ({
      date: new Date(report.created_at).toLocaleDateString('he-IL', { day: 'numeric', month: 'short', year: 'numeric' }),
      reportId: report.id,
      ...report.metric_scores
    }));

    const latestReport = sortedReports[sortedReports.length - 1];
    const radar = CATEGORIES.map(cat => ({
      subject: cat,
      score: (latestReport.metric_scores && latestReport.metric_scores[cat]) ? latestReport.metric_scores[cat] : 0,
      fullMark: 10,
    }));

    return { timelineData: timeline, latestRadarData: radar };
  }, [reports]);

  const colors = ['#4f46e5', '#0ea5e9', '#10b981'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const reportId = payload[0].payload.reportId;
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-xl rounded-xl" style={{ direction: 'rtl' }}>
          <div className="border-b border-gray-100 pb-2 mb-3">
            <p className="font-bold text-gray-800 text-sm">תאריך: {label}</p>
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
                <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis domain={[0, 10]} tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} dx={-10} />
                <ChartTooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                {CATEGORIES.map((cat, index) => (
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