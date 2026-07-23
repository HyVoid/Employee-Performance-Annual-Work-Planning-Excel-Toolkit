import React, { useState } from 'react';
import { useWorkbook } from '../../context/WorkbookContext';
import { calculateWeightedTaskScore } from '../../utils/excelEngine';
import { Evaluation, Task } from '../../types';
import { Award, Plus, Search, Trash2, MessageSquare, AlertCircle } from 'lucide-react';

export const EvaluationTab: React.FC = () => {
  const { evaluations, tasks, lookupSettings, addEvaluation, updateEvaluation, deleteEvaluation } = useWorkbook();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const taskMap = new Map<string, Task>(tasks.map((t) => [t.task_id, t]));

  const [newEval, setNewEval] = useState<Evaluation>({
    eval_id: `EV-2026-0${evaluations.length + 1}`,
    task_id: tasks[0]?.task_id || 'TSK-2026-001',
    score_quality: 90,
    score_timeliness: 90,
    score_accuracy: 90,
    score_completion: 90,
    score_doc: 90,
    evaluator_id: 'EMP-000',
    comments: 'Good overall task execution.',
  });

  const filteredEvaluations = evaluations.filter((ev) => {
    const task = taskMap.get(ev.task_id);
    const taskName = task ? task.task_name : '';
    return (
      ev.eval_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.task_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.comments.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleScoreChange = (
    evalId: string,
    field: keyof Omit<Evaluation, 'eval_id' | 'task_id' | 'evaluator_id' | 'comments'>,
    valStr: string
  ) => {
    const num = Math.min(100, Math.max(0, parseFloat(valStr) || 0));
    updateEvaluation(evalId, { [field]: num });
  };

  const handleCreateEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    addEvaluation(newEval);
    setIsAdding(false);
    setNewEval({
      eval_id: `EV-2026-0${evaluations.length + 2}`,
      task_id: tasks[0]?.task_id || 'TSK-2026-001',
      score_quality: 90,
      score_timeliness: 90,
      score_accuracy: 90,
      score_completion: 90,
      score_doc: 90,
      evaluator_id: 'EMP-000',
      comments: '',
    });
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[var(--color-accent)]" />
            <h2 className="font-heading font-bold text-xl text-[var(--color-primary)] tracking-display">
              Evaluation (Task Performance 5-Dimensional Scoring)
            </h2>
          </div>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Scores across 5 quality dimensions. Weighted Task Score is automatically computed via Formula using weights from <code>Lookup_Settings</code>.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-3.5 py-2 text-xs font-medium text-white bg-[var(--color-accent)] hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Evaluation Score</span>
        </button>
      </div>

      {/* Add Drawer */}
      {isAdding && (
        <form
          onSubmit={handleCreateEvaluation}
          className="bg-white p-5 rounded-xl shadow-md border border-slate-200 space-y-4 animate-fade-up"
        >
          <h3 className="font-heading font-semibold text-sm text-[var(--color-primary)]">
            Create Task Evaluation Entry
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Eval ID
              </label>
              <input
                type="text"
                required
                value={newEval.eval_id}
                onChange={(e) => setNewEval({ ...newEval, eval_id: e.target.value })}
                className="w-full px-3 py-1.5 bg-[var(--color-input-bg)] border border-slate-300 rounded-md text-xs font-mono focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Target Task ID
              </label>
              <select
                value={newEval.task_id}
                onChange={(e) => setNewEval({ ...newEval, task_id: e.target.value })}
                className="w-full px-3 py-1.5 bg-[var(--color-input-bg)] border border-slate-300 rounded-md text-xs font-mono focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
              >
                {tasks.map((t) => (
                  <option key={t.task_id} value={t.task_id}>
                    {t.task_id} - {t.task_name.slice(0, 30)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Evaluator ID
              </label>
              <input
                type="text"
                value={newEval.evaluator_id}
                onChange={(e) => setNewEval({ ...newEval, evaluator_id: e.target.value })}
                className="w-full px-3 py-1.5 bg-[var(--color-input-bg)] border border-slate-300 rounded-md text-xs font-mono focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Qualitative Review Comments
              </label>
              <input
                type="text"
                value={newEval.comments}
                onChange={(e) => setNewEval({ ...newEval, comments: e.target.value })}
                placeholder="Manager assessment notes..."
                className="w-full px-3 py-1.5 bg-[var(--color-input-bg)] border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase">
                Quality ({Math.round(lookupSettings.dim_quality_weight * 100)}%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={newEval.score_quality}
                onChange={(e) =>
                  setNewEval({ ...newEval, score_quality: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-2 py-1 bg-[var(--color-input-bg)] border border-slate-300 rounded text-xs font-mono font-semibold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase">
                Timeliness ({Math.round(lookupSettings.dim_timeliness_weight * 100)}%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={newEval.score_timeliness}
                onChange={(e) =>
                  setNewEval({ ...newEval, score_timeliness: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-2 py-1 bg-[var(--color-input-bg)] border border-slate-300 rounded text-xs font-mono font-semibold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase">
                Accuracy ({Math.round(lookupSettings.dim_accuracy_weight * 100)}%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={newEval.score_accuracy}
                onChange={(e) =>
                  setNewEval({ ...newEval, score_accuracy: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-2 py-1 bg-[var(--color-input-bg)] border border-slate-300 rounded text-xs font-mono font-semibold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase">
                Completion ({Math.round(lookupSettings.dim_completion_weight * 100)}%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={newEval.score_completion}
                onChange={(e) =>
                  setNewEval({ ...newEval, score_completion: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-2 py-1 bg-[var(--color-input-bg)] border border-slate-300 rounded text-xs font-mono font-semibold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase">
                Doc ({Math.round(lookupSettings.dim_doc_weight * 100)}%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={newEval.score_doc}
                onChange={(e) =>
                  setNewEval({ ...newEval, score_doc: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-2 py-1 bg-[var(--color-input-bg)] border border-slate-300 rounded text-xs font-mono font-semibold"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-medium text-white bg-[var(--color-accent)] rounded-md hover:bg-blue-700"
            >
              Save Evaluation Record
            </button>
          </div>
        </form>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-[var(--color-border)] shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search task ID or assessment text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-xs border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--table-header-bg)] border-b-2 border-[var(--table-header-sep)] text-[var(--color-primary)] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Eval ID</th>
                <th className="py-3 px-4">Task ID</th>
                <th className="py-3 px-4 min-w-[180px]">Task Objective Name</th>
                <th className="py-3 px-3 text-center">Quality ({Math.round(lookupSettings.dim_quality_weight * 100)}%)</th>
                <th className="py-3 px-3 text-center">Timeliness ({Math.round(lookupSettings.dim_timeliness_weight * 100)}%)</th>
                <th className="py-3 px-3 text-center">Accuracy ({Math.round(lookupSettings.dim_accuracy_weight * 100)}%)</th>
                <th className="py-3 px-3 text-center">Completion ({Math.round(lookupSettings.dim_completion_weight * 100)}%)</th>
                <th className="py-3 px-3 text-center">Doc ({Math.round(lookupSettings.dim_doc_weight * 100)}%)</th>
                <th className="py-3 px-4 text-right bg-blue-50/60 text-[var(--color-accent)]">
                  Weighted Score (Formula)
                </th>
                <th className="py-3 px-4 min-w-[200px]">Comments</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)] text-xs">
              {filteredEvaluations.map((ev) => {
                const task = taskMap.get(ev.task_id);
                const weightedScore = calculateWeightedTaskScore(ev, lookupSettings);

                return (
                  <tr
                    key={ev.eval_id}
                    className="hover:bg-slate-50/80 transition-colors duration-150 group"
                  >
                    <td className="py-3 px-4 font-mono font-semibold text-[var(--color-primary)]">
                      {ev.eval_id}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-600">{ev.task_id}</td>

                    <td className="py-3 px-4 font-medium text-slate-900">
                      {task ? task.task_name : 'Unknown Task'}
                    </td>

                    {/* Quality */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={ev.score_quality}
                        onChange={(e) => handleScoreChange(ev.eval_id, 'score_quality', e.target.value)}
                        className="w-14 px-1.5 py-1 text-center bg-[var(--color-input-bg)] border border-slate-300 rounded font-mono font-semibold text-xs focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
                      />
                    </td>

                    {/* Timeliness */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={ev.score_timeliness}
                        onChange={(e) =>
                          handleScoreChange(ev.eval_id, 'score_timeliness', e.target.value)
                        }
                        className="w-14 px-1.5 py-1 text-center bg-[var(--color-input-bg)] border border-slate-300 rounded font-mono font-semibold text-xs focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
                      />
                    </td>

                    {/* Accuracy */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={ev.score_accuracy}
                        onChange={(e) => handleScoreChange(ev.eval_id, 'score_accuracy', e.target.value)}
                        className="w-14 px-1.5 py-1 text-center bg-[var(--color-input-bg)] border border-slate-300 rounded font-mono font-semibold text-xs focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
                      />
                    </td>

                    {/* Completion */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={ev.score_completion}
                        onChange={(e) =>
                          handleScoreChange(ev.eval_id, 'score_completion', e.target.value)
                        }
                        className="w-14 px-1.5 py-1 text-center bg-[var(--color-input-bg)] border border-slate-300 rounded font-mono font-semibold text-xs focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
                      />
                    </td>

                    {/* Doc */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={ev.score_doc}
                        onChange={(e) => handleScoreChange(ev.eval_id, 'score_doc', e.target.value)}
                        className="w-14 px-1.5 py-1 text-center bg-[var(--color-input-bg)] border border-slate-300 rounded font-mono font-semibold text-xs focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
                      />
                    </td>

                    {/* Weighted Task Score (Formula Result) */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-sm bg-blue-50/40 text-[var(--color-accent)]">
                      {weightedScore.toFixed(2)}
                    </td>

                    <td className="py-3 px-4 text-slate-600 italic">
                      <input
                        type="text"
                        value={ev.comments}
                        onChange={(e) => updateEvaluation(ev.eval_id, { comments: e.target.value })}
                        className="w-full px-2 py-1 bg-transparent hover:bg-[var(--color-input-bg)] focus:bg-[var(--color-input-bg)] border border-transparent focus:border-slate-300 rounded text-xs transition-colors"
                      />
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteEvaluation(ev.eval_id)}
                        className="p-1 text-slate-400 hover:text-[var(--color-negative)] hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
