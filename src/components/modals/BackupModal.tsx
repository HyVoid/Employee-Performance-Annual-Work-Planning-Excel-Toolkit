import React, { useRef, useState } from 'react';
import { useWorkbook } from '../../context/WorkbookContext';
import { Download, Upload, RefreshCw, X, CheckCircle2, AlertTriangle } from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({ isOpen, onClose }) => {
  const { exportBackupJson, importBackupJson, resetToDefaultData } = useWorkbook();
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const content = evt.target?.result as string;
        if (content) {
          const success = importBackupJson(content);
          if (success) {
            setImportStatus({ type: 'success', text: 'Backup restored successfully!' });
          } else {
            setImportStatus({ type: 'error', text: 'Invalid JSON file structure.' });
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    resetToDefaultData();
    setConfirmReset(false);
    setImportStatus({ type: 'success', text: 'Data reset to system default template.' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-fade-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-heading font-semibold text-lg text-[var(--color-primary)]">
            Backup & Data Governance
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Export Section */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider">
                Export System Backup
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Download full workbook JSON state including settings, tasks &amp; evaluations.
              </p>
            </div>
            <button
              onClick={exportBackupJson}
              className="px-3 py-2 text-xs font-medium text-white bg-[var(--color-primary)] hover:bg-slate-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              Export JSON
            </button>
          </div>

          {/* Import Section */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider">
                Restore Backup
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Restore workbook state from a previously saved JSON file.
              </p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 text-xs font-medium text-[var(--color-accent)] border border-[var(--color-accent)] hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Upload className="w-3.5 h-3.5" />
              Import JSON
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleJsonUpload}
              className="hidden"
            />
          </div>

          {/* Reset Section */}
          <div className="p-4 rounded-xl border border-red-200 bg-red-50/40 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-red-900 uppercase tracking-wider">
                Reset Workbook
              </h4>
              <p className="text-xs text-red-700/80 mt-0.5">
                Revert all worksheets to the original baseline mock data.
              </p>
            </div>
            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                className="px-3 py-2 text-xs font-medium text-red-700 border border-red-300 hover:bg-red-100/80 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Data
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Confirm Reset
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-2 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {importStatus && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg text-xs font-medium ${
                importStatus.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {importStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-[var(--color-positive)] shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-[var(--color-negative)] shrink-0" />
              )}
              <span>{importStatus.text}</span>
            </div>
          )}
        </div>

        <div className="flex justify-end px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
