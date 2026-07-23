export interface LookupSettings {
  dim_quality_weight: number; // 0.30
  dim_timeliness_weight: number; // 0.20
  dim_accuracy_weight: number; // 0.20
  dim_completion_weight: number; // 0.20
  dim_doc_weight: number; // 0.10
  rag_yellow_days: number; // 7
  currency_symbol: string; // "$"
  max_score_base: number; // 100
}

export interface Employee {
  emp_id: string; // EMP-001
  emp_name: string; // Sarah Jenkins
  department: string; // Engineering
  position: string; // Principal Software Engineer
  manager_id: string; // EMP-000
  hire_date: string; // 2022-03-15
  status: 'Active' | 'Resigned' | 'On Leave';
}

export interface Task {
  task_id: string; // TSK-2026-001
  emp_id: string; // EMP-001
  task_name: string; // Core Microservices Redesign & API v2
  task_weight: number; // 0.25 (25%)
  plan_start_date: string; // YYYY-MM-DD
  plan_due_date: string; // YYYY-MM-DD
  actual_finish_date?: string; // YYYY-MM-DD or empty
  progress_pct: number; // 0.0 to 1.0 (100%)
}

export interface Evaluation {
  eval_id: string; // EV-2026-001
  task_id: string; // TSK-2026-001
  score_quality: number; // 0-100
  score_timeliness: number; // 0-100
  score_accuracy: number; // 0-100
  score_completion: number; // 0-100
  score_doc: number; // 0-100
  evaluator_id: string; // EMP-000
  comments: string; // Qualitative review notes
}

export type RAGStatus = '🟢 Normal' | '🟡 Warning Critical' | '🔴 Delay Risk';
export type TaskStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Overdue';

export interface CalculatedTaskRow {
  task_id: string;
  emp_id: string;
  emp_name: string;
  department: string;
  task_name: string;
  task_weight: number;
  plan_start_date: string;
  plan_due_date: string;
  actual_finish_date: string;
  progress_pct: number;
  task_status: TaskStatus;
  delay_days: number;
  rag_status: RAGStatus;
  task_final_score: number; // Weighted evaluation score (0-100)
  emp_weighted_perf: number; // task_weight * task_final_score
}

export interface EmployeePerformanceSummary {
  emp_id: string;
  emp_name: string;
  department: string;
  position: string;
  manager_id: string;
  manager_name: string;
  total_tasks: number;
  total_weight_pct: number; // sum of weights
  weighted_final_score: number; // Sumproduct of task_weight * score
  completion_rate_pct: number; // Average progress or completed tasks %
  red_risk_count: number;
  yellow_warning_count: number;
  normal_count: number;
  tasks: CalculatedTaskRow[];
}

export interface DepartmentSummary {
  department: string;
  total_tasks: number;
  avg_progress_pct: number;
  red_count: number;
  yellow_count: number;
  normal_count: number;
  avg_performance_score: number;
}

export type TabId = 
  | 'home'
  | 'lookup_settings'
  | 'employee_master'
  | 'task_master'
  | 'evaluation'
  | 'calculation_engine'
  | 'employee_summary'
  | 'executive_dashboard'
  | 'executive_report'
  | 'powerbi_data';
