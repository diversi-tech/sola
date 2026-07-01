import { useState, useEffect } from 'react';
import { employeeApi, EmployeeWithReports, Employee, Report } from '../api/employeeApi';

interface UseEmployeeDataReturn {
  employeesWithReports: EmployeeWithReports[];
  selectedEmployee: Employee | null;
  currentReports: Report[];
  loading: boolean;
  error: string | null;
  handleSelectEmployee: (item: EmployeeWithReports) => void;
  handleCloseModal: () => void;
}

export default function useEmployeeData(): UseEmployeeDataReturn {
  const [employeesWithReports, setEmployeesWithReports] = useState<EmployeeWithReports[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [currentReports, setCurrentReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await employeeApi.fetchEmployeesWithReports();
        setEmployeesWithReports(Array.isArray(data) ? data : []);
      } catch (err) {
        setError((err as Error).message || 'שגיאה בטעינת הנתונים');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSelectEmployee = (item: EmployeeWithReports): void => {
    setSelectedEmployee(item.employee);
    setCurrentReports(item.reports);
  };

  const handleCloseModal = (): void => {
    setSelectedEmployee(null);
    setCurrentReports([]);
  };

  return {
    employeesWithReports,
    selectedEmployee,
    currentReports,
    loading,
    error,
    handleSelectEmployee,
    handleCloseModal,
  };
}
