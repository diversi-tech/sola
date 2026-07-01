import { useState, useEffect } from 'react';
import { employeeApi, EmployeeWithReports, Employee, Report, Meeting } from '../api/employeeApi';

interface UseEmployeeDataReturn {
  employeesWithReports: EmployeeWithReports[];
  selectedEmployee: Employee | null;
  currentReports: Report[];
  currentMeetings: Meeting[];
  loading: boolean;
  meetingsLoading: boolean;
  error: string | null;
  initialTab: 'overview' | 'reports' | 'meetings';
  handleSelectEmployee: (item: EmployeeWithReports) => void;
  handleViewMeetings: (employee: Employee) => Promise<void>;
  handleCloseModal: () => void;
}

export default function useEmployeeData(): UseEmployeeDataReturn {
  const [employeesWithReports, setEmployeesWithReports] = useState<EmployeeWithReports[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [currentReports, setCurrentReports] = useState<Report[]>([]);
  const [currentMeetings, setCurrentMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [meetingsLoading, setMeetingsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [initialTab, setInitialTab] = useState<'overview' | 'reports' | 'meetings'>('overview');

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
    setInitialTab('overview');
    setSelectedEmployee(item.employee);
    setCurrentReports(item.reports);
  };

  const handleViewMeetings = async (employee: Employee): Promise<void> => {
    setInitialTab('meetings');
    setSelectedEmployee(employee);
    setCurrentReports([]);
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
    employeesWithReports,
    selectedEmployee,
    currentReports,
    currentMeetings,
    loading,
    meetingsLoading,
    error,
    initialTab,
    handleSelectEmployee,
    handleViewMeetings,
    handleCloseModal,
  };
}
