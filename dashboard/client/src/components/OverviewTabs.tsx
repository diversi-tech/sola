import React from 'react';
import { useNavigate } from 'react-router-dom';

interface OverviewTabsProps {
  active: 'employees' | 'meetings';
}

const TABS = [
  { key: 'employees' as const, label: 'עובדים', path: '/EmployeePage' },
  { key: 'meetings' as const, label: 'פגישות', path: '/meetings' },
];

export const OverviewTabs: React.FC<OverviewTabsProps> = ({ active }) => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-1 mb-8 bg-white border border-slate-100 rounded-xl p-1 w-fit shadow-sm">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => {
            if (tab.key !== active) navigate(tab.path);
          }}
          className={`px-5 py-2 text-sm font-semibold rounded-lg transition-colors ${
            active === tab.key ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
