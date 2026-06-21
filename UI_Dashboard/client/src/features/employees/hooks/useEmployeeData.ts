import { useState, useEffect } from 'react';
import { employeeApi, Employee, Report } from '../api/employeeApi';

interface UseEmployeeDataReturn {
  employees: Employee[];
  selectedEmployee: Employee | null;
  currentReports: Report[];
  loading: boolean;
  modalLoading: boolean;
  error: string | null;
  handleSelectEmployee: (employee: Employee) => Promise<void>;
  handleCloseModal: () => void;
}

export default function useEmployeeData(): UseEmployeeDataReturn {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [currentReports, setCurrentReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEmployees = async (): Promise<void> => {
      try {
        setLoading(true);
        const result = (await employeeApi.fetchAllEmployees()) as any;
        
        // חילוץ חכם: אם יש data ניקח אותו, אחרת ניקח את התוצאה כולה
        const employeesArray = result.data ? result.data : result;
        
        // וידוא מוחלט שזה מערך לפני השמירה
        setEmployees(Array.isArray(employeesArray) ? employeesArray : []);
      } catch (err) {
        setError((err as Error).message || 'שגיאה בטעינת הנתונים');
      } finally {
        setLoading(false);
      }
    };
    loadEmployees();
  }, []);

  const handleSelectEmployee = async (employee: Employee): Promise<void> => {
    setSelectedEmployee(employee);
    try {
      setModalLoading(true);
      const result = (await employeeApi.fetchEmployeeReports(employee.id)) as any;
      
      // חילוץ חכם גם לדוחות
      const reportsArray = result.data ? result.data : result;
      setCurrentReports(Array.isArray(reportsArray) ? reportsArray : []);
    } catch (err) {
      console.error('שגיאה בטעינת דוחות העובד', err);
      setCurrentReports([]);
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = (): void => {
    setSelectedEmployee(null);
    setCurrentReports([]);
  };

  return {
    employees,
    selectedEmployee,
    currentReports,
    loading,
    modalLoading,
    error,
    handleSelectEmployee,
    handleCloseModal
  };
}