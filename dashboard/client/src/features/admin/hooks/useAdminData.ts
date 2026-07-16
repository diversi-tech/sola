import { useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';
import { EmployeeWithPermissions, Permission } from '../api/adminApi';

export const useAdminData = () => {
  const [employees, setEmployees] = useState<EmployeeWithPermissions[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [employeesData, permissionsData] = await Promise.all([
          adminApi.fetchEmployees(),
          adminApi.fetchPermissions(),
        ]);
        setEmployees(employeesData);
        setPermissions(permissionsData);
      } catch (err) {
        setError('Error loading data. Please try again.');
        console.error('Failed to load admin data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const addEmployee = async (employee: { name: string; email: string; phoneNumber?: string; permissionIds: number[] }) => {
    const created = await adminApi.createEmployee(employee);
    setEmployees(prev => [...prev, { ...created, permissions: employee.permissionIds }]);
  };

  const togglePermission = async (employeeId: number, permissionId: number) => {
    const employee = employees.find(e => e.id === employeeId);
    if (!employee) return;

    const hasPermission = employee.permissions.includes(permissionId);
    const updatedPermissions = hasPermission
      ? employee.permissions.filter(id => id !== permissionId)
      : [...employee.permissions, permissionId];

    setEmployees(prev =>
      prev.map(emp => (emp.id === employeeId ? { ...emp, permissions: updatedPermissions } : emp))
    );
    try {
      await adminApi.updateEmployeePermissions(employeeId, updatedPermissions);
    } catch (err) {
      console.error('Failed to update permission:', err);
      alert('שגיאה בעדכון ההרשאות בשרת, השינוי יבוטל.');
      setEmployees(prev =>
        prev.map(emp => (emp.id === employeeId ? { ...emp, permissions: employee.permissions } : emp))
      );
    }
  };

  return {
    employees,
    permissions,
    loading,
    error,
    addEmployee,
    togglePermission,
  };
};