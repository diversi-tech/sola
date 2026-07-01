import { supabase } from '../config/supabase.js';
import { findEmployeeByName } from './employee.service.js';
import { getActiveCategories } from './category.service.js';
import { LLMFactory } from '../ai/llm.factory.js';

export const getEmployeesWithReports = async () => {
  const { data, error } = await supabase
    .from('Reports')
    .select('*, Employees(*)')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch reports with employees: ${error.message}`);

  const employeeMap = new Map<number, { employee: any; reports: any[]; latest_report_date: string }>();

  for (const row of data ?? []) {
    const { Employees: employee, ...report } = row;
    if (!employee) continue;

    if (!employeeMap.has(employee.id)) {
      employeeMap.set(employee.id, {
        employee,
        reports: [report],
        latest_report_date: report.created_at,
      });
    } else {
      employeeMap.get(employee.id)!.reports.push(report);
    }
  }

  // order is preserved from the query (desc by created_at), so first entry per employee = most recent
  return Array.from(employeeMap.values());
};


const aiProvider = LLMFactory.getProvider();

export const processAndSaveFeedback = async (manager_id: number, text: string) => {
    try {
        const categories = await getActiveCategories();
        
        const llmMetrics = await aiProvider.analyzeFeedback(text, categories);
        
        const extractedName = llmMetrics.employee_name;
        if (!extractedName) {
            throw new Error("The AI could not identify an employee name in the text.");
        }

        const employeeId = await findEmployeeByName(extractedName);

        const realData = {
            employee_id: employeeId,
            manager_id: manager_id || null,
            metric_scores: llmMetrics.metric_scores,
            text_summary: llmMetrics.text_summary,
        };

        const { data, error } = await supabase
            .from('Reports')
            .insert([realData])
            .select();

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        throw error;
    }
};