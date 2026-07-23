import React, { useState } from 'react';
import { useWorkbook } from '../../context/WorkbookContext';
import { computeEmployeeSummary } from '../../utils/excelEngine';
import { StatusBadge } from '../StatusBadge';
import { DataBar } from '../DataBar';
import { InsightBlock } from '../InsightBlock';
import { UserCheck, Award, AlertTriangle, CheckSquare, Layers } from 'lucide-react';

export const EmployeeSummaryTab: React.FC = () => {
  const { employees, calculatedTasks } = useWorkbook();
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[1]?.emp_id || employees[0]?.emp_id || 'EMP-001');

  const summary = computeEmployeeSummary(selectedEmpId, employees, calculatedTasks);

  if (!summary) {
    return (
      <div className="p-8 text-center text-slate-500">
        No employee records found. Please select an employee.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Employee Selector Bar */}
      <div className="bg-white p-4 rounded-xl border border-[var(--color-border)] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-[var(--color-accent)]" />
          <h2 className="font-heading font-bold text-xl text-[var(--color-primary)] tracking-display">
            Employee_Summary (Individual Performance Scorecard)
          </h2>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider shrink-0">
            Select Employee:
          </label>
          <select
            value={selectedEmpId}
            onChange={(e) => setSelectedEmpId(e.target.value)}
            className="w-full sm:w-64 px-3 py-1.5 bg-[var(--color-input-bg)] border border-slate-300 rounded-lg text-xs font-semibold text-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
          >
            {employees.map((emp) => (
              <option key={emp.emp_id} value={emp.emp_id}>
                {emp.emp_id} - {emp.emp_name} ({emp.department})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Employee Bio Profile Banner */}
      <div className="bg-white p-6 rounded-xl shadow-xs border border-[var(--color-border)] grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <div className="text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider">
            Employee Name &amp; ID
          </div>
          <div className="font-heading font-bold text-xl text-[var(--color-primary)] mt-1">
            {summary.emp_name}
          </div>
          <div className="text-xs font-mono text-[var(--color-accent)] mt-0.5">{summary.emp_id}</div>
        </div>

        <div>
          <div className="text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider">
            Department &amp; Position
          </div>
          <div className="font-semibold text-sm text-slate-800 mt-1">{summary.department}</div>
          <div className="text-xs text-slate-500">{summary.position}</div>
        </div>

        <div>
          <div className="text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider">
            Reporting Manager
          </div>
          <div className="font-semibold text-sm text-slate-800 mt-1">{summary.manager_name}</div>
          <div className="text-xs font-mono text-slate-500">{summary.manager_id}</div>
        </div>

        <div>
          <div className="text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider">
            Assigned Weight Coverage
          </div>
          <div className="font-heading font-bold text-xl text-[var(--color-primary)] mt-1">
            {Math.round(summary.total_weight_pct * 100)}%
          </div>
          <div className="text-xs text-slate-500">
            {summary.total_weight_pct === 1.0
              ? '✅ 100% Full Weight Allocated'
              : summary.total_weight_pct < 1.0
              ? '⚠️ Under-allocated (<100%)'
              : '⚠️ Over-allocated (>100%)'}
          </div>
        </div>
      </div>

      {/* Core Scorecard KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Weighted Performance Score */}
        <div className="bg-white p-5 rounded-xl shadow-xs border border-[var(--color-border)] border-l-4 border-l-[var(--color-accent)]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Weighted Final Performance Score
            </span>
            <Award className="w-4 h-4 text-[var(--color-accent)]" />
          </div>
          <div className="font-heading font-bold text-3xl text-[var(--color-accent)] tracking-display">
            {summary.weighted_final_score.toFixed(2)}
            <span className="text-xs text-slate-400 font-normal ml-1">/ 100</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">SUMPRODUCT(Task Weights, Scores)</div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white p-5 rounded-xl shadow-xs border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Average Task Completion Rate
            </span>
            <CheckSquare className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-heading font-bold text-3xl text-[var(--color-primary)] tracking-display">
            {Math.round(summary.completion_rate_pct * 100)}%
          </div>
          <div className="text-xs text-slate-500 mt-1">Across {summary.total_tasks} Assigned Tasks</div>
        </div>

        {/* Delay Risks */}
        <div className="bg-white p-5 rounded-xl shadow-xs border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Red Delay Risks Count
            </span>
            <AlertTriangle className="w-4 h-4 text-[var(--color-negative)]" />
          </div>
          <div className="font-heading font-bold text-3xl text-[var(--color-negative)] tracking-display">
            {summary.red_risk_count}
          </div>
          <div className="text-xs text-slate-500 mt-1">Overdue or Breached Deliverables</div>
        </div>

        {/* RAG Status Distribution */}
        <div className="bg-white p-5 rounded-xl shadow-xs border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              RAG Health Breakdown
            </span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <StatusBadge status={`🟢 ${summary.normal_count} Normal`} />
            <StatusBadge status={`🟡 ${summary.yellow_warning_count} Warning`} />
            <StatusBadge status={`🔴 ${summary.red_risk_count} Risk`} />
          </div>
        </div>
      </div>

      {/* Individual Tasks Detail Table */}
      <div className="bg-white rounded-xl shadow-xs border border-[var(--color-border)] p-6">
        <h3 className="font-heading font-semibold text-base text-[var(--color-primary)] mb-4">
          Assigned Tasks &amp; Multi-Dimensional Performance Breakdown
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--table-header-bg)] border-b-2 border-[var(--table-header-sep)] text-[var(--color-primary)] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Task ID</th>
                <th className="py-3 px-4 min-w-[200px]">Annual Task Objective</th>
                <th className="py-3 px-4 text-right">Weight %</th>
                <th className="py-3 px-4">Plan Start / Due</th>
                <th className="py-3 px-4 min-w-[120px]">Progress %</th>
                <th className="py-3 px-4">Task Lifecycle</th>
                <th className="py-3 px-4">RAG Status</th>
                <th className="py-3 px-4 text-right">Weighted Final Score</th>
                <th className="py-3 px-4 text-right bg-blue-50/50 text-[var(--color-accent)]">
                  Weighted Contribution
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)] text-xs">
              {summary.tasks.map((task) => (
                <tr key={task.task_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-[var(--color-primary)]">
                    {task.task_id}
                  </td>

                  <td className="py-3 px-4 font-medium text-slate-900">{task.task_name}</td>

                  <td className="py-3 px-4 text-right font-mono font-semibold text-[var(--color-accent)]">
                    {Math.round(task.task_weight * 100)}%
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                    <div>{task.plan_start_date}</div>
                    <div>to {task.plan_due_date}</div>
                  </td>

                  <td className="py-3 px-4">
                    <DataBar value={task.progress_pct} />
                  </td>

                  <td className="py-3 px-4">
                    <StatusBadge status={task.task_status} />
                  </td>

                  <td className="py-3 px-4">
                    <StatusBadge status={task.rag_status} />
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800">
                    {task.task_final_score.toFixed(2)}
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-bold bg-blue-50/30 text-[var(--color-accent)]">
                    {task.emp_weighted_perf.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
