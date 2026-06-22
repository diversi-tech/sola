import React from 'react';


interface Employee {
  id: string | number;
  name: string;
  is_active: boolean;
}

interface EmployeeRowProps {
  employee: Employee;
  rating: number;
  onClick: () => void;
}

export const EmployeeRow: React.FC<EmployeeRowProps> = ({ employee, rating, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group relative flex items-center justify-between py-4 px-6 mb-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-100 cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5 overflow-hidden"
      style={{ direction: 'rtl' }}
    >
      <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-r-xl"></div>

      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-inner border-2 border-indigo-50">
          {employee.name ? employee.name.charAt(0).toUpperCase() : '?'}
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h3 className="text-gray-800 font-bold text-base group-hover:text-indigo-600 transition-colors duration-200">
              {employee.name}
            </h3>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide ${
                employee.is_active
                  ? 'bg-green-50 text-green-700 border border-green-200/50'
                  : 'bg-gray-50 text-gray-500 border border-gray-200'
              }`}
            >
              {employee.is_active ? 'פעיל' : 'לא פעיל'}
            </span>
          </div>
          <span className="text-xs text-gray-400 mt-0.5 font-medium">
            מזהה עובד: #{employee.id || 'N/A'} • לחץ לצפייה בתיק האישי
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 group-hover:bg-indigo-50/50 transition-colors duration-300">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`w-4 h-4 transition-all duration-300 ${
              index < rating 
                ? 'text-amber-400 fill-amber-400 drop-shadow-sm group-hover:scale-110' 
                : 'text-gray-200 fill-gray-200'
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192L12 .587z" />
          </svg>
        ))}
      </div>
    </div>
  );
};