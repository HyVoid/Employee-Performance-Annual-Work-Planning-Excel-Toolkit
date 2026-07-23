import React, { useState } from 'react';
import { useWorkbook } from '../../context/WorkbookContext';
import { Employee } from '../../types';
import { Users, Plus, Search, Trash2, Edit2, Check, X } from 'lucide-react';

export const EmployeeMasterTab: React.FC = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useWorkbook();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [isAdding, setIsAdding] = useState(false);
  const [editingEmpId, setEditingEmpId] = useState<string | null>(null);

  // New Employee Form State
  const [newEmp, setNewEmp] = useState<Employee>({
    emp_id: `EMP-00${employees.length + 1}`,
    emp_name: '',
    department: 'Engineering',
    position: 'Software Engineer',
    manager_id: 'EMP-000',
    hire_date: new Date().toISOString().split('T')[0],
    status: 'Active',
  });

  const departments = Array.from(new Set(employees.map((e) => e.department))).filter(Boolean);

  // Compute Manager Name via XLOOKUP logic
  const getManagerName = (managerId: string) => {
    if (!managerId) return '-';
    if (managerId === 'EMP-000') return 'Executive Board';
    const mgr = employees.find((e) => e.emp_id === managerId);
    return mgr ? mgr.emp_name : 'Unknown Manager';
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.emp_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.emp_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmp.emp_id || !newEmp.emp_name) return;
    addEmployee(newEmp);
    setIsAdding(false);
    setNewEmp({
      emp_id: `EMP-00${employees.length + 2}`,
      emp_name: '',
      department: 'Engineering',
      position: 'Software Engineer',
      manager_id: 'EMP-000',
      hire_date: new Date().toISOString().split('T')[0],
      status: 'Active',
    });
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[var(--color-accent)]" />
            <h2 className="font-heading font-bold text-xl text-[var(--color-primary)] tracking-display">
              Employee_Master (Staff Directory)
            </h2>
          </div>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Master repository for all corporate employees. Manager_Name is automatically derived via <code>XLOOKUP</code> formula.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-3.5 py-2 text-xs font-medium text-white bg-[var(--color-accent)] hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Add Employee Form Drawer */}
      {isAdding && (
        <form
          onSubmit={handleCreateEmployee}
          className="bg-white p-5 rounded-xl shadow-md border border-slate-200 space-y-4 animate-fade-up"
        >
          <h3 className="font-heading font-semibold text-sm text-[var(--color-primary)]">
            Create New Employee Record
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Emp ID
              </label>
              <input
                type="text"
                required
                value={newEmp.emp_id}
                onChange={(e) => setNewEmp({ ...newEmp, emp_id: e.target.value })}
                className="w-full px-3 py-1.5 bg-[var(--color-input-bg)] border border-slate-300 rounded-md text-xs font-mono focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={newEmp.emp_name}
                onChange={(e) => setNewEmp({ ...newEmp, emp_name: e.target.value })}
                placeholder="e.g. Sarah Jenkins"
                className="w-full px-3 py-1.5 bg-[var(--color-input-bg)] border border-slate-300 rounded-md text-xs font-medium focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Department
              </label>
              <input
                type="text"
                required
                value={newEmp.department}
                onChange={(e) => setNewEmp({ ...newEmp, department: e.target.value })}
                className="w-full px-3 py-1.5 bg-[var(--color-input-bg)] border border-slate-300 rounded-md text-xs font-medium focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Position Title
              </label>
              <input
                type="text"
                required
                value={newEmp.position}
                onChange={(e) => setNewEmp({ ...newEmp, position: e.target.value })}
                className="w-full px-3 py-1.5 bg-[var(--color-input-bg)] border border-slate-300 rounded-md text-xs font-medium focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Manager ID
              </label>
              <select
                value={newEmp.manager_id}
                onChange={(e) => setNewEmp({ ...newEmp, manager_id: e.target.value })}
                className="w-full px-3 py-1.5 bg-[var(--color-input-bg)] border border-slate-300 rounded-md text-xs font-mono focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
              >
                {employees.map((m) => (
                  <option key={m.emp_id} value={m.emp_id}>
                    {m.emp_id} ({m.emp_name})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Hire Date
              </label>
              <input
                type="date"
                value={newEmp.hire_date}
                onChange={(e) => setNewEmp({ ...newEmp, hire_date: e.target.value })}
                className="w-full px-3 py-1.5 bg-[var(--color-input-bg)] border border-slate-300 rounded-md text-xs font-mono focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Status
              </label>
              <select
                value={newEmp.status}
                onChange={(e) => setNewEmp({ ...newEmp, status: e.target.value as any })}
                className="w-full px-3 py-1.5 bg-[var(--color-input-bg)] border border-slate-300 rounded-md text-xs font-medium focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
              >
                <option value="Active">Active</option>
                <option value="Resigned">Resigned</option>
                <option value="On Leave">On Leave</option>
              </select>
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
              Save Record
            </button>
          </div>
        </form>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[var(--color-border)] shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, ID or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-slate-500 font-medium">Department Filter:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
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
                <th className="py-3 px-4">Emp ID</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Position</th>
                <th className="py-3 px-4">Manager ID</th>
                <th className="py-3 px-4 bg-blue-50/50">Manager Name (XLOOKUP)</th>
                <th className="py-3 px-4">Hire Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)] text-xs">
              {filteredEmployees.map((emp) => {
                const isEditing = editingEmpId === emp.emp_id;
                const managerName = getManagerName(emp.manager_id);

                return (
                  <tr
                    key={emp.emp_id}
                    className="hover:bg-slate-50/80 transition-colors duration-150 group"
                  >
                    <td className="py-3 px-4 font-mono font-semibold text-[var(--color-primary)]">
                      {emp.emp_id}
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-900">
                      {isEditing ? (
                        <input
                          type="text"
                          value={emp.emp_name}
                          onChange={(e) => updateEmployee(emp.emp_id, { emp_name: e.target.value })}
                          className="px-2 py-1 bg-[var(--color-input-bg)] border border-slate-300 rounded text-xs"
                        />
                      ) : (
                        emp.emp_name
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-700">
                      {isEditing ? (
                        <input
                          type="text"
                          value={emp.department}
                          onChange={(e) =>
                            updateEmployee(emp.emp_id, { department: e.target.value })
                          }
                          className="px-2 py-1 bg-[var(--color-input-bg)] border border-slate-300 rounded text-xs"
                        />
                      ) : (
                        emp.department
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-700">
                      {isEditing ? (
                        <input
                          type="text"
                          value={emp.position}
                          onChange={(e) => updateEmployee(emp.emp_id, { position: e.target.value })}
                          className="px-2 py-1 bg-[var(--color-input-bg)] border border-slate-300 rounded text-xs"
                        />
                      ) : (
                        emp.position
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-600">
                      {isEditing ? (
                        <select
                          value={emp.manager_id}
                          onChange={(e) =>
                            updateEmployee(emp.emp_id, { manager_id: e.target.value })
                          }
                          className="px-2 py-1 bg-[var(--color-input-bg)] border border-slate-300 rounded text-xs"
                        >
                          {employees.map((m) => (
                            <option key={m.emp_id} value={m.emp_id}>
                              {m.emp_id}
                            </option>
                          ))}
                        </select>
                      ) : (
                        emp.manager_id
                      )}
                    </td>

                    {/* Formula Derived Column */}
                    <td className="py-3 px-4 bg-blue-50/30 text-[var(--color-accent)] font-medium">
                      {managerName}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-600">{emp.hire_date}</td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          emp.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {isEditing ? (
                          <button
                            onClick={() => setEditingEmpId(null)}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditingEmpId(emp.emp_id)}
                            className="p-1 text-slate-400 hover:text-[var(--color-accent)] hover:bg-slate-100 rounded"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteEmployee(emp.emp_id)}
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
