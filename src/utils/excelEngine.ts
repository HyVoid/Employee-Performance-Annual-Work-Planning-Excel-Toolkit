import {
  CalculatedTaskRow,
  DepartmentSummary,
  Employee,
  EmployeePerformanceSummary,
  Evaluation,
  LookupSettings,
  RAGStatus,
  Task,
  TaskStatus,
} from '../types';

/**
 * Calculates day difference between two YYYY-MM-DD date strings (dateA - dateB)
 */
export function getDaysDifference(dateStrA: string, dateStrB: string): number {
  if (!dateStrA || !dateStrB) return 0;
  const timeA = new Date(dateStrA).getTime();
  const timeB = new Date(dateStrB).getTime();
  if (isNaN(timeA) || isNaN(timeB)) return 0;
  const diffTime = timeA - timeB;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Formula: Single task multi-dimensional weighted score
 * Score = Quality*W1 + Timeliness*W2 + Accuracy*W3 + Completion*W4 + Doc*W5
 */
export function calculateWeightedTaskScore(
  evalRecord: Evaluation | undefined,
  settings: LookupSettings
): number {
  if (!evalRecord) return 0;
  const q = evalRecord.score_quality || 0;
  const t = evalRecord.score_timeliness || 0;
  const a = evalRecord.score_accuracy || 0;
  const c = evalRecord.score_completion || 0;
  const d = evalRecord.score_doc || 0;

  const score =
    q * settings.dim_quality_weight +
    t * settings.dim_timeliness_weight +
    a * settings.dim_accuracy_weight +
    c * settings.dim_completion_weight +
    d * settings.dim_doc_weight;

  return Math.round(score * 100) / 100;
}

/**
 * Formula: Dynamic Task Lifecycle Status
 */
export function getTaskLifecycleStatus(task: Task, todayStr: string): TaskStatus {
  if (task.progress_pct >= 1.0) {
    return 'Completed';
  }
  if (task.plan_due_date && todayStr > task.plan_due_date) {
    return 'Overdue';
  }
  if (task.progress_pct > 0) {
    return 'In Progress';
  }
  return 'Not Started';
}

/**
 * Formula: Dynamic Delay Days Calculation
 */
export function getTaskDelayDays(task: Task, todayStr: string): number {
  if (task.progress_pct >= 1.0) {
    if (task.actual_finish_date && task.actual_finish_date > task.plan_due_date) {
      return Math.max(0, getDaysDifference(task.actual_finish_date, task.plan_due_date));
    }
    return 0;
  }

  if (task.plan_due_date && todayStr > task.plan_due_date) {
    return Math.max(0, getDaysDifference(todayStr, task.plan_due_date));
  }

  return 0;
}

/**
 * Formula: RAG Risk Status (🔴 Delay Risk / 🟡 Warning Critical / 🟢 Normal)
 */
export function getTaskRAGStatus(
  task: Task,
  delayDays: number,
  settings: LookupSettings,
  todayStr: string
): RAGStatus {
  if (task.progress_pct >= 1.0) {
    return '🟢 Normal';
  }
  if (delayDays > 0) {
    return '🔴 Delay Risk';
  }
  const daysToDue = getDaysDifference(task.plan_due_date, todayStr);
  if (daysToDue >= 0 && daysToDue <= settings.rag_yellow_days) {
    return '🟡 Warning Critical';
  }
  return '🟢 Normal';
}

/**
 * Main Calculation Engine: Transforms raw Task_Master data by running
 * XLOOKUP employee details + XLOOKUP evaluation scores + MAP/LAMBDA dynamic rules
 */
export function computeCalculatedTasks(
  employees: Employee[],
  tasks: Task[],
  evaluations: Evaluation[],
  settings: LookupSettings,
  todayStr: string = new Date().toISOString().split('T')[0]
): CalculatedTaskRow[] {
  const empMap = new Map<string, Employee>();
  employees.forEach((emp) => empMap.set(emp.emp_id, emp));

  const evalMap = new Map<string, Evaluation>();
  evaluations.forEach((ev) => evalMap.set(ev.task_id, ev));

  return tasks.map((task) => {
    const emp = empMap.get(task.emp_id);
    const evalRecord = evalMap.get(task.task_id);

    const emp_name = emp ? emp.emp_name : 'Unknown Employee';
    const department = emp ? emp.department : 'Unknown Dept';

    const task_status = getTaskLifecycleStatus(task, todayStr);
    const delay_days = getTaskDelayDays(task, todayStr);
    const rag_status = getTaskRAGStatus(task, delay_days, settings, todayStr);

    const task_final_score = calculateWeightedTaskScore(evalRecord, settings);
    const emp_weighted_perf = Math.round(task.task_weight * task_final_score * 100) / 100;

    return {
      task_id: task.task_id,
      emp_id: task.emp_id,
      emp_name,
      department,
      task_name: task.task_name,
      task_weight: task.task_weight,
      plan_start_date: task.plan_start_date,
      plan_due_date: task.plan_due_date,
      actual_finish_date: task.actual_finish_date || '',
      progress_pct: task.progress_pct,
      task_status,
      delay_days,
      rag_status,
      task_final_score,
      emp_weighted_perf,
    };
  });
}

/**
 * Computes Employee Performance Summary (SUMPRODUCT weighted scores, completion rates, RAG)
 */
export function computeEmployeeSummary(
  empId: string,
  employees: Employee[],
  calculatedTasks: CalculatedTaskRow[]
): EmployeePerformanceSummary | null {
  const emp = employees.find((e) => e.emp_id === empId);
  if (!emp) return null;

  const manager = employees.find((m) => m.emp_id === emp.manager_id);
  const manager_name = manager ? manager.emp_name : emp.manager_id === 'EMP-000' ? 'Executive Board' : 'N/A';

  const empTasks = calculatedTasks.filter((t) => t.emp_id === empId);

  let total_weight = 0;
  let weighted_score_sum = 0;
  let total_progress = 0;
  let red_count = 0;
  let yellow_count = 0;
  let normal_count = 0;

  empTasks.forEach((t) => {
    total_weight += t.task_weight;
    weighted_score_sum += t.task_weight * t.task_final_score;
    total_progress += t.progress_pct;

    if (t.rag_status === '🔴 Delay Risk') red_count++;
    else if (t.rag_status === '🟡 Warning Critical') yellow_count++;
    else normal_count++;
  });

  // SUMPRODUCT(weights, scores) if weights sum to 1.0 (or normalized)
  const weighted_final_score =
    total_weight > 0
      ? Math.round((weighted_score_sum / (total_weight > 1.0001 ? total_weight : 1.0)) * 100) / 100
      : 0;

  const completion_rate_pct =
    empTasks.length > 0 ? Math.round((total_progress / empTasks.length) * 100) / 100 : 0;

  return {
    emp_id: emp.emp_id,
    emp_name: emp.emp_name,
    department: emp.department,
    position: emp.position,
    manager_id: emp.manager_id,
    manager_name,
    total_tasks: empTasks.length,
    total_weight_pct: Math.round(total_weight * 100) / 100,
    weighted_final_score,
    completion_rate_pct,
    red_risk_count: red_count,
    yellow_warning_count: yellow_count,
    normal_count: normal_count,
    tasks: empTasks,
  };
}

/**
 * Computes Executive Dashboard Department Matrix
 */
export function computeDepartmentSummaries(
  employees: Employee[],
  calculatedTasks: CalculatedTaskRow[]
): DepartmentSummary[] {
  const deptMap = new Map<string, CalculatedTaskRow[]>();

  // Collect departments from employee master
  const depts = Array.from(new Set(employees.map((e) => e.department))).filter(Boolean);

  depts.forEach((d) => deptMap.set(d, []));

  calculatedTasks.forEach((task) => {
    const list = deptMap.get(task.department);
    if (list) {
      list.push(task);
    } else {
      deptMap.set(task.department, [task]);
    }
  });

  const result: DepartmentSummary[] = [];

  deptMap.forEach((tasks, deptName) => {
    if (tasks.length === 0) {
      result.push({
        department: deptName,
        total_tasks: 0,
        avg_progress_pct: 0,
        red_count: 0,
        yellow_count: 0,
        normal_count: 0,
        avg_performance_score: 0,
      });
      return;
    }

    let progressSum = 0;
    let scoreSum = 0;
    let red_count = 0;
    let yellow_count = 0;
    let normal_count = 0;

    tasks.forEach((t) => {
      progressSum += t.progress_pct;
      scoreSum += t.task_final_score;
      if (t.rag_status === '🔴 Delay Risk') red_count++;
      else if (t.rag_status === '🟡 Warning Critical') yellow_count++;
      else normal_count++;
    });

    result.push({
      department: deptName,
      total_tasks: tasks.length,
      avg_progress_pct: Math.round((progressSum / tasks.length) * 100) / 100,
      red_count,
      yellow_count,
      normal_count,
      avg_performance_score: Math.round((scoreSum / tasks.length) * 100) / 100,
    });
  });

  return result.sort((a, b) => b.total_tasks - a.total_tasks);
}
