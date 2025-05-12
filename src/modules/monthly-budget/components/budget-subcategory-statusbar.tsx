import React from 'react';
import { BudgetStatus } from './expense-scrollview-item';
import { AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/modules/common/utils/format-currency';

export interface SubcategoryBudgetInfo {
  id: number;
  name: string;
  totalAmount: number;
  budgetLimit: number;
  percentage: number;
  status: BudgetStatus;
}

interface BudgetSubcategoryStatusbar {
  subcategory: SubcategoryBudgetInfo;
}

const BudgetSubcategoryStatusbar: React.FC<BudgetSubcategoryStatusbar> = ({
  subcategory,
}) => {
  const statusColor =
    subcategory.status === 'exceeded'
      ? 'text-red-500'
      : subcategory.status === 'warning'
      ? 'text-yellow-500'
      : undefined;

  return (
    <div key={subcategory.id} className="border-b pb-3 last:border-b-0">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{subcategory.name}</span>
          <AlertTriangle className={`h-4 w-4 ${statusColor}`} />
          <p className={`text-xs ${statusColor}`}>
            {subcategory.percentage.toFixed(0)}%
          </p>
        </div>
        <div className="text-sm">
          <span className={statusColor}>
            {formatCurrency(subcategory.totalAmount)}
          </span>
          <span className="text-muted-foreground">
            {' '}
            / {formatCurrency(subcategory.budgetLimit)}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <progress
        className={`progress ${
          subcategory.status === 'exceeded'
            ? 'progress-error'
            : subcategory.status === 'warning'
            ? 'progress-warning'
            : ''
        }`}
        value={Math.min(subcategory.percentage, 100)}
        max="100"
      ></progress>

      {/* Warning or Error message */}
      {subcategory.status === 'exceeded' && (
        <p className="text-xs text-red-500 mt-1">
          ¡Alerta! Has excedido el presupuesto por{' '}
          {formatCurrency(subcategory.totalAmount - subcategory.budgetLimit)}
        </p>
      )}
    </div>
  );
};

export default BudgetSubcategoryStatusbar;
