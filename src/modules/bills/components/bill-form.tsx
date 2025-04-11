import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { ChevronLeft } from 'lucide-react';
import { Bill } from '@/modules/bills/interfaces/bill.interface';
import { useAuth } from '@/context/AuthContext';
import { billValidationSchema } from '../interfaces/bill.validation-schema';
import { Button } from '@/modules/common/components/ui/button';
import billService from '@/lib/api/bills.api';
import FormInput from '@/modules/common/components/form-input';
import FormSelect from '@/modules/common/components/form-select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/ui/card';
import toast from 'react-hot-toast';
import Loader from '@/modules/common/components/loader';

interface BillFormProps {
  bill?: Bill;
  isEditing?: boolean;
}

const BillForm: React.FC<BillFormProps> = ({ bill, isEditing = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!user) {
      setLoading(true);
      return;
    }
    setLoading(false);
  }, [user]);

  if (loading || !user) {
    return <Loader />;
  }

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
        toast.success('Gasto actualizado con éxito');
      } else {
        await billService.create(values as Bill);
        toast.success('Gasto creado con éxito');
      }
      navigate('/bills');
    } catch (err) {
      console.error('Error saving bill:', err);
      toast.error('Error al guardar el gasto');
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4 mb-2">
          <Button
            onClick={() => navigate('/bills')}
            variant="outline"
            size="icon"
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <CardTitle>{isEditing ? 'Editar gasto' : 'Nuevo gasto'}</CardTitle>
        </div>
        <CardDescription>
          {isEditing
            ? 'Actualiza los datos de tu gasto'
            : 'Registra un nuevo gasto'}
        </CardDescription>
      </CardHeader>
      <CardContent>
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

              <div className="flex justify-end gap-3 pt-4">
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
                  ) : isEditing ? (
                    'Guardar cambios'
                  ) : (
                    'Crear gasto'
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};

export default BillForm;
