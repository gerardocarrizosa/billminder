import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/modules/common/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import ExpenseForm from '../components/expense-form';
import { Button } from '@/modules/common/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import expensesService from '@/lib/api/expenses.api';
import { Expense } from '../interfaces/expense.interface';
import Loader from '@/modules/common/components/loader';

interface ExpenseFormPageProps {
  isEditing?: boolean;
}

const ExpenseFormPage: React.FC<ExpenseFormPageProps> = ({
  isEditing = false,
}) => {
  const navigate = useNavigate();
  const { expenseId } = useParams();
  const [expense, setExpense] = useState<Expense | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchExpense = async () => {
      if (!expenseId) {
        setLoading(false);
        return;
      }
      const expenseData = await expensesService.getById(expenseId);
      if (expenseData) setExpense(expenseData);
      setLoading(false);
    };
    fetchExpense();
  }, []);

  if (loading) return <Loader centered />;

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4 mb-2">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="icon"
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <CardTitle>
            {isEditing ? 'Editar gasto' : 'Agregar gasto del mes'}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ExpenseForm expense={expense} isEditing={isEditing} />
      </CardContent>
    </Card>
  );
};

export default ExpenseFormPage;
