import React, { useState } from 'react';
import { useWorkbook } from '../../context/WorkbookContext';
import { DataBar } from '../DataBar';
import { Employee, Task } from '../../types';
import { CheckSquare, Plus, Search, Trash2, Edit2, Check, AlertCircle } from 'lucide-react';

export const TaskMasterTab: React.FC = () => {
  const { tasks, employees, addTask, updateTask, deleteTask } = useWorkbook();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmp, setSelectedEmp] = useState<string>('ALL');
  const [isAdding, setIsAdding] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const [newTask, setNewTask] = useState<Task>({
    task_id: `TSK-2026-0${tasks.length + 1}`,
    emp_id: employees[0]?.emp_id || 'EMP-001',
    task_name: '',
    task_weight: 0.25,
    plan_start_date: new Date().toISOString().split('T')[0],
    plan_due_date: '2026-10-31',
    actual_finish_date: '',
    progress_pct: 0,
  });

  // Map employee lookups
  const empMap = new Map<string, Employee>(employees.map((e) => [e.emp_id, e]));

  const filteredTasks = tasks.filter((t) => {
    const emp = empMap.get(t.emp_id);
    const empName = emp ? emp.emp_name : '';
    const matchesSearch =
      t.task_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.task_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEmp = selectedEmp === 'ALL' || t.emp_id === selectedEmp;
    return matchesSearch && matchesEmp;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.task_id || !newTask.task_name) return;
    addTask(newTask);
    setIsAdding(false);
    setNewTask({
      task_id: `TSK-2026-0${tasks.length + 2}`,
      emp_id: employees[0]?.emp_id || 'EMP-001',
      task_name: '',
      task_weight: 0.25,
      plan_start_date: new Date().toISOString().split('T')[0],
      plan_due_date: '2026-10-31',
      actual_finish_date: '',
      progress_pct: 0,
    });
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-[var(--color-accent)]" />
            <h2 className="font-heading font-bold text-xl text-[var(--color-primary)] tracking-display">
              Task_Master (Annual Strategic Work Plans)
            </h2>
          </div>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Main task directory for annual target plans. Emp_Name &amp; Department are automatically looked up via <code>XLOOKUP</code>.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-3.5 py-2 text-xs font-medium text-white bg-[var(--color-accent)] hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Annual Task</span>
        </button>
      </div>

      {/* Add Task Drawer */}
      {isAdding && (
        <form
          onSubmit={handleCreateTask}
          className="bg-white p-5 rounded-xl shadow-md border border-slate-200 space-y-4 animate-fade-up"
        >
          <h3 className="font-heading font-semibold text-sm text-[var(--color-primary)]">
            Create Annual Work Plan Task
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Task ID
              </label>
              <input
                type="text"
                required
                value={newTask.task_id}
                onChange={(e) => setNewTask({ ...newTask, task_id: e.target.value })}
                className="w-full px-3 py-1.5 bg-[var(--color-input-bg)] border border-slate-300 rounded-md text-xs font-mono focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Assignee Employee
              </label>
              <select
                value={newTask.emp_id}
                onChange={(e) => setNewTask({ ...newTask, emp_id: e.target.value })}
                className="w-full px-3 py-1.5 bg-[var(--color-input-bg)] border border-slate-300 rounded-md text-xs font-mono focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
              >
                {employees.map((e) => (
                  <option key={e.emp_id} value={e.emp_id}>
                    {e.emp_id} - {e.emp_name} ({e.department})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Task Title / Objective Name
              </label>
              <input
                type="text"
                required
                value={newTask.task_name}
                onChange={(e) => setNewTask({ ...newTask, task_name: e.target.value })}
                placeholder="e.g. Microservices Refactoring v2"
                className="w-full px-3 py-1.5 bg-[var(--color-input-bg)] border border-slate-300 rounded-md text-xs font-medium focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Task Effort Weight %
              </label>
              <input
                type="number"
                step="5"
                min="0"
                max="100"
                value={Math.round(newTask.task_weight * 100)}
                onChange={(e) =>
                  setNewTask({ ...newTask, task_weight: (parseFloat(e.target.value) || 0) / 100 })
                }
                className="w-full px-3 py-1.5 bg-[var(--color-input-bg)] border border-slate-300 rounded-md text-xs font-mono focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Plan Start Date
              </label>
              <input
                type="date"
                value={newTask.plan_start_date}
                onChange={(e) => setNewTask({ ...newTask, plan_start_date: e.target.value })}
                className="w-full px-3 py-1.5 bg-[var(--color-input-bg)] border border-slate-300 rounded-md text-xs font-mono focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Plan Due Date
              </label>
              <input
                type="date"
                value={newTask.plan_due_date}
                onChange={(e) => setNewTask({ ...newTask, plan_due_date: e.target.value })}
                className="w-full px-3 py-1.5 bg-[var(--color-input-bg)] border border-slate-300 rounded-md text-xs font-mono focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Initial Progress %
              </label>
              <input
                type="number"
                step="10"
                min="0"
                max="100"
                value={Math.round(newTask.progress_pct * 100)}
                onChange={(e) =>
                  setNewTask({ ...newTask, progress_pct: (parseFloat(e.target.value) || 0) / 100 })
                }
                className="w-full px-3 py-1.5 bg-[var(--color-input-bg)] border border-slate-300 rounded-md text-xs font-mono focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
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
              Save Work Plan Task
            </button>
          </div>
        </form>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[var(--color-border)] shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search task title, ID or assignee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-slate-500 font-medium">Filter Assignee:</span>
          <select
            value={selectedEmp}
            onChange={(e) => setSelectedEmp(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          >
            <option value="ALL">All Staff</option>
            {employees.map((e) => (
              <option key={e.emp_id} value={e.emp_id}>
                {e.emp_name} ({e.emp_id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-xs border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--table-header-bg)] border-b-2 border-[var(--table-header-sep)] text-[var(--color-primary)] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Task ID</th>
                <th className="py-3 px-4">Emp ID</th>
                <th className="py-3 px-4 bg-blue-50/50">Emp Name (XLOOKUP)</th>
                <th className="py-3 px-4 bg-blue-50/50">Department (XLOOKUP)</th>
                <th className="py-3 px-4 min-w-[220px]">Task Name / Objectives</th>
                <th className="py-3 px-4 text-right">Weight %</th>
                <th className="py-3 px-4">Plan Start</th>
                <th className="py-3 px-4">Plan Due</th>
                <th className="py-3 px-4">Actual Finish</th>
                <th className="py-3 px-4 min-w-[140px]">Progress %</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)] text-xs">
              {filteredTasks.map((task) => {
                const emp = empMap.get(task.emp_id);
                const isEditing = editingTaskId === task.task_id;

                return (
                  <tr
                    key={task.task_id}
                    className="hover:bg-slate-50/80 transition-colors duration-150 group"
                  >
                    <td className="py-3 px-4 font-mono font-semibold text-[var(--color-primary)]">
                      {task.task_id}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-600">
                      {isEditing ? (
                        <select
                          value={task.emp_id}
                          onChange={(e) => updateTask(task.task_id, { emp_id: e.target.value })}
                          className="px-2 py-1 bg-[var(--color-input-bg)] border border-slate-300 rounded text-xs"
                        >
                          {employees.map((e) => (
                            <option key={e.emp_id} value={e.emp_id}>
                              {e.emp_id}
                            </option>
                          ))}
                        </select>
                      ) : (
                        task.emp_id
                      )}
                    </td>

                    {/* Formula Derived Columns */}
                    <td className="py-3 px-4 bg-blue-50/30 text-[var(--color-primary)] font-medium">
                      {emp ? emp.emp_name : 'Unknown'}
                    </td>
                    <td className="py-3 px-4 bg-blue-50/30 text-slate-600">
                      {emp ? emp.department : 'Unknown'}
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-900">
                      {isEditing ? (
                        <input
                          type="text"
                          value={task.task_name}
                          onChange={(e) => updateTask(task.task_id, { task_name: e.target.value })}
                          className="w-full px-2 py-1 bg-[var(--color-input-bg)] border border-slate-300 rounded text-xs"
                        />
                      ) : (
                        task.task_name
                      )}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-semibold text-[var(--color-accent)]">
                      {isEditing ? (
                        <input
                          type="number"
                          step="5"
                          min="0"
                          max="100"
                          value={Math.round(task.task_weight * 100)}
                          onChange={(e) =>
                            updateTask(task.task_id, {
                              task_weight: (parseFloat(e.target.value) || 0) / 100,
                            })
                          }
                          className="w-16 px-1 py-0.5 bg-[var(--color-input-bg)] border text-right rounded text-xs"
                        />
                      ) : (
                        `${Math.round(task.task_weight * 100)}%`
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-600">
                      {isEditing ? (
                        <input
                          type="date"
                          value={task.plan_start_date}
                          onChange={(e) =>
                            updateTask(task.task_id, { plan_start_date: e.target.value })
                          }
                          className="px-1 py-0.5 bg-[var(--color-input-bg)] border rounded text-xs"
                        />
                      ) : (
                        task.plan_start_date
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-600">
                      {isEditing ? (
                        <input
                          type="date"
                          value={task.plan_due_date}
                          onChange={(e) =>
                            updateTask(task.task_id, { plan_due_date: e.target.value })
                          }
                          className="px-1 py-0.5 bg-[var(--color-input-bg)] border rounded text-xs"
                        />
                      ) : (
                        task.plan_due_date
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-600">
                      {isEditing ? (
                        <input
                          type="date"
                          value={task.actual_finish_date || ''}
                          onChange={(e) =>
                            updateTask(task.task_id, { actual_finish_date: e.target.value })
                          }
                          className="px-1 py-0.5 bg-[var(--color-input-bg)] border rounded text-xs"
                        />
                      ) : (
                        task.actual_finish_date || '-'
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="5"
                            value={Math.round(task.progress_pct * 100)}
                            onChange={(e) =>
                              updateTask(task.task_id, {
                                progress_pct: (parseFloat(e.target.value) || 0) / 100,
                              })
                            }
                            className="w-16 px-1 py-0.5 bg-[var(--color-input-bg)] border rounded text-xs font-mono"
                          />
                          <span className="text-xs">%</span>
                        </div>
                      ) : (
                        <DataBar value={task.progress_pct} />
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {isEditing ? (
                          <button
                            onClick={() => setEditingTaskId(null)}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditingTaskId(task.task_id)}
                            className="p-1 text-slate-400 hover:text-[var(--color-accent)] hover:bg-slate-100 rounded"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteTask(task.task_id)}
                          className="p-1 text-slate-400 hover:text-[var(--color-negative)] hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
