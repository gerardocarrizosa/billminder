import { useEffect, useState } from 'react';
import { Button } from '@/modules/common/components/ui/button';
import { formatCurrency } from '@/modules/common/utils/format-currency';
import {
  BanknoteIcon,
  CalendarIcon,
  Plus,
  Settings,
  AlertTriangle,
} from 'lucide-react';
import { Expense } from '../interfaces/expense.interface';
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '@/modules/common/components/loader';
import expensesService from '@/lib/api/expenses.api';
import ExpenseScrollviewItem, {
  BudgetStatus,
} from '../components/expense-scrollview-item';
import { Lifestyle } from '../interfaces/lifestyle.interface';
import lifestyleService from '@/lib/api/lifestyle.api';
import categoriesService from '@/modules/categories/categories.service';

const MonthlyBudgetMainPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [lifestyle, setLifestyle] = useState<Lifestyle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [subcategoryNames, setSubcategoryNames] = useState<
    Record<number, string>
  >({});
  const categories = categoriesService.getAllCategories();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        // Fetch expenses and lifestyle data in parallel
        const [expensesResponse, lifestyleResponse] = await Promise.all([
          expensesService.getAllByUserId(user.id),
          lifestyleService.getByUserId(user.id),
        ]);

        setExpenses(expensesResponse);
        setLifestyle(lifestyleResponse);

        // Get all subcategory names for display purposes
        const subcategoryMapping: Record<number, string> = {};

        // Flatten all subcategories into a mapping object
        categories.forEach((category) => {
          category.subcategories.forEach((subcategory) => {
            subcategoryMapping[subcategory.id] = subcategory.name;
          });
        });

        setSubcategoryNames(subcategoryMapping);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Calculate expenses total
  let expensesTotal = 0;
  expenses.forEach((e) => (expensesTotal += e.amount));

  // Calculate expenses by subcategory
  const expensesBySubcategory: Record<number, number> = {};
  expenses.forEach((expense) => {
    const { subcategoryId, amount } = expense;
    expensesBySubcategory[subcategoryId] =
      (expensesBySubcategory[subcategoryId] || 0) + amount;
  });

  // Get budget status for each subcategory
  const getBudgetStatus = (
    subcategoryId: number
  ): { status: BudgetStatus; percentage: number } => {
    if (!lifestyle) return { status: 'no-budget', percentage: 0 };

    const budgetEntry = lifestyle.budgets.find(
      (b) => b.subcategoryId === subcategoryId
    );
    if (!budgetEntry) return { status: 'no-budget', percentage: 0 };

    const spent = expensesBySubcategory[subcategoryId] || 0;
    const budgetLimit = budgetEntry.budget;
    const percentage = (spent / budgetLimit) * 100;

    if (percentage >= 100) {
      return { status: 'exceeded', percentage };
    } else if (percentage >= 70) {
      return { status: 'warning', percentage };
    } else {
      return { status: 'normal', percentage };
    }
  };

  // Group expenses by subcategory
  const subcategories = Array.from(
    new Set(expenses.map((expense) => expense.subcategoryId))
  );

  if (loading) return <Loader centered />;

  return (
    <div className="max-w-xl mx-auto">
      {/* Summary Card */}
      <div className="bg-card border rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1">
            <CalendarIcon size={16} />
            <p className="font-medium flex items-center ">
              Resumen{' '}
              {new Date().toLocaleString('es', {
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <Link
            to="/budget/lifestyle"
            className="flex items-center justify-center gap-2 "
          >
            <Button className="rounded-xl" variant="outline">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total de gastos</p>
            <p className="text-2xl font-bold">
              {formatCurrency(expensesTotal)}
            </p>
            <span className="text-sm text-muted-foreground">
              {expenses.length} gastos
            </span>
          </div>
        </div>
      </div>

      {/* Budget Status Section */}
      {lifestyle && subcategories.length > 0 && (
        <div className="bg-card border rounded-xl p-4 mb-6 shadow-sm">
          <h3 className="font-medium text-lg mb-4">Estado del Presupuesto</h3>
          <div className="space-y-4">
            {subcategories.map((subcategoryId) => {
              const budgetStatus = getBudgetStatus(subcategoryId);
              if (budgetStatus.status === 'no-budget') return null;

              const subcategoryExpenses = expenses.filter(
                (e) => e.subcategoryId === subcategoryId
              );
              const totalAmount = subcategoryExpenses.reduce(
                (sum, e) => sum + e.amount,
                0
              );
              const budgetEntry = lifestyle.budgets.find(
                (b) => b.subcategoryId === subcategoryId
              );
              const budgetLimit = budgetEntry?.budget || 0;

              // Skip if there's no budget set for this subcategory
              if (budgetLimit === 0) return null;

              return (
                <div
                  key={subcategoryId}
                  className="border-b pb-3 last:border-b-0"
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {subcategoryNames[subcategoryId] ||
                          `Subcategoría ${subcategoryId}`}
                      </span>
                      {budgetStatus.status === 'warning' && (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                      {budgetStatus.status === 'exceeded' && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="text-sm">
                      <span
                        className={
                          budgetStatus.status === 'exceeded'
                            ? 'text-red-500 font-bold'
                            : budgetStatus.status === 'warning'
                            ? 'text-yellow-500 font-bold'
                            : ''
                        }
                      >
                        {formatCurrency(totalAmount)}
                      </span>
                      <span className="text-muted-foreground">
                        {' '}
                        / {formatCurrency(budgetLimit)}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-muted rounded-full h-2 mt-1">
                    <div
                      className={`h-2 rounded-full ${
                        budgetStatus.status === 'exceeded'
                          ? 'bg-red-500'
                          : budgetStatus.status === 'warning'
                          ? 'bg-yellow-500'
                          : 'bg-primary'
                      }`}
                      style={{
                        width: `${Math.min(budgetStatus.percentage, 100)}%`,
                      }}
                    ></div>
                  </div>

                  {/* Warning or Error message */}
                  {budgetStatus.status === 'warning' && (
                    <p className="text-xs text-yellow-500 mt-1">
                      ¡Atención! Has usado el{' '}
                      {budgetStatus.percentage.toFixed(0)}% del presupuesto
                    </p>
                  )}
                  {budgetStatus.status === 'exceeded' && (
                    <p className="text-xs text-red-500 mt-1">
                      ¡Alerta! Has excedido el presupuesto por{' '}
                      {formatCurrency(totalAmount - budgetLimit)}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Expenses List */}
      <div className="mb-2">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg">Gastos recientes</h3>
          <Link to="/budget/add-expense">
            <Button className="rounded-full h-10 w-10 p-0">
              <Plus className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Scrollable list */}
      <div className="space-y-3 overflow-y-auto pr-1">
        {expenses.length === 0 ? (
          <div className="flex flex-col gap-4 justify-center items-center bg-card p-6 rounded-xl border text-center">
            <div className="bg-primary/10 p-3 rounded-full">
              <BanknoteIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium mb-1">Sin gastos registrados</p>
              <p className="text-sm text-muted-foreground mb-4">
                Comienza a registrar tus gastos para visualizar tu presupuesto
              </p>
              <Button onClick={() => navigate('add-expense')}>
                Añadir primer gasto
              </Button>
            </div>
          </div>
        ) : (
          expenses.map((expense) => (
            <ExpenseScrollviewItem key={expense.id!} expense={expense} />
          ))
        )}
      </div>
    </div>
  );
};

export default MonthlyBudgetMainPage;
