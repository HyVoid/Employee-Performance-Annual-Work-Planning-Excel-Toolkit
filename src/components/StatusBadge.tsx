import React from 'react';
import { RAGStatus, TaskStatus } from '../types';

interface StatusBadgeProps {
  status: RAGStatus | TaskStatus | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let bgClass = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  if (status === '🟢 Normal' || status === 'Normal' || status === 'Completed') {
    bgClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    dotColor = 'bg-[var(--color-positive)]';
  } else if (status === '🟡 Warning Critical' || status === 'Warning Critical') {
    bgClass = 'bg-amber-50 text-amber-900 border-amber-200';
    dotColor = 'bg-amber-500';
  } else if (status === '🔴 Delay Risk' || status === 'Delay Risk' || status === 'Overdue') {
    bgClass = 'bg-red-50 text-red-800 border-red-200';
    dotColor = 'bg-[var(--color-negative)]';
  } else if (status === 'In Progress') {
    bgClass = 'bg-blue-50 text-blue-900 border-blue-200';
    dotColor = 'bg-[var(--color-accent)]';
  } else if (status === 'Not Started') {
    bgClass = 'bg-gray-100 text-gray-600 border-gray-200';
    dotColor = 'bg-gray-400';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${bgClass} transition-transform duration-150 hover:scale-[1.04]`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{status}</span>
    </span>
  );
};
