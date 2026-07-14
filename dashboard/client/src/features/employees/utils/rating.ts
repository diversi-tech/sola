import { Report } from '../types/employee.types';

/**
 * Average of every metric score across all of an employee's reports,
 * rounded to the nearest whole number. Returns 0 when there are no reports.
 */
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
