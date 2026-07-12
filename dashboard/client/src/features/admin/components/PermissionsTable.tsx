import React from 'react';
import { EmployeeWithPermissions, Permission } from '../api/adminApi';

interface PermissionsTableProps {
  employees: EmployeeWithPermissions[];
  permissions: Permission[];
  onTogglePermission: (employeeId: number, permissionId: number) => void;
}

export const PermissionsTable: React.FC<PermissionsTableProps> = ({
  employees,
  permissions,
  onTogglePermission,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-slate-200">
      <table className="w-full text-right border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="p-4 font-semibold text-slate-700 w-1/4">שם העובד</th>
            {permissions.map(permission => (
              <th 
                key={permission.id} 
                className="p-4 font-semibold text-slate-700 text-center"
                title={permission.description} 
              >
                {permission.name.replace(/_/g, ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {employees.map(employee => (
            <tr key={employee.id} className="hover:bg-slate-50 transition-colors">
              <td className="p-4 font-medium text-slate-900">{employee.name}</td>
              
              {permissions.map(permission => {
                const isChecked = employee.permissions.includes(permission.id);
                return (
                  <td key={permission.id} className="p-4 text-center">
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer transition-all"
                      checked={isChecked}
                      onChange={() => onTogglePermission(employee.id, permission.id)}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};