import React from 'react';
import { formatCurrency } from '@/modules/common/utils/format-currency';
import { Expense } from '../interfaces/expense.interface';
import { Edit2Icon } from 'lucide-react';
import { Button } from '@/modules/common/components/ui/button';
import { Link } from 'react-router-dom';
import categoriesService from '@/modules/categories/categories.service';

export type BudgetStatus = 'normal' | 'warning' | 'exceeded' | 'no-budget';

interface ExpenseScrollviewItemProps {
  expense: Expense;
}

const ExpenseScrollviewItem: React.FC<ExpenseScrollviewItemProps> = ({
  expense,
}) => {
  const category = categoriesService.getCategory(expense.categoryId);
  const subcategory = categoriesService.getSubcategory(
    expense.categoryId,
    expense.subcategoryId
  );

  return (
    <div className="bg-card p-4 rounded-xl hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium">{expense.name}</p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: category?.color }}
            ></span>
            <p className="text-xs text-muted-foreground">
              {category?.name} · {subcategory?.name}
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(expense.createdAt).toLocaleDateString('es', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <p className="font-semibold">{formatCurrency(expense.amount)}</p>
          <Link to={`/budget/expense/${expense.id}`}>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-primary/10"
            >
              <Edit2Icon className="h-4 w-4 text-primary" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExpenseScrollviewItem;
