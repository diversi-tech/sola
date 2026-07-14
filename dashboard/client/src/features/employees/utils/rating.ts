import { Report } from '../types/employee.types';

export const calculateEmployeeRating = (reports: Report[]): number => {
  if (!reports || reports.length === 0) return 0;
  let totalScore = 0;
  let count = 0;
  reports.forEach(report => {
    Object.values(report.metric_scores).forEach(score => {
      totalScore += score;
      count++;
    });
  });
  return count > 0 ? Math.round((totalScore / count)) : 0;
};
