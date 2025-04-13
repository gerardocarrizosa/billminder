import { Button } from '@/modules/common/components/ui/button';
import { formatCurrency } from '@/modules/common/utils/format-currency';
import { BanknoteIcon, PersonStandingIcon, Plus } from 'lucide-react';
import { Expense } from '../interfaces/expense.interface';
import { useEffect, useState } from 'react';
import expensesService from '@/lib/api/expenses.api';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/modules/common/components/loader';
import { useNavigate } from 'react-router-dom';

const MonthlyBudgetMainPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!user) return;
      const expensesResponse = await expensesService.getAllByUserId(user.id);
      setExpenses(expensesResponse);
      setLoading(false);
    };

    fetchExpenses();
  }, []);

  let expensesTotal = 0;
  expenses.forEach((e) => (expensesTotal += e.amount));

  if (loading) return <Loader centered />;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Gastos del mes</h3>
        <Button onClick={() => navigate('add-expense')}>
          <Plus />
        </Button>
      </div>
      {/* Buttons */}
      <div className="mt-2 flex justify-between gap-2">
        <Button className="flex-1" variant="secondary">
          Mi estilo de vida
          <PersonStandingIcon />
        </Button>
        <Button className="flex-1" variant="secondary">
          Mis ingresos
          <BanknoteIcon />
        </Button>
      </div>

      <div className="flex justify-between items-center text-sm mt-4">
        <p>Cantidad: {expenses.length}</p>
        <p>Total: {formatCurrency(expensesTotal)}</p>
      </div>
      {/* Scrollable view */}
      <div className="mt-2 space-y-2">
        {expenses.length === 0 ? (
          <div className="flex flex-col gap-4 justify-center items-center bg-card p-4 rounded-lg ">
            <p className="text-sm text-muted-foreground">
              Aún no hay registros de gastos este mes
            </p>
            <Button onClick={() => navigate('add-expense')}>
              Añadir gasto
            </Button>
          </div>
        ) : (
          expenses.map((e) => (
            <div className="bg-card border p-3 rounded-xl">
              <div className="flex justify-between items-center">
                <p className="text-sm">{e.name}</p>
                <span className="font-semibold text-sm">
                  {formatCurrency(e.amount)}
                </span>
              </div>
              <div className="mt-1">
                <p className="text-sm text-gray-400">
                  {e.createdAt.toLocaleDateString()}{' '}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MonthlyBudgetMainPage;
