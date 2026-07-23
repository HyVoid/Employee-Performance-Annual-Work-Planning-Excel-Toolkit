import React from 'react';
import { Lightbulb } from 'lucide-react';

interface InsightBlockProps {
  title?: string;
  children: React.ReactNode;
  icon?: boolean;
}

export const InsightBlock: React.FC<InsightBlockProps> = ({
  title = 'Executive Insight & System Note',
  children,
  icon = true,
}) => {
  return (
    <div className="border-l-[3px] border-[var(--color-accent)] bg-[rgba(5,28,44,0.04)] rounded-r-lg p-4 my-4 shadow-xs">
      <div className="flex items-center gap-2 mb-1">
        {icon && <Lightbulb className="w-4 h-4 text-[var(--color-accent)]" />}
        <h4 className="font-heading font-semibold text-sm text-[var(--color-primary)] tracking-wide">
          {title}
        </h4>
      </div>
      <div className="text-xs text-slate-700 leading-relaxed pl-0">{children}</div>
    </div>
  );
};
