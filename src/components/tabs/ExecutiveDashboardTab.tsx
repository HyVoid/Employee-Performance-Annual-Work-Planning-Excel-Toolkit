import React, { useState } from 'react';
import { useWorkbook } from '../../context/WorkbookContext';
import { StatusBadge } from '../StatusBadge';
import { DataBar } from '../DataBar';
import { InsightBlock } from '../InsightBlock';
import {
  BarChart3,
  AlertTriangle,
  Users,
  CheckCircle2,
  Building2,
  Search,
} from 'lucide-react';

export const ExecutiveDashboardTab: React.FC = () => {
  const { calculatedTasks, departmentSummaries, employees } = useWorkbook();
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('ALL');

  const totalTasks = calculatedTasks.length;
  const overallAvgProgress =
    totalTasks > 0
      ? Math.round(
          (calculatedTasks.reduce((acc, t) => acc + t.progress_pct, 0) / totalTasks) * 100
        )
      : 0;

  const redCount = calculatedTasks.filter((t) => t.rag_status === '🔴 Delay Risk').length;
  const yellowCount = calculatedTasks.filter((t) => t.rag_status === '🟡 Warning Critical').length;
  const normalCount = calculatedTasks.filter((t) => t.rag_status === '🟢 Normal').length;

  const companyAvgScore =
    totalTasks > 0
      ? Math.round(
          (calculatedTasks.reduce((acc, t) => acc + t.task_final_score, 0) / totalTasks) * 10
        ) / 10
      : 0;

  const filteredTasks = calculatedTasks.filter(
    (t) => selectedDeptFilter === 'ALL' || t.department === selectedDeptFilter
  );

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[var(--color-accent)]" />
          <h2 className="font-heading font-bold text-xl text-[var(--color-primary)] tracking-display">
            Executive_Dashboard (High-Level Management Cockpit)
          </h2>
        </div>
        <p className="text-xs text-[var(--color-muted)] mt-1">
          Executive monitoring center displaying company-wide KPIs, department performance benchmarks, and RAG risk matrix.
        </p>
      </div>

      {/* Global Hero KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Completion Rate */}
        <div className="bg-white p-5 rounded-xl shadow-xs border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Overall Completion Rate %
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-heading font-bold text-3xl text-[var(--color-primary)] tracking-display">
            {overallAvgProgress}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            =AVERAGE(Task_Master!Progress_Pct)
          </div>
        </div>

        {/* Red Risk Count */}
        <div className="bg-white p-5 rounded-xl shadow-xs border border-[var(--color-border)] border-l-4 border-l-[var(--color-negative)]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Red Light Delay Tasks
            </span>
            <AlertTriangle className="w-4 h-4 text-[var(--color-negative)]" />
          </div>
          <div className="font-heading font-bold text-3xl text-[var(--color-negative)] tracking-display">
            {redCount}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            =COUNTIF(Engine!RAG, "🔴 Delay Risk")
          </div>
        </div>

        {/* Company Avg Score */}
        <div className="bg-white p-5 rounded-xl shadow-xs border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Company Avg Score
            </span>
            <BarChart3 className="w-4 h-4 text-[var(--color-accent)]" />
          </div>
          <div className="font-heading font-bold text-3xl text-[var(--color-accent)] tracking-display">
            {companyAvgScore} / 100
          </div>
          <div className="text-xs text-slate-500 mt-1">
            5-Dimensional Weighted Metric
          </div>
        </div>

        {/* Active Capacity */}
        <div className="bg-white p-5 rounded-xl shadow-xs border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Active Strategic Capacity
            </span>
            <Users className="w-4 h-4 text-slate-500" />
          </div>
          <div className="font-heading font-bold text-3xl text-[var(--color-primary)] tracking-display">
            {totalTasks}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Across {employees.length} Staff Members
          </div>
        </div>
      </div>

      <InsightBlock title="Department Execution Variance & Exception Management">
        The table below is generated dynamically via formula logic without requiring pivot table refreshes. Departments with elevated red risk counts are highlighted for priority executive intervention.
      </InsightBlock>

      {/* Department Comparison Matrix Table */}
      <div className="bg-white rounded-xl shadow-xs border border-[var(--color-border)] p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[var(--color-primary)]" />
            <h3 className="font-heading font-semibold text-base text-[var(--color-primary)]">
              Department Performance &amp; Risk Matrix (Dynamic Formula Array)
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--table-header-bg)] border-b-2 border-[var(--table-header-sep)] text-[var(--color-primary)] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Department Name</th>
                <th className="py-3 px-4 text-right">Total Tasks</th>
                <th className="py-3 px-4 min-w-[160px]">Avg Completion Progress</th>
                <th className="py-3 px-4 text-center">🔴 Red Delay Count</th>
                <th className="py-3 px-4 text-center">🟡 Yellow Warning Count</th>
                <th className="py-3 px-4 text-center">🟢 Normal Count</th>
                <th className="py-3 px-4 text-right bg-blue-50/50 text-[var(--color-accent)]">
                  Dept Avg Performance Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)] text-xs">
              {departmentSummaries.map((dept) => {
                return (
                  <tr
                    key={dept.department}
                    className="hover:bg-slate-50/80 transition-colors duration-150"
                  >
                    <td className="py-3 px-4 font-semibold text-[var(--color-primary)]">
                      {dept.department}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-700">
                      {dept.total_tasks}
                    </td>

                    <td className="py-3 px-4">
                      <DataBar value={dept.avg_progress_pct} />
                    </td>

                    <td className="py-3 px-4 text-center font-mono font-bold">
                      {dept.red_count > 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-xs">
                          {dept.red_count}
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center font-mono font-semibold text-amber-700">
                      {dept.yellow_count}
                    </td>

                    <td className="py-3 px-4 text-center font-mono text-emerald-700 font-semibold">
                      {dept.normal_count}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-sm bg-blue-50/30 text-[var(--color-accent)]">
                      {dept.avg_performance_score.toFixed(1)} / 100
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drilldown Task Filter */}
      <div className="bg-white rounded-xl shadow-xs border border-[var(--color-border)] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="font-heading font-semibold text-base text-[var(--color-primary)]">
            Executive Task Drill-down List
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Department Filter:</span>
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            >
              <option value="ALL">All Departments</option>
              {departmentSummaries.map((d) => (
                <option key={d.department} value={d.department}>
                  {d.department}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--table-header-bg)] border-b-2 border-[var(--table-header-sep)] text-[var(--color-primary)] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Task ID</th>
                <th className="py-2.5 px-3">Assignee</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Task Title</th>
                <th className="py-2.5 px-3">Plan Due</th>
                <th className="py-2.5 px-3 min-w-[120px]">Progress</th>
                <th className="py-2.5 px-3">RAG</th>
                <th className="py-2.5 px-3 text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)] text-xs">
              {filteredTasks.map((t) => (
                <tr key={t.task_id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-semibold text-[var(--color-primary)]">
                    {t.task_id}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">{t.emp_name}</td>
                  <td className="py-2.5 px-3 text-slate-600">{t.department}</td>
                  <td className="py-2.5 px-3 text-slate-800">{t.task_name}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">{t.plan_due_date}</td>
                  <td className="py-2.5 px-3">
                    <DataBar value={t.progress_pct} />
                  </td>
                  <td className="py-2.5 px-3">
                    <StatusBadge status={t.rag_status} />
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold text-[var(--color-accent)]">
                    {t.task_final_score.toFixed(1)}
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
