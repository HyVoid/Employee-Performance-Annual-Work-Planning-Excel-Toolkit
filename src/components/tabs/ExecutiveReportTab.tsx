import React, { useState } from 'react';
import { useWorkbook } from '../../context/WorkbookContext';
import { computeEmployeeSummary } from '../../utils/excelEngine';
import { Evaluation } from '../../types';
import { Printer, User, Award, CheckSquare, Calendar, Building2 } from 'lucide-react';

export const ExecutiveReportTab: React.FC = () => {
  const { employees, calculatedTasks, lookupSettings, evaluations } = useWorkbook();
  const [selectedEmpId, setSelectedEmpId] = useState<string>(
    employees[1]?.emp_id || employees[0]?.emp_id || 'EMP-001'
  );

  const summary = computeEmployeeSummary(selectedEmpId, employees, calculatedTasks);
  const evalMap = new Map<string, Evaluation>(evaluations.map((ev) => [ev.task_id, ev]));

  const handlePrint = () => {
    window.print();
  };

  if (!summary) return null;

  const todayFormatted = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Top Action & Selector Controls (Hidden during print) */}
      <div className="bg-white p-4 rounded-xl border border-[var(--color-border)] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-2">
          <Printer className="w-5 h-5 text-[var(--color-accent)]" />
          <h2 className="font-heading font-bold text-xl text-[var(--color-primary)] tracking-display">
            Executive_Report (A4 Dynamic Performance Assessment)
          </h2>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedEmpId}
            onChange={(e) => setSelectedEmpId(e.target.value)}
            className="w-full sm:w-64 px-3 py-1.5 bg-[var(--color-input-bg)] border border-slate-300 rounded-lg text-xs font-semibold text-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-accent)]"
          >
            {employees.map((emp) => (
              <option key={emp.emp_id} value={emp.emp_id}>
                {emp.emp_id} - {emp.emp_name} ({emp.department})
              </option>
            ))}
          </select>

          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-medium text-white bg-[var(--color-primary)] hover:bg-slate-800 rounded-lg shadow-xs transition-colors flex items-center gap-2 shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* A4 Printable Page Container */}
      <div className="max-w-[850px] mx-auto bg-white p-8 md:p-12 rounded-xl shadow-md border border-slate-200 a4-print-page">
        {/* 1. Header */}
        <div className="flex items-center justify-between border-b-2 border-[var(--color-primary)] pb-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center font-heading font-bold text-xl">
              P
            </div>
            <div>
              <div className="font-heading font-bold text-xl text-[var(--color-primary)] tracking-tight">
                PERFORMPLAN ENTERPRISE
              </div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                Executive Human Resources &amp; Talent Review
              </div>
            </div>
          </div>

          <div className="text-right">
            <h1 className="font-heading font-bold text-lg text-[var(--color-primary)] tracking-display">
              Annual Performance Assessment Report
            </h1>
            <div className="text-xs text-slate-500 font-mono mt-1">
              Generated: {todayFormatted}
            </div>
          </div>
        </div>

        {/* 2. Employee Profile Metadata */}
        <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 text-xs">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase block">Employee Name</span>
            <span className="font-heading font-bold text-base text-[var(--color-primary)]">
              {summary.emp_name}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase block">Employee ID</span>
            <span className="font-mono font-semibold text-[var(--color-accent)]">{summary.emp_id}</span>
          </div>

          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase block">Department</span>
            <span className="font-medium text-slate-800">{summary.department}</span>
          </div>

          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase block">Position Title</span>
            <span className="font-medium text-slate-800">{summary.position}</span>
          </div>

          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase block">Reporting Manager</span>
            <span className="font-medium text-slate-800">{summary.manager_name}</span>
          </div>

          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase block">Total Assigned Tasks</span>
            <span className="font-mono font-semibold text-slate-800">{summary.total_tasks} Tasks</span>
          </div>

          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase block">Weight Allocation</span>
            <span className="font-mono font-semibold text-slate-800">
              {Math.round(summary.total_weight_pct * 100)}%
            </span>
          </div>

          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase block">Report Status</span>
            <span className="font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
              FINAL APPROVED
            </span>
          </div>
        </div>

        {/* 3. Performance Summary Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="border border-slate-200 rounded-lg p-4 bg-blue-50/20 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Overall Weighted Performance Score
              </div>
              <div className="font-heading font-bold text-3xl text-[var(--color-accent)] mt-1">
                {summary.weighted_final_score.toFixed(2)}{' '}
                <span className="text-xs font-normal text-slate-400">/ 100</span>
              </div>
            </div>
            <Award className="w-8 h-8 text-[var(--color-accent)] opacity-80" />
          </div>

          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Work Plan Progress Completion
              </div>
              <div className="font-heading font-bold text-3xl text-[var(--color-primary)] mt-1">
                {Math.round(summary.completion_rate_pct * 100)}%
              </div>
            </div>
            <CheckSquare className="w-8 h-8 text-emerald-600 opacity-80" />
          </div>
        </div>

        {/* 4. Task Breakdown & 5-Dimensional Scores Table */}
        <div className="mb-8">
          <h3 className="font-heading font-bold text-sm text-[var(--color-primary)] uppercase tracking-wider mb-3">
            Core Task Performance &amp; 5-Dimensional Evaluation Matrix
          </h3>

          <table className="w-full text-left border-collapse border border-slate-200 text-[11px]">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 font-semibold text-[var(--color-primary)] uppercase">
                <th className="py-2 px-3 border-r border-slate-200">Task ID</th>
                <th className="py-2 px-3 border-r border-slate-200">Task Objective</th>
                <th className="py-2 px-2 border-r border-slate-200 text-center">Weight</th>
                <th className="py-2 px-2 border-r border-slate-200 text-center">Quality</th>
                <th className="py-2 px-2 border-r border-slate-200 text-center">Time</th>
                <th className="py-2 px-2 border-r border-slate-200 text-center">Accuracy</th>
                <th className="py-2 px-2 border-r border-slate-200 text-center">Compl.</th>
                <th className="py-2 px-2 border-r border-slate-200 text-center">Doc</th>
                <th className="py-2 px-3 text-right bg-blue-50/80 font-bold text-[var(--color-accent)]">
                  Final Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {summary.tasks.map((task) => {
                const evalRec = evalMap.get(task.task_id);

                return (
                  <tr key={task.task_id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-mono font-semibold text-slate-800 border-r border-slate-200">
                      {task.task_id}
                    </td>

                    <td className="py-2 px-3 font-medium text-slate-900 border-r border-slate-200">
                      {task.task_name}
                    </td>

                    <td className="py-2 px-2 text-center font-mono border-r border-slate-200">
                      {Math.round(task.task_weight * 100)}%
                    </td>

                    <td className="py-2 px-2 text-center font-mono border-r border-slate-200">
                      {evalRec?.score_quality ?? '-'}
                    </td>

                    <td className="py-2 px-2 text-center font-mono border-r border-slate-200">
                      {evalRec?.score_timeliness ?? '-'}
                    </td>

                    <td className="py-2 px-2 text-center font-mono border-r border-slate-200">
                      {evalRec?.score_accuracy ?? '-'}
                    </td>

                    <td className="py-2 px-2 text-center font-mono border-r border-slate-200">
                      {evalRec?.score_completion ?? '-'}
                    </td>

                    <td className="py-2 px-2 text-center font-mono border-r border-slate-200">
                      {evalRec?.score_doc ?? '-'}
                    </td>

                    <td className="py-2 px-3 text-right font-mono font-bold bg-blue-50/30 text-[var(--color-accent)]">
                      {task.task_final_score.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 5. Qualitative Feedback & Signatures */}
        <div className="space-y-6">
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
            <h4 className="font-heading font-semibold text-xs text-[var(--color-primary)] uppercase tracking-wider mb-2">
              Manager Qualitative Assessment &amp; Growth Notes
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed italic">
              "{summary.tasks[0]?.task_name ? evalMap.get(summary.tasks[0]?.task_id)?.comments || 'Demonstrated consistent high quality deliverable execution throughout the review period.' : 'Satisfactory annual contribution.'}"
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 pt-8 border-t border-slate-200">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase">Employee Signature &amp; Date</div>
              <div className="mt-8 border-b border-slate-300 pb-1 text-xs text-slate-400 font-mono">
                Sign: ___________________________ Date: ____________
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase">Manager Signature &amp; Date</div>
              <div className="mt-8 border-b border-slate-300 pb-1 text-xs text-slate-400 font-mono">
                Sign: ___________________________ Date: ____________
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
