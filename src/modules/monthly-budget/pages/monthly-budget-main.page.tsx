import { useEffect, useState } from 'react';
import { Button } from '@/modules/common/components/ui/button';
import { formatCurrency } from '@/modules/common/utils/format-currency';
import {
  BanknoteIcon,
  CalendarIcon,
  Plus,
  Settings,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '@/modules/common/components/loader';
import ExpenseScrollviewItem from '../components/expense-scrollview-item';
import BudgetSubcategoryStatusbar from '../components/budget-subcategory-statusbar';
import { useExpensesStore } from '../stores/useExpensesStore';

const MonthlyBudgetMainPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAllSubcategories, setShowAllSubcategories] = useState(false);

  // Get data and functions from the Zustand store
  const {
    expenses,
    expensesTotal,
    subcategoryBudgets,
    criticalSubcategories,
    normalSubcategories,
    loading,
    error,
    fetchUserData,
  } = useExpensesStore();

  useEffect(() => {
    if (user) {
      fetchUserData(user.id);
    }
  }, [user, fetchUserData]);

  // Determine which subcategories to display
  const displayedSubcategories = showAllSubcategories
    ? subcategoryBudgets
    : criticalSubcategories;

  // Check if we have normal subcategories to show
  const hasMoreSubcategories = normalSubcategories.length > 0;

  if (loading) return <Loader centered />;

  if (error) {
    return (
      <div className="max-w-xl mx-auto p-4 bg-red-50 rounded-xl border border-red-200 text-red-800">
        <h3 className="font-medium mb-2">Error loading data</h3>
        <p>{error}</p>
        <Button
          onClick={() => user && fetchUserData(user.id)}
          className="mt-4 bg-red-600 hover:bg-red-700"
        >
          Retry
        </Button>
      </div>
    );
  }

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
      {subcategoryBudgets.length > 0 && (
        <div className="bg-card border rounded-xl p-4 mb-6 shadow-sm">
          <h3 className="font-medium text-lg mb-4">Estado del Presupuesto</h3>
          <div className="space-y-4">
            {/* Show subcategories based on current state */}
            {displayedSubcategories.map((subcategory) => (
              <BudgetSubcategoryStatusbar
                key={subcategory.id}
                subcategory={subcategory}
              />
            ))}

            {/* Show "See more" button if there are normal subcategories */}
            {hasMoreSubcategories && (
              <Button
                variant="outline"
                className="w-full mt-2 flex items-center justify-center"
                onClick={() => setShowAllSubcategories(!showAllSubcategories)}
              >
                {showAllSubcategories ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Ver menos
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Ver más categorías ({normalSubcategories.length})
                  </>
                )}
              </Button>
            )}
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
