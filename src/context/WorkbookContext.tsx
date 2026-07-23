import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  initialEmployees,
  initialEvaluations,
  initialLookupSettings,
  initialTasks,
} from '../data/initialData';
import {
  CalculatedTaskRow,
  DepartmentSummary,
  Employee,
  Evaluation,
  LookupSettings,
  TabId,
  Task,
} from '../types';
import {
  computeCalculatedTasks,
  computeDepartmentSummaries,
} from '../utils/excelEngine';

const STORAGE_KEY = 'PERFORMPLAN_EXCEL_SAAS_V1';

interface WorkbookContextType {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  lookupSettings: LookupSettings;
  updateLookupSettings: (settings: Partial<LookupSettings>) => void;
  employees: Employee[];
  addEmployee: (emp: Employee) => void;
  updateEmployee: (emp_id: string, fields: Partial<Employee>) => void;
  deleteEmployee: (emp_id: string) => void;
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (task_id: string, fields: Partial<Task>) => void;
  deleteTask: (task_id: string) => void;
  evaluations: Evaluation[];
  addEvaluation: (evalRecord: Evaluation) => void;
  updateEvaluation: (eval_id: string, fields: Partial<Evaluation>) => void;
  deleteEvaluation: (eval_id: string) => void;
  calculatedTasks: CalculatedTaskRow[];
  departmentSummaries: DepartmentSummary[];
  lastSaved: string;
  resetToDefaultData: () => void;
  exportBackupJson: () => void;
  importBackupJson: (jsonData: string) => boolean;
  importCsvData: (type: 'employees' | 'tasks', csvText: string) => { success: boolean; count: number; message: string };
  todayStr: string;
  setTodayStr: (date: string) => void;
}

const WorkbookContext = createContext<WorkbookContextType | undefined>(undefined);

export const WorkbookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [lookupSettings, setLookupSettings] = useState<LookupSettings>(initialLookupSettings);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [evaluations, setEvaluations] = useState<Evaluation[]>(initialEvaluations);
  const [todayStr, setTodayStr] = useState<string>('2026-07-22');
  const [lastSaved, setLastSaved] = useState<string>('');

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.lookupSettings) setLookupSettings(parsed.lookupSettings);
        if (parsed.employees) setEmployees(parsed.employees);
        if (parsed.tasks) setTasks(parsed.tasks);
        if (parsed.evaluations) setEvaluations(parsed.evaluations);
        if (parsed.todayStr) setTodayStr(parsed.todayStr);
        if (parsed.lastSaved) setLastSaved(parsed.lastSaved);
      } else {
        setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (e) {
      console.error('Failed to load workbook state from localStorage', e);
    }
  }, []);

  // Helper to persist state and update lastSaved timestamp
  const persistState = (
    newSettings = lookupSettings,
    newEmps = employees,
    newTasks = tasks,
    newEvals = evaluations,
    newToday = todayStr
  ) => {
    const timeFormatted = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setLastSaved(timeFormatted);
    try {
      const payload = {
        lookupSettings: newSettings,
        employees: newEmps,
        tasks: newTasks,
        evaluations: newEvals,
        todayStr: newToday,
        lastSaved: timeFormatted,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  };

  // Lookup Settings updates
  const updateLookupSettings = (fields: Partial<LookupSettings>) => {
    const updated = { ...lookupSettings, ...fields };
    setLookupSettings(updated);
    persistState(updated);
  };

  // Employee CRUD
  const addEmployee = (emp: Employee) => {
    const updated = [...employees, emp];
    setEmployees(updated);
    persistState(lookupSettings, updated);
  };

  const updateEmployee = (emp_id: string, fields: Partial<Employee>) => {
    const updated = employees.map((e) => (e.emp_id === emp_id ? { ...e, ...fields } : e));
    setEmployees(updated);
    persistState(lookupSettings, updated);
  };

  const deleteEmployee = (emp_id: string) => {
    const updated = employees.filter((e) => e.emp_id !== emp_id);
    setEmployees(updated);
    persistState(lookupSettings, updated);
  };

  // Task CRUD
  const addTask = (task: Task) => {
    const updated = [...tasks, task];
    setTasks(updated);
    persistState(lookupSettings, employees, updated);
  };

  const updateTask = (task_id: string, fields: Partial<Task>) => {
    const updated = tasks.map((t) => (t.task_id === task_id ? { ...t, ...fields } : t));
    setTasks(updated);
    persistState(lookupSettings, employees, updated);
  };

  const deleteTask = (task_id: string) => {
    const updatedTasks = tasks.filter((t) => t.task_id !== task_id);
    const updatedEvals = evaluations.filter((ev) => ev.task_id !== task_id);
    setTasks(updatedTasks);
    setEvaluations(updatedEvals);
    persistState(lookupSettings, employees, updatedTasks, updatedEvals);
  };

  // Evaluation CRUD
  const addEvaluation = (evalRecord: Evaluation) => {
    const updated = [...evaluations, evalRecord];
    setEvaluations(updated);
    persistState(lookupSettings, employees, tasks, updated);
  };

  const updateEvaluation = (eval_id: string, fields: Partial<Evaluation>) => {
    const updated = evaluations.map((ev) => (ev.eval_id === eval_id ? { ...ev, ...fields } : ev));
    setEvaluations(updated);
    persistState(lookupSettings, employees, tasks, updated);
  };

  const deleteEvaluation = (eval_id: string) => {
    const updated = evaluations.filter((ev) => ev.eval_id !== eval_id);
    setEvaluations(updated);
    persistState(lookupSettings, employees, tasks, updated);
  };

  // Reset to initial data
  const resetToDefaultData = () => {
    setLookupSettings(initialLookupSettings);
    setEmployees(initialEmployees);
    setTasks(initialTasks);
    setEvaluations(initialEvaluations);
    setTodayStr('2026-07-22');
    persistState(initialLookupSettings, initialEmployees, initialTasks, initialEvaluations, '2026-07-22');
  };

  // Backup JSON export
  const exportBackupJson = () => {
    const dataStr = JSON.stringify(
      {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        lookupSettings,
        employees,
        tasks,
        evaluations,
        todayStr,
      },
      null,
      2
    );
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PerformPlan_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Backup JSON import
  const importBackupJson = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.lookupSettings) setLookupSettings(parsed.lookupSettings);
      if (Array.isArray(parsed.employees)) setEmployees(parsed.employees);
      if (Array.isArray(parsed.tasks)) setTasks(parsed.tasks);
      if (Array.isArray(parsed.evaluations)) setEvaluations(parsed.evaluations);
      if (parsed.todayStr) setTodayStr(parsed.todayStr);

      persistState(
        parsed.lookupSettings || lookupSettings,
        parsed.employees || employees,
        parsed.tasks || tasks,
        parsed.evaluations || evaluations,
        parsed.todayStr || todayStr
      );
      return true;
    } catch (e) {
      console.error('Invalid backup JSON file', e);
      return false;
    }
  };

  // CSV Bulk Import parser
  const importCsvData = (type: 'employees' | 'tasks', csvText: string) => {
    try {
      const lines = csvText.split('\n').filter((l) => l.trim().length > 0);
      if (lines.length < 2) {
        return { success: false, count: 0, message: 'CSV file is empty or missing header row' };
      }

      let addedCount = 0;

      if (type === 'employees') {
        // Headers: emp_id, emp_name, department, position, manager_id, hire_date, status
        const newEmps: Employee[] = [];
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(',').map((p) => p.trim().replace(/^"|"$/g, ''));
          if (parts.length >= 2 && parts[0]) {
            newEmps.push({
              emp_id: parts[0],
              emp_name: parts[1] || 'New Employee',
              department: parts[2] || 'General',
              position: parts[3] || 'Staff',
              manager_id: parts[4] || 'EMP-000',
              hire_date: parts[5] || new Date().toISOString().split('T')[0],
              status: (parts[6] as any) || 'Active',
            });
            addedCount++;
          }
        }
        if (addedCount > 0) {
          const merged = [...employees];
          newEmps.forEach((ne) => {
            const idx = merged.findIndex((e) => e.emp_id === ne.emp_id);
            if (idx >= 0) merged[idx] = ne;
            else merged.push(ne);
          });
          setEmployees(merged);
          persistState(lookupSettings, merged);
        }
      } else if (type === 'tasks') {
        // Headers: task_id, emp_id, task_name, task_weight, plan_start_date, plan_due_date, actual_finish_date, progress_pct
        const newTasks: Task[] = [];
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(',').map((p) => p.trim().replace(/^"|"$/g, ''));
          if (parts.length >= 3 && parts[0]) {
            newTasks.push({
              task_id: parts[0],
              emp_id: parts[1],
              task_name: parts[2] || 'Imported Task',
              task_weight: parseFloat(parts[3]) || 0.1,
              plan_start_date: parts[4] || '2026-01-01',
              plan_due_date: parts[5] || '2026-12-31',
              actual_finish_date: parts[6] || '',
              progress_pct: parseFloat(parts[7]) || 0,
            });
            addedCount++;
          }
        }
        if (addedCount > 0) {
          const merged = [...tasks];
          newTasks.forEach((nt) => {
            const idx = merged.findIndex((t) => t.task_id === nt.task_id);
            if (idx >= 0) merged[idx] = nt;
            else merged.push(nt);
          });
          setTasks(merged);
          persistState(lookupSettings, employees, merged);
        }
      }

      return {
        success: true,
        count: addedCount,
        message: `Successfully imported ${addedCount} records.`,
      };
    } catch (e) {
      return { success: false, count: 0, message: 'CSV processing failed: ' + String(e) };
    }
  };

  // Real-time calculation engine results
  const calculatedTasks = useMemo(() => {
    return computeCalculatedTasks(employees, tasks, evaluations, lookupSettings, todayStr);
  }, [employees, tasks, evaluations, lookupSettings, todayStr]);

  const departmentSummaries = useMemo(() => {
    return computeDepartmentSummaries(employees, calculatedTasks);
  }, [employees, calculatedTasks]);

  return (
    <WorkbookContext.Provider
      value={{
        activeTab,
        setActiveTab,
        lookupSettings,
        updateLookupSettings,
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        evaluations,
        addEvaluation,
        updateEvaluation,
        deleteEvaluation,
        calculatedTasks,
        departmentSummaries,
        lastSaved,
        resetToDefaultData,
        exportBackupJson,
        importBackupJson,
        importCsvData,
        todayStr,
        setTodayStr,
      }}
    >
      {children}
    </WorkbookContext.Provider>
  );
};

export const useWorkbook = () => {
  const context = useContext(WorkbookContext);
  if (!context) {
    throw new Error('useWorkbook must be used within a WorkbookProvider');
  }
  return context;
};
