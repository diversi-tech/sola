import { useState, useEffect } from 'react';
import { employeeApi, Employee, Report, Meeting } from '../api/employeeApi';

interface UseEmployeeDataReturn {
  employees: Employee[];
  selectedEmployee: Employee | null;
  currentReports: Report[];
  currentMeetings: Meeting[];
  loading: boolean;
  modalLoading: boolean;
  meetingsLoading: boolean;
  error: string | null;
  initialTab: 'overview' | 'reports' | 'meetings';
  handleSelectEmployee: (employee: Employee) => Promise<void>;
  handleViewMeetings: (employee: Employee) => Promise<void>;
  handleCloseModal: () => void;
}

export default function useEmployeeData(): UseEmployeeDataReturn {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [currentReports, setCurrentReports] = useState<Report[]>([]);
  const [currentMeetings, setCurrentMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [meetingsLoading, setMeetingsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [initialTab, setInitialTab] = useState<'overview' | 'reports' | 'meetings'>('overview');

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
    setInitialTab('overview');
    setSelectedEmployee(employee);
    try {
      setModalLoading(true);
      const result = (await employeeApi.fetchEmployeeReports(employee.id)) as any;
      const reportsArray = result.data ? result.data : result;
      setCurrentReports(Array.isArray(reportsArray) ? reportsArray : []);
    } catch (err) {
      console.error('שגיאה בטעינת דוחות העובד', err);
      setCurrentReports([]);
    } finally {
      setModalLoading(false);
    }
  };

  const handleViewMeetings = async (employee: Employee): Promise<void> => {
    setInitialTab('meetings');
    setSelectedEmployee(employee);
    try {
      setMeetingsLoading(true);
      const result = (await employeeApi.fetchEmployeeMeetings(employee.id)) as any;
      const meetingsArray = result.data ? result.data : result;
      setCurrentMeetings(Array.isArray(meetingsArray) ? meetingsArray : []);
    } catch (err) {
      console.error('שגיאה בטעינת פגישות העובד', err);
      setCurrentMeetings([]);
    } finally {
      setMeetingsLoading(false);
    }
  };

  const handleCloseModal = (): void => {
    setSelectedEmployee(null);
    setCurrentReports([]);
    setCurrentMeetings([]);
  };

  return {
    employees,
    selectedEmployee,
    currentReports,
    currentMeetings,
    loading,
    modalLoading,
    meetingsLoading,
    error,
    initialTab,
    handleSelectEmployee,
    handleViewMeetings,
    handleCloseModal
  };
}