import React, { useState } from 'react';
import { useWorkbook } from '../../context/WorkbookContext';
import { InsightBlock } from '../InsightBlock';
import { Evaluation } from '../../types';
import { FileSpreadsheet, Copy, Download, CheckCircle2 } from 'lucide-react';

export const PowerBIDataTab: React.FC = () => {
  const { calculatedTasks, evaluations } = useWorkbook();
  const [copied, setCopied] = useState(false);

  const evalMap = new Map<string, Evaluation>(evaluations.map((ev) => [ev.task_id, ev]));

  // Build flattened tabular rows
  const flatRows = calculatedTasks.map((t) => {
    const ev = evalMap.get(t.task_id);
    return {
      Task_ID: t.task_id,
      Emp_ID: t.emp_id,
      Emp_Name: t.emp_name,
      Department: t.department,
      Task_Name: t.task_name,
      Task_Weight: t.task_weight,
      Plan_Start_Date: t.plan_start_date,
      Plan_Due_Date: t.plan_due_date,
      Actual_Finish_Date: t.actual_finish_date || '',
      Progress_Pct: t.progress_pct,
      Task_Status: t.task_status,
      Delay_Days: t.delay_days,
      RAG_Status: t.rag_status,
      Task_Final_Score: t.task_final_score,
      Score_Quality: ev?.score_quality ?? 0,
      Score_Timeliness: ev?.score_timeliness ?? 0,
      Score_Accuracy: ev?.score_accuracy ?? 0,
      Score_Completion: ev?.score_completion ?? 0,
      Score_Doc: ev?.score_doc ?? 0,
    };
  });

  const getCsvString = () => {
    if (flatRows.length === 0) return '';
    const headers = Object.keys(flatRows[0]).join(',');
    const rows = flatRows.map((r) =>
      Object.values(r)
        .map((val) => `"${String(val).replace(/"/g, '""')}"`)
        .join(',')
    );
    return [headers, ...rows].join('\n');
  };

  const handleCopyClipboard = () => {
    const text = getCsvString();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleDownloadCsv = () => {
    const text = getCsvString();
    const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PerformPlan_PowerBI_FlatTable_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[var(--color-accent)]" />
            <h2 className="font-heading font-bold text-xl text-[var(--color-primary)] tracking-display">
              PowerBI_Data (Flattened Analytics Modeling Interface)
            </h2>
          </div>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Star Schema flat table interface for Microsoft Power BI, Tableau, or Google Looker Studio ingestion.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleCopyClipboard}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-positive)]" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Table</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadCsv}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-[var(--color-accent)] hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Power BI CSV</span>
          </button>
        </div>
      </div>

      <InsightBlock title="Power BI Star Schema & Power Query Ingestion">
        This flattened dataset removes merged cells and multi-tier headers. Power Query can directly connect to this endpoint or import the CSV without requiring complex ETL transformation logic.
      </InsightBlock>

      {/* Flat Data Table */}
      <div className="bg-white rounded-xl shadow-xs border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--table-header-bg)] border-b-2 border-[var(--table-header-sep)] text-[var(--color-primary)] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3">Task_ID</th>
                <th className="py-3 px-3">Emp_ID</th>
                <th className="py-3 px-3">Emp_Name</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3 min-w-[180px]">Task_Name</th>
                <th className="py-3 px-3 text-right">Weight</th>
                <th className="py-3 px-3">Due_Date</th>
                <th className="py-3 px-3 text-right">Progress</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">RAG</th>
                <th className="py-3 px-3 text-right bg-blue-50/60 font-bold text-[var(--color-accent)]">
                  Final_Score
                </th>
                <th className="py-3 px-2 text-center">Quality</th>
                <th className="py-3 px-2 text-center">Time</th>
                <th className="py-3 px-2 text-center">Accuracy</th>
                <th className="py-3 px-2 text-center">Compl</th>
                <th className="py-3 px-2 text-center">Doc</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)] text-xs font-mono">
              {flatRows.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-[var(--color-primary)]">{r.Task_ID}</td>
                  <td className="py-2.5 px-3 text-slate-600">{r.Emp_ID}</td>
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-900">{r.Emp_Name}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-600">{r.Department}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-800">{r.Task_Name}</td>
                  <td className="py-2.5 px-3 text-right">{Math.round(r.Task_Weight * 100)}%</td>
                  <td className="py-2.5 px-3 text-slate-600">{r.Plan_Due_Date}</td>
                  <td className="py-2.5 px-3 text-right">{Math.round(r.Progress_Pct * 100)}%</td>
                  <td className="py-2.5 px-3 font-sans">{r.Task_Status}</td>
                  <td className="py-2.5 px-3 font-sans">{r.RAG_Status}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-[var(--color-accent)] bg-blue-50/30">
                    {r.Task_Final_Score.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-2 text-center">{r.Score_Quality}</td>
                  <td className="py-2.5 px-2 text-center">{r.Score_Timeliness}</td>
                  <td className="py-2.5 px-2 text-center">{r.Score_Accuracy}</td>
                  <td className="py-2.5 px-2 text-center">{r.Score_Completion}</td>
                  <td className="py-2.5 px-2 text-center">{r.Score_Doc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
