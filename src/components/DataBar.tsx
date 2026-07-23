import React from 'react';

interface DataBarProps {
  value: number; // 0.0 to 1.0 or percentage
  max?: number;
  label?: string;
  showBar?: boolean;
}

export const DataBar: React.FC<DataBarProps> = ({
  value,
  max = 1.0,
  label,
  showBar = true,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="flex items-center gap-2 w-full justify-between">
      {showBar && (
        <div className="relative flex-1 h-3 rounded-full bg-[rgba(34,81,255,0.10)] overflow-hidden min-w-[60px]">
          <div
            className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
      <span className="font-mono text-xs font-semibold text-[var(--color-primary)] whitespace-nowrap">
        {label !== undefined ? label : `${Math.round(percentage)}%`}
      </span>
    </div>
  );
};
