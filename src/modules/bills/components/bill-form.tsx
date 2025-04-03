import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { Bill } from '@/modules/bills/interfaces/bill.interface';
import { useAuth } from '@/context/AuthContext';
import { billValidationSchema } from '../interfaces/bill.validation-schema';
import { Button } from '@/modules/common/components/ui/button';
import billService from '@/lib/api/bills.api';
import FormInput from '@/modules/common/components/form-input';
import FormSelect from '@/modules/common/components/form-select';

interface BillFormProps {
  bill?: Bill;
  isEditing?: boolean;
}

const BillForm: React.FC<BillFormProps> = ({ bill, isEditing = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return;

  const today = new Date();
  const initialValues: Omit<Bill, 'id'> = {
    name: '',
    type: 'credit_card',
    status: 'active',
    createdAt: today,
    updatedAt: today,
    userId: user.id,
    color: '',
  };

  const formInitialValues = isEditing && bill ? bill : initialValues;

  const handleSubmit = async (values: Omit<Bill, 'id'>) => {
    try {
      if (isEditing && bill && bill.id) {
        await billService.update(bill.id, values);
        navigate('/bills');
      } else {
        await billService.create(values as Bill);
        navigate('/bills');
      }
    } catch (err) {
      console.error('Error saving bill:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? 'Editar Factura' : 'Nueva Factura'}
      </h2>
      <Formik
        initialValues={formInitialValues}
        validationSchema={billValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form className="space-y-6">
            <div className="space-y-4">
              <FormInput label="Nombre" name="name" />
              <div className="flex gap-2">
                <FormSelect
                  className="flex-1"
                  label="Tipo"
                  name="type"
                  options={[
                    { label: 'Tarjeta de credito', value: 'credit_card' },
                    { label: 'Servicio', value: 'service' },
                    { label: 'Subscripción', value: 'subscription' },
                  ]}
                />
                <FormInput
                  label="Color"
                  name="color"
                  type="color"
                  className="w-24"
                />
              </div>
              {values.type === 'credit_card' && (
                <FormInput
                  label="Fecha de corte"
                  name="cutoffDate"
                  type="number"
                  className="flex-1"
                />
              )}
              <FormInput
                label="Fecha límite de pago"
                name="paymentDeadline"
                type="number"
                className="flex-1"
              />
              {isEditing && (
                <FormSelect
                  label="Status"
                  name="status"
                  options={[
                    { label: 'Activa', value: 'active' },
                    { label: 'Inactiva', value: 'inactive' },
                  ]}
                />
              )}
            </div>

            <div className="flex space-x-4 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate('/bills')}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  'Crear'
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BillForm;
