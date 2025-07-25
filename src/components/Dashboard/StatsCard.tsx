import React from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  total?: number;
  color: 'green' | 'yellow' | 'blue';
  icon: React.ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  total, 
  color, 
  icon 
}) => {
  const colorClasses = {
    green: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
  };

  return (
    <div className={`p-6 rounded-xl border ${colorClasses[color]} animate-slide-up`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-3xl font-bold">
            {value}
            {total && <span className="text-lg opacity-60">/{total}</span>}
          </p>
        </div>
        <div className="opacity-60">
          {icon}
        </div>
      </div>
    </div>
  );
};