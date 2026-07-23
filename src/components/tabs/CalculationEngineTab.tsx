import React, { useState } from 'react';
import { useWorkbook } from '../../context/WorkbookContext';
import { StatusBadge } from '../StatusBadge';
import { InsightBlock } from '../InsightBlock';
import { Database, Search, Code, Cpu } from 'lucide-react';

export const CalculationEngineTab: React.FC = () => {
  const { calculatedTasks, todayStr, setTodayStr } = useWorkbook();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRAG, setSelectedRAG] = useState<string>('ALL');

  const filtered = calculatedTasks.filter((t) => {
    const matchesSearch =
      t.task_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.emp_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.task_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRAG = selectedRAG === 'ALL' || t.rag_status.includes(selectedRAG);
    return matchesSearch && matchesRAG;
  });

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[var(--color-accent)]" />
            <h2 className="font-heading font-bold text-xl text-[var(--color-primary)] tracking-display">
              Calculation_Engine (Excel 365 Dynamic Formula Layer)
            </h2>
          </div>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Central execution kernel processing multi-table joins, dynamic delay days, automatic RAG exception light triggers, and weighted score aggregations.
          </p>
        </div>

        {/* Custom Simulation Date Control */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[var(--color-border)] shadow-xs">
          <Cpu className="w-4 h-4 text-[var(--color-accent)]" />
          <span className="text-xs font-semibold text-slate-700">Simulated Today (TODAY()):</span>
          <input
            type="date"
            value={todayStr}
            onChange={(e) => setTodayStr(e.target.value)}
            className="text-xs font-mono font-semibold px-2 py-1 bg-slate-50 border border-slate-300 rounded focus:ring-2 focus:ring-[var(--color-accent)]"
          />
        </div>
      </div>

      <InsightBlock title="Excel 365 Dynamic Array Formulas (Zero Formula Dragging)">
        <p className="mb-2">
          This engine uses Modern Excel 365 functional programming functions (<code>MAP</code>, <code>LAMBDA</code>, <code>LET</code>, <code>XLOOKUP</code>). Formulas exist strictly in row 2 and auto-spill downwards without manual cell copying.
        </p>
        <details className="cursor-pointer text-[11px] text-slate-600">
          <summary className="font-semibold text-[var(--color-accent)] hover:underline">
            View Sheet Formula Definitions (Click to Expand)
          </summary>
          <div className="mt-2 space-y-2 font-mono bg-slate-900 text-slate-200 p-3 rounded-lg overflow-x-auto text-[10px]">
            <div>
              <span className="text-amber-400">// Formula 1: Task_Status</span>
              <br />
              =MAP(Start_Date, Due_Date, Finish_Date, Progress, LAMBDA(start, due, finish, prog, IF(prog=1, "Completed", IF(TODAY()&gt;due, "Overdue", IF(prog&gt;0, "In Progress", "Not Started")))))
            </div>
            <div>
              <span className="text-amber-400">// Formula 2: Delay_Days</span>
              <br />
              =MAP(Due_Date, Finish_Date, Progress, LAMBDA(due, finish, prog, IF(prog=1, IF(finish&gt;due, finish-due, 0), IF(TODAY()&gt;due, TODAY()-due, 0))))
            </div>
            <div>
              <span className="text-amber-400">// Formula 3: RAG_Status</span>
              <br />
              =MAP(Delay, Due_Date, Progress, LAMBDA(delay, due, prog, IF(prog=1, "🟢 Normal", IF(delay&gt;0, "🔴 Delay Risk", IF((due-TODAY())&lt;=Lookup_Settings!$C$9, "🟡 Warning Critical", "🟢 Normal")))))
            </div>
          </div>
        </details>
      </InsightBlock>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[var(--color-border)] shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search task ID, employee or objective..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-slate-500 font-medium">Filter RAG Status:</span>
          <select
            value={selectedRAG}
            onChange={(e) => setSelectedRAG(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          >
            <option value="ALL">All RAG Statuses</option>
            <option value="🔴">🔴 Delay Risk</option>
            <option value="🟡">🟡 Warning Critical</option>
            <option value="🟢">🟢 Normal</option>
          </select>
        </div>
      </div>

      {/* Engine Calculated Data Table */}
      <div className="bg-white rounded-xl shadow-xs border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--table-header-bg)] border-b-2 border-[var(--table-header-sep)] text-[var(--color-primary)] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Task ID</th>
                <th className="py-3 px-4">Emp ID &amp; Assignee</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 min-w-[200px]">Task Objective Title</th>
                <th className="py-3 px-4">Task Status</th>
                <th className="py-3 px-4 text-right">Delay Days</th>
                <th className="py-3 px-4">RAG Status (Exception)</th>
                <th className="py-3 px-4 text-right">Weighted Final Score</th>
                <th className="py-3 px-4 text-right bg-blue-50/60 text-[var(--color-accent)]">
                  Weighted Contribution (Weight × Score)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)] text-xs">
              {filtered.map((t) => {
                const isOverdue = t.delay_days > 0;

                return (
                  <tr
                    key={t.task_id}
                    className={`hover:bg-slate-50/80 transition-colors duration-150 ${
                      t.rag_status === '🔴 Delay Risk' ? 'bg-red-50/30' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-semibold text-[var(--color-primary)]">
                      {t.task_id}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900">{t.emp_name}</div>
                      <div className="text-[10px] font-mono text-slate-500">{t.emp_id}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-600">{t.department}</td>

                    <td className="py-3 px-4 font-medium text-slate-800">{t.task_name}</td>

                    <td className="py-3 px-4">
                      <StatusBadge status={t.task_status} />
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-semibold">
                      <span className={isOverdue ? 'text-[var(--color-negative)]' : 'text-slate-600'}>
                        {t.delay_days > 0 ? `+${t.delay_days} days` : '0'}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <StatusBadge status={t.rag_status} />
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800">
                      {t.task_final_score.toFixed(2)}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold bg-blue-50/30 text-[var(--color-accent)]">
                      {t.emp_weighted_perf.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
