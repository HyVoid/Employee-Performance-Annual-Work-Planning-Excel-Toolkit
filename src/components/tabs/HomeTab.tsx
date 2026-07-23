import React from 'react';
import { useWorkbook } from '../../context/WorkbookContext';
import { InsightBlock } from '../InsightBlock';
import { TabId } from '../../types';
import {
  Users,
  CheckSquare,
  Award,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sliders,
  Database,
  BarChart3,
  Printer,
  FileSpreadsheet,
} from 'lucide-react';

export const HomeTab: React.FC = () => {
  const { calculatedTasks, employees, departmentSummaries, setActiveTab } = useWorkbook();

  const totalTasks = calculatedTasks.length;
  const redRisks = calculatedTasks.filter((t) => t.rag_status === '🔴 Delay Risk').length;
  const yellowWarnings = calculatedTasks.filter((t) => t.rag_status === '🟡 Warning Critical').length;
  const avgScore =
    totalTasks > 0
      ? Math.round((calculatedTasks.reduce((acc, t) => acc + t.task_final_score, 0) / totalTasks) * 10) / 10
      : 0;

  const sopSteps = [
    {
      step: '01',
      title: 'Maintain Staff Directory',
      sheet: 'Employee_Master',
      tabId: 'employee_master' as TabId,
      desc: 'Add new staff members, positions, and reporting managers into Employee Master.',
      icon: Users,
    },
    {
      step: '02',
      title: 'Formulate Work Plans',
      sheet: 'Task_Master',
      tabId: 'task_master' as TabId,
      desc: 'Define annual tasks, target due dates, and effort weights (100% per employee).',
      icon: CheckSquare,
    },
    {
      step: '03',
      title: 'Track Monthly Progress',
      sheet: 'Task_Master',
      tabId: 'task_master' as TabId,
      desc: 'Update progress % and completion dates. Engine automatically triggers RAG warning signals.',
      icon: TrendingUp,
    },
    {
      step: '04',
      title: 'Evaluate Performance',
      sheet: 'Evaluation',
      tabId: 'evaluation' as TabId,
      desc: 'Score tasks across 5 quality dimensions (Quality, Timeliness, Accuracy, Completion, Doc).',
      icon: Award,
    },
    {
      step: '05',
      title: 'Executive Reporting',
      sheet: 'Executive_Report',
      tabId: 'executive_report' as TabId,
      desc: 'Generate printable A4 individual evaluation reports and export Power BI datasets.',
      icon: Printer,
    },
  ];

  const quickNavCards = [
    {
      id: 'lookup_settings' as TabId,
      title: 'Lookup Settings',
      desc: 'Global evaluation weights & RAG thresholds',
      icon: Sliders,
      badge: 'Configuration',
    },
    {
      id: 'employee_master' as TabId,
      title: 'Employee Master',
      desc: `${employees.length} Active Staff Records`,
      icon: Users,
      badge: 'Master Data',
    },
    {
      id: 'task_master' as TabId,
      title: 'Task Master',
      desc: `${totalTasks} Annual Strategic Tasks`,
      icon: CheckSquare,
      badge: 'Work Plans',
    },
    {
      id: 'evaluation' as TabId,
      title: 'Evaluation',
      desc: '5-Dimensional Quality Scoring',
      icon: Award,
      badge: 'Scoring Engine',
    },
    {
      id: 'calculation_engine' as TabId,
      title: 'Calculation Engine',
      desc: 'Live Excel Dynamic Formulas',
      icon: Database,
      badge: 'Formula Layer',
    },
    {
      id: 'employee_summary' as TabId,
      title: 'Employee Summary',
      desc: 'Individual Performance Scorecards',
      icon: Users,
      badge: 'Individual Views',
    },
    {
      id: 'executive_dashboard' as TabId,
      title: 'Executive Dashboard',
      desc: 'Department Metrics & Risk Matrix',
      icon: BarChart3,
      badge: 'Management Cockpit',
    },
    {
      id: 'executive_report' as TabId,
      title: 'Executive Report',
      desc: 'Standardized A4 Print Template',
      icon: Printer,
      badge: 'PDF / Print',
    },
    {
      id: 'powerbi_data' as TabId,
      title: 'PowerBI Data',
      desc: 'Flattened Star Schema Dataset',
      icon: FileSpreadsheet,
      badge: 'Data Model',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Title Header */}
      <div>
        <h1 className="font-heading font-bold text-2xl md:text-3xl text-[var(--color-primary)] tracking-display">
          Employee Performance &amp; Annual Work Plan System
        </h1>
        <p className="text-xs md:text-sm text-[var(--color-muted)] mt-1 max-w-3xl">
          Enterprise SaaS platform powered by a zero-maintenance Excel dynamic calculation engine, automated RAG exception tracking, and Power BI analytics modeling.
        </p>
      </div>

      {/* Hero KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-xs border border-[var(--color-border)] hover:-translate-y-0.5 transition-transform duration-200">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-1">
            Total Staff Count
          </div>
          <div className="font-heading font-bold text-3xl text-[var(--color-primary)] tracking-display">
            {employees.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Across {departmentSummaries.length} Departments</div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-xs border border-[var(--color-border)] hover:-translate-y-0.5 transition-transform duration-200">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-1">
            Active Annual Tasks
          </div>
          <div className="font-heading font-bold text-3xl text-[var(--color-primary)] tracking-display">
            {totalTasks}
          </div>
          <div className="text-xs text-slate-500 mt-1">100% Weighted Plan Coverage</div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-xs border border-[var(--color-border)] hover:-translate-y-0.5 transition-transform duration-200">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-1">
            RAG Overdue Risks
          </div>
          <div className="font-heading font-bold text-3xl text-[var(--color-negative)] tracking-display flex items-center gap-2">
            <span>{redRisks}</span>
            <span className="text-xs font-normal text-amber-600">({yellowWarnings} Warning)</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">Requires Executive Attention</div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-xs border border-[var(--color-border)] hover:-translate-y-0.5 transition-transform duration-200">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-1">
            Company Average Score
          </div>
          <div className="font-heading font-bold text-3xl text-[var(--color-accent)] tracking-display">
            {avgScore} / 100
          </div>
          <div className="text-xs text-slate-500 mt-1">5-Dimensional Weighted Metric</div>
        </div>
      </div>

      {/* Insight Block */}
      <InsightBlock title="Standard Operating Procedure (SOP) & Management Principles">
        This platform enforces Management by Exception (RAG signal alert automation) and zero-hardcoding calculation standards. All calculations update instantly in the browser and auto-save locally.
      </InsightBlock>

      {/* Interactive SOP Workflow */}
      <div className="bg-white p-6 rounded-xl shadow-xs border border-[var(--color-border)]">
        <h3 className="font-heading font-bold text-lg text-[var(--color-primary)] mb-4">
          Standard Operating Procedure (SOP) Workflow
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {sopSteps.map((step, idx) => {
            const IconComp = step.icon;
            return (
              <div
                key={step.step}
                onClick={() => setActiveTab(step.tabId)}
                className="relative bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 hover:bg-blue-50/50 hover:border-[var(--color-accent)] cursor-pointer transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-[var(--color-accent)] bg-blue-100/60 px-2 py-0.5 rounded-full">
                      Step {step.step}
                    </span>
                    <IconComp className="w-4 h-4 text-slate-400 group-hover:text-[var(--color-accent)] transition-colors" />
                  </div>
                  <h4 className="font-heading font-semibold text-sm text-[var(--color-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                <div className="mt-3 flex items-center text-[11px] font-semibold text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Open {step.sheet}</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Worksheet Grid */}
      <div>
        <h3 className="font-heading font-bold text-lg text-[var(--color-primary)] mb-4">
          Worksheet Navigation Directory (10 Sheets)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickNavCards.map((card) => {
            const IconComp = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => setActiveTab(card.id)}
                className="bg-white p-4 rounded-xl shadow-xs border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-start gap-3 group"
              >
                <div className="p-2.5 rounded-lg bg-slate-100 group-hover:bg-blue-100/60 text-[var(--color-primary)] group-hover:text-[var(--color-accent)] transition-colors shrink-0">
                  <IconComp className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-heading font-semibold text-sm text-[var(--color-primary)] group-hover:text-[var(--color-accent)] transition-colors truncate">
                      {card.title}
                    </h4>
                    <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                      {card.badge}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-muted)] mt-1 truncate">
                    {card.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
