import React from 'react';
import { WorkbookProvider, useWorkbook } from './context/WorkbookContext';
import { HeaderNav } from './components/HeaderNav';
import { HomeTab } from './components/tabs/HomeTab';
import { LookupSettingsTab } from './components/tabs/LookupSettingsTab';
import { EmployeeMasterTab } from './components/tabs/EmployeeMasterTab';
import { TaskMasterTab } from './components/tabs/TaskMasterTab';
import { EvaluationTab } from './components/tabs/EvaluationTab';
import { CalculationEngineTab } from './components/tabs/CalculationEngineTab';
import { EmployeeSummaryTab } from './components/tabs/EmployeeSummaryTab';
import { ExecutiveDashboardTab } from './components/tabs/ExecutiveDashboardTab';
import { ExecutiveReportTab } from './components/tabs/ExecutiveReportTab';
import { PowerBIDataTab } from './components/tabs/PowerBIDataTab';

const TabRenderer: React.FC = () => {
  const { activeTab } = useWorkbook();

  switch (activeTab) {
    case 'home':
      return <HomeTab />;
    case 'lookup_settings':
      return <LookupSettingsTab />;
    case 'employee_master':
      return <EmployeeMasterTab />;
    case 'task_master':
      return <TaskMasterTab />;
    case 'evaluation':
      return <EvaluationTab />;
    case 'calculation_engine':
      return <CalculationEngineTab />;
    case 'employee_summary':
      return <EmployeeSummaryTab />;
    case 'executive_dashboard':
      return <ExecutiveDashboardTab />;
    case 'executive_report':
      return <ExecutiveReportTab />;
    case 'powerbi_data':
      return <PowerBIDataTab />;
    default:
      return <HomeTab />;
  }
};

export default function App() {
  return (
    <WorkbookProvider>
      <div className="min-h-screen bg-[var(--color-bg)] flex flex-col font-sans">
        <HeaderNav />
        <main className="flex-1 max-w-[1400px] w-full mx-auto px-10 py-8">
          <TabRenderer />
        </main>
      </div>
    </WorkbookProvider>
  );
}
