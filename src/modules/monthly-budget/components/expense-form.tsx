import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/modules/common/components/ui/button';
import { Expense, expenseSchema } from '../interfaces/expense.interface';
import expensesService from '@/lib/api/expenses.api';
import FormInput from '@/modules/common/components/form-input';
import FormSelect from '@/modules/common/components/form-select';
import categories_list from '@/modules/categories/categories.service';

interface ExpenseFormProps {
  expense?: Expense;
  isEditing?: boolean;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  expense,
  isEditing = false,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const categories = categories_list.getAllCategories();

  if (!user) return null;

  const today = new Date();

  const initialValues: Omit<Expense, 'id'> = {
    userId: user.id,
    name: '',
    amount: 0,
    categoryId: -1,
    subcategoryId: -1,
    createdAt: today,
  };

  const formInitialValues = isEditing && expense ? expense : initialValues;

  const handleSubmit = async (values: Omit<Expense, 'id'>) => {
    try {
      if (isEditing && expense?.id) {
        await expensesService.update(expense.id, values);
      } else {
        await expensesService.create(values as Expense);
      }
      navigate('/budget');
    } catch (err) {
      console.error('Error saving expense:', err);
    }
  };

  return (
    <div className="mx-auto rounded-lg shadow-md">
      <Formik
        initialValues={formInitialValues}
        validationSchema={expenseSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting }) => (
          <Form className="space-y-6">
            <FormInput label="Concepto" name="name" />
            <FormInput label="Monto" name="amount" type="number" />
            <FormSelect
              label="Categoría"
              name="categoryId"
              optionBadge
              options={categories.map((c) => ({
                label: c.name,
                value: c.id.toString(),
                color: c.color,
              }))}
            />
            {categories.find((c) => c.id === Number(values.categoryId)) ? (
              <FormSelect
                label="Subcategoría"
                name="subcategoryId"
                options={categories
                  .find((c) => c.id === Number(values.categoryId))!
                  .subcategories.map((s) => ({
                    label: s.name,
                    value: s.id,
                  }))}
              />
            ) : null}
            <FormInput label="Fecha" name="createdAt" type="date" />
            <div className="flex space-x-4 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate('/budget')}
              >
                Cancelar
              </Button>
              <button type="button" onClick={() => console.log('vals', values)}>
                values
              </button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : isEditing ? (
                  'Guardar'
                ) : (
                  'Agregar'
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ExpenseForm;
