import React from 'react';
import { useWorkbook } from '../../context/WorkbookContext';
import { InsightBlock } from '../InsightBlock';
import { Sliders, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

export const LookupSettingsTab: React.FC = () => {
  const { lookupSettings, updateLookupSettings, resetToDefaultData } = useWorkbook();

  const weightSum =
    lookupSettings.dim_quality_weight +
    lookupSettings.dim_timeliness_weight +
    lookupSettings.dim_accuracy_weight +
    lookupSettings.dim_completion_weight +
    lookupSettings.dim_doc_weight;

  const isWeightValid = Math.abs(weightSum - 1.0) < 0.0001;

  const handleWeightChange = (key: keyof typeof lookupSettings, val: string) => {
    const num = parseFloat(val);
    if (!isNaN(num)) {
      updateLookupSettings({ [key]: num / 100 });
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[var(--color-accent)]" />
            <h2 className="font-heading font-bold text-xl text-[var(--color-primary)] tracking-display">
              Lookup_Settings (Global Parameters &amp; Weight Config)
            </h2>
          </div>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Single Source of Truth for evaluation weights, RAG warning thresholds, and system currency settings.
          </p>
        </div>
        <button
          onClick={resetToDefaultData}
          className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          Restore Default Parameters
        </button>
      </div>

      <InsightBlock title="Zero Hardcoding Principle (Excel Formula Linkages)">
        All formulas across Evaluation, Calculation Engine, Employee Summary, and Executive Dashboard reference these cell values directly (e.g. <code>Lookup_Settings!$C$2</code>, <code>Lookup_Settings!$C$9</code>). Changing a threshold or weight here dynamically updates the entire workbook in real time.
      </InsightBlock>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dimension Weights Config */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-xs border border-[var(--color-border)] p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <h3 className="font-heading font-semibold text-base text-[var(--color-primary)]">
                Performance Evaluation Dimension Weights
              </h3>
              <p className="text-xs text-slate-500">
                Sum of all 5 dimension weights must equal 100%.
              </p>
            </div>
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                isWeightValid
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}
            >
              {isWeightValid ? (
                <CheckCircle2 className="w-4 h-4 text-[var(--color-positive)]" />
              ) : (
                <AlertCircle className="w-4 h-4 text-[var(--color-negative)]" />
              )}
              <span>
                Formula Check: {Math.round(weightSum * 100)}% {isWeightValid ? '(Valid)' : '(Invalid Sum)'}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Weight 1 */}
            <div className="flex items-center justify-between p-3 bg-slate-50/70 rounded-lg border border-slate-200/80">
              <div>
                <span className="font-mono text-xs text-slate-400 mr-2">C2</span>
                <span className="text-xs font-semibold text-[var(--color-primary)]">
                  Quality Score Weight (dim_quality_weight)
                </span>
                <p className="text-[11px] text-slate-500">Code quality, architecture excellence, bug-free output</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={Math.round(lookupSettings.dim_quality_weight * 100)}
                  onChange={(e) => handleWeightChange('dim_quality_weight', e.target.value)}
                  className="w-20 px-3 py-1.5 bg-[var(--color-input-bg)] border border-slate-300 rounded-md text-xs font-mono font-semibold text-right focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
                />
                <span className="text-xs font-mono font-medium">%</span>
              </div>
            </div>

            {/* Weight 2 */}
            <div className="flex items-center justify-between p-3 bg-slate-50/70 rounded-lg border border-slate-200/80">
              <div>
                <span className="font-mono text-xs text-slate-400 mr-2">C3</span>
                <span className="text-xs font-semibold text-[var(--color-primary)]">
                  Timeliness Score Weight (dim_timeliness_weight)
                </span>
                <p className="text-[11px] text-slate-500">Adherence to target deadlines and sprint milestones</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={Math.round(lookupSettings.dim_timeliness_weight * 100)}
                  onChange={(e) => handleWeightChange('dim_timeliness_weight', e.target.value)}
                  className="w-20 px-3 py-1.5 bg-[var(--color-input-bg)] border border-slate-300 rounded-md text-xs font-mono font-semibold text-right focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
                />
                <span className="text-xs font-mono font-medium">%</span>
              </div>
            </div>

            {/* Weight 3 */}
            <div className="flex items-center justify-between p-3 bg-slate-50/70 rounded-lg border border-slate-200/80">
              <div>
                <span className="font-mono text-xs text-slate-400 mr-2">C4</span>
                <span className="text-xs font-semibold text-[var(--color-primary)]">
                  Accuracy Score Weight (dim_accuracy_weight)
                </span>
                <p className="text-[11px] text-slate-500">Requirement precision, specification fidelity</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={Math.round(lookupSettings.dim_accuracy_weight * 100)}
                  onChange={(e) => handleWeightChange('dim_accuracy_weight', e.target.value)}
                  className="w-20 px-3 py-1.5 bg-[var(--color-input-bg)] border border-slate-300 rounded-md text-xs font-mono font-semibold text-right focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
                />
                <span className="text-xs font-mono font-medium">%</span>
              </div>
            </div>

            {/* Weight 4 */}
            <div className="flex items-center justify-between p-3 bg-slate-50/70 rounded-lg border border-slate-200/80">
              <div>
                <span className="font-mono text-xs text-slate-400 mr-2">C5</span>
                <span className="text-xs font-semibold text-[var(--color-primary)]">
                  Completion Score Weight (dim_completion_weight)
                </span>
                <p className="text-[11px] text-slate-500">Functional scope delivered vs. initial specs</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={Math.round(lookupSettings.dim_completion_weight * 100)}
                  onChange={(e) => handleWeightChange('dim_completion_weight', e.target.value)}
                  className="w-20 px-3 py-1.5 bg-[var(--color-input-bg)] border border-slate-300 rounded-md text-xs font-mono font-semibold text-right focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
                />
                <span className="text-xs font-mono font-medium">%</span>
              </div>
            </div>

            {/* Weight 5 */}
            <div className="flex items-center justify-between p-3 bg-slate-50/70 rounded-lg border border-slate-200/80">
              <div>
                <span className="font-mono text-xs text-slate-400 mr-2">C6</span>
                <span className="text-xs font-semibold text-[var(--color-primary)]">
                  Documentation Score Weight (dim_doc_weight)
                </span>
                <p className="text-[11px] text-slate-500">API docs, user guides, runbooks, comments</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={Math.round(lookupSettings.dim_doc_weight * 100)}
                  onChange={(e) => handleWeightChange('dim_doc_weight', e.target.value)}
                  className="w-20 px-3 py-1.5 bg-[var(--color-input-bg)] border border-slate-300 rounded-md text-xs font-mono font-semibold text-right focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
                />
                <span className="text-xs font-mono font-medium">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Thresholds & System Controls */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-xs border border-[var(--color-border)] p-6">
            <h3 className="font-heading font-semibold text-base text-[var(--color-primary)] mb-4">
              Operational Thresholds
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-xs text-slate-400">C9</span>
                  <label className="text-xs font-semibold text-[var(--color-primary)]">
                    RAG Yellow Warning Days
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={lookupSettings.rag_yellow_days}
                    onChange={(e) =>
                      updateLookupSettings({ rag_yellow_days: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-[var(--color-input-bg)] border border-slate-300 rounded-md text-xs font-mono font-semibold focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
                  />
                  <span className="text-xs text-slate-500 shrink-0">Days</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Tasks within {lookupSettings.rag_yellow_days} days of due date trigger 🟡 Warning status.
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-xs text-slate-400">C10</span>
                  <label className="text-xs font-semibold text-[var(--color-primary)]">
                    Default Currency Symbol
                  </label>
                </div>
                <input
                  type="text"
                  value={lookupSettings.currency_symbol}
                  onChange={(e) => updateLookupSettings({ currency_symbol: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--color-input-bg)] border border-slate-300 rounded-md text-xs font-mono font-semibold focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-xs text-slate-400">C11</span>
                  <label className="text-xs font-semibold text-[var(--color-primary)]">
                    Max Score Base
                  </label>
                </div>
                <input
                  type="number"
                  value={lookupSettings.max_score_base}
                  onChange={(e) =>
                    updateLookupSettings({ max_score_base: parseInt(e.target.value) || 100 })
                  }
                  className="w-full px-3 py-2 bg-[var(--color-input-bg)] border border-slate-300 rounded-md text-xs font-mono font-semibold focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
