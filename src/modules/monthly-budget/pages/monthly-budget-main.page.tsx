import { Button } from '@/modules/common/components/ui/button';
import { formatCurrency } from '@/modules/common/utils/format-currency';
import {
  BanknoteIcon,
  CalendarIcon,
  Edit2Icon,
  Plus,
  Settings,
} from 'lucide-react';
import { Expense } from '../interfaces/expense.interface';
import { useEffect, useState } from 'react';
import expensesService from '@/lib/api/expenses.api';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/modules/common/components/loader';
import { Link, useNavigate } from 'react-router-dom';
import categories_list from '@/modules/categories/categories.service';

const MonthlyBudgetMainPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const categories = categories_list.getAllCategories();

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!user) return;
      try {
        const expensesResponse = await expensesService.getAllByUserId(user.id);
        setExpenses(expensesResponse);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [user]);

  const handleEditExpense = (expenseId: string) => {
    navigate(`/budget/expense/${expenseId}`);
  };

  // Function to get category and subcategory info
  const getCategoryInfo = (subcategoryId: number) => {
    for (const category of categories) {
      const subcategory = category.subcategories.find(
        (sub) => sub.id === subcategoryId
      );
      if (subcategory) {
        return {
          categoryName: category.name,
          categoryColor: category.color,
          subcategoryName: subcategory.name,
        };
      }
    }
    return {
      categoryName: 'Sin categoría',
      categoryColor: '#CCCCCC',
      subcategoryName: 'No definido',
    };
  };

  let expensesTotal = 0;
  expenses.forEach((e) => (expensesTotal += e.amount));

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
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
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
          expenses.map((expense) => {
            const categoryInfo = getCategoryInfo(expense.subcategoryId);

            return (
              <div
                key={expense.id}
                className="bg-card border p-4 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{expense.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: categoryInfo.categoryColor }}
                      ></div>
                      <p className="text-xs text-muted-foreground">
                        {categoryInfo.categoryName} ·{' '}
                        {categoryInfo.subcategoryName}
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
                    <p className="font-semibold">
                      {formatCurrency(expense.amount)}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-primary/10"
                      onClick={() => handleEditExpense(expense.id!)}
                    >
                      <Edit2Icon className="h-4 w-4 text-primary" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MonthlyBudgetMainPage;
