import React, { useState } from 'react';
import { useWorkbook } from '../context/WorkbookContext';
import { TabId } from '../types';
import { CsvImportModal } from './modals/CsvImportModal';
import { BackupModal } from './modals/BackupModal';
import {
  FileSpreadsheet,
  Save,
  Download,
  Upload,
  RefreshCw,
  Layers,
} from 'lucide-react';

export const HeaderNav: React.FC = () => {
  const { activeTab, setActiveTab, lastSaved } = useWorkbook();
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  const tabs: { id: TabId; label: string }[] = [
    { id: 'home', label: 'Home / SOP' },
    { id: 'lookup_settings', label: 'Lookup Settings' },
    { id: 'employee_master', label: 'Employee Master' },
    { id: 'task_master', label: 'Task Master' },
    { id: 'evaluation', label: 'Evaluation' },
    { id: 'calculation_engine', label: 'Calculation Engine' },
    { id: 'employee_summary', label: 'Employee Summary' },
    { id: 'executive_dashboard', label: 'Executive Dashboard' },
    { id: 'executive_report', label: 'Executive Report' },
    { id: 'powerbi_data', label: 'PowerBI Data' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full h-[56px] bg-white border-b border-[var(--color-border)] shadow-xs no-print">
        <div className="max-w-[1400px] mx-auto px-10 h-full flex items-center justify-between gap-4">
          {/* Brand Identity */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center font-heading font-bold text-base shadow-xs shrink-0">
              E
            </div>
            <div>
              <div className="font-heading font-bold text-sm text-[var(--color-primary)] tracking-tight leading-snug">
                Employee Performance &amp; Annual Work Planning Excel Toolkit
              </div>
              <div className="text-[10px] font-medium text-[var(--color-muted)] tracking-wider uppercase mt-0.5">
                Excel Formula Engine &amp; Analytics
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none h-full py-0">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative h-full px-3 text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[var(--color-primary)] font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[var(--color-accent)] rounded-t-sm" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* System Actions & Auto-Save Indicator */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
              <Save className="w-3 h-3 text-emerald-600 animate-pulse" />
              <span>Last saved: {lastSaved || 'Just now'}</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsCsvModalOpen(true)}
                title="Bulk CSV Import"
                className="p-1.5 text-slate-600 hover:text-[var(--color-accent)] hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium border border-slate-200"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                <span className="hidden xl:inline">Bulk CSV</span>
              </button>

              <button
                onClick={() => setIsBackupModalOpen(true)}
                title="Backup & Governance"
                className="p-1.5 text-slate-600 hover:text-[var(--color-primary)] hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium border border-slate-200"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Backup</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <CsvImportModal isOpen={isCsvModalOpen} onClose={() => setIsCsvModalOpen(false)} />
      <BackupModal isOpen={isBackupModalOpen} onClose={() => setIsBackupModalOpen(false)} />
    </>
  );
};
