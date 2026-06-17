// src/components/employee/hooks/useEmployeeData.js
import { useState, useEffect } from 'react';
import { employeeApi } from '../api/employeeApi';

export default function useEmployeeData() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [currentReports, setCurrentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoading(true);
        const result = await employeeApi.fetchAllEmployees();
        setEmployees(result.data);
      } catch (err) {
        setError(err.message || 'שגיאה בטעינת הנתונים');
      } finally {
        setLoading(false);
      }
    };
    loadEmployees();
  }, []);

  const handleSelectEmployee = async (employee) => {
    setSelectedEmployee(employee);
    try {
      setModalLoading(true);
      const result = await employeeApi.fetchEmployeeReports(employee.id);
      setCurrentReports(result.data);
    } catch (err) {
      console.error('שגיאה בטעינת דוחות העובד', err);
      setCurrentReports([]);
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
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
};