import React, { useState } from 'react';
import { useWorkbook } from '../../context/WorkbookContext';
import { Upload, FileSpreadsheet, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({ isOpen, onClose }) => {
  const { importCsvData } = useWorkbook();
  const [importType, setImportType] = useState<'employees' | 'tasks'>('tasks');
  const [csvText, setCsvText] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const sampleTasksCsv = `task_id,emp_id,task_name,task_weight,plan_start_date,plan_due_date,actual_finish_date,progress_pct
TSK-2026-101,EMP-001,Kubernetes Cluster Upgrade,0.30,2026-08-01,2026-10-30,,0.10
TSK-2026-102,EMP-002,GraphQL API Gateway Integration,0.40,2026-08-10,2026-11-15,,0.05`;

  const sampleEmployeesCsv = `emp_id,emp_name,department,position,manager_id,hire_date,status
EMP-009,Nathan Drake,Engineering,Staff Infrastructure Engineer,EMP-001,2024-01-15,Active
EMP-010,Chloe Frazer,Marketing,Director of Global PR,EMP-000,2024-03-01,Active`;

  const handleImport = () => {
    if (!csvText.trim()) {
      setStatusMessage({ type: 'error', text: 'Please paste or upload CSV content before importing.' });
      return;
    }
    const result = importCsvData(importType, csvText);
    if (result.success) {
      setStatusMessage({ type: 'success', text: result.message });
      setCsvText('');
    } else {
      setStatusMessage({ type: 'error', text: result.message });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        setCsvText(text || '');
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-fade-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[var(--color-accent)]" />
            <h3 className="font-heading font-semibold text-lg text-[var(--color-primary)]">
              Bulk CSV Data Import
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Select Destination Table
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer text-slate-800">
                <input
                  type="radio"
                  name="importType"
                  checked={importType === 'tasks'}
                  onChange={() => {
                    setImportType('tasks');
                    setStatusMessage(null);
                  }}
                  className="text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                />
                Task Master (Tasks List)
              </label>
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer text-slate-800">
                <input
                  type="radio"
                  name="importType"
                  checked={importType === 'employees'}
                  onChange={() => {
                    setImportType('employees');
                    setStatusMessage(null);
                  }}
                  className="text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                />
                Employee Master (Staff Directory)
              </label>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Paste CSV Text or Upload File
              </label>
              <button
                onClick={() =>
                  setCsvText(importType === 'tasks' ? sampleTasksCsv : sampleEmployeesCsv)
                }
                className="text-xs text-[var(--color-accent)] font-medium hover:underline"
              >
                Load Sample CSV Template
              </button>
            </div>
            <textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="Paste comma-separated CSV text here..."
              className="w-full h-40 p-3 bg-[var(--color-input-bg)] border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-slate-500" />
              <span>Choose CSV File</span>
              <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {statusMessage && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg text-xs font-medium ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-[var(--color-positive)] shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-[var(--color-negative)] shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            className="px-4 py-2 text-xs font-medium text-white bg-[var(--color-accent)] hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-2"
          >
            <Upload className="w-3.5 h-3.5" />
            Import CSV Now
          </button>
        </div>
      </div>
    </div>
  );
};
