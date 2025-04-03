import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { ChevronLeft, Loader } from 'lucide-react';
import { Bill } from '../interfaces/bill.interface';
import { Payment } from '../interfaces/payment.interface';
import { Button } from '@/modules/common/components/ui/button';
import FormInput from '@/modules/common/components/form-input';
import FormDatePicker from '@/modules/common/components/form-date-picker';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/ui/card';
import { paymentSchema } from '../interfaces/payment.validation-schema';
import paymentService from '@/lib/api/payments.api';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import billService from '@/lib/api/bills.api';

interface PaymentFormProps {
  isEditing?: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ isEditing = false }) => {
  const navigate = useNavigate();
  const { billId, paymentId } = useParams();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const today = new Date();

  useEffect(() => {
    const fetchBill = async () => {
      if (!billId) return null;
      var billData = await billService.getById(billId);
      setBill(billData);
      setLoading(false);
    };
    const fetchPayment = async () => {
      if (!paymentId) return null;
      var paymentData = await paymentService.getById(paymentId);
      setPayment(paymentData);
      setLoading(false);
    };
    fetchBill();
    if (isEditing) fetchPayment();
  }, [billId, paymentId]);

  if (loading || !bill) {
    return <Loader />;
  }

  const initialValues: Omit<Payment, 'id'> = {
    billId: bill.id!,
    amount: 0,
    paidAt: today,
    createdAt: today,
  };

  const formInitialValues = isEditing && payment ? payment : initialValues;

  const handleSubmit = async (values: Omit<Payment, 'id'>) => {
    try {
      if (isEditing && payment && payment.id) {
        await paymentService.update(payment.id, values);
        toast.success('Pago actualizado con éxito');
      } else {
        const paidAtDate = new Date(values.paidAt);
        const paidAtDateDay = paidAtDate.getDate();
        paidAtDate.setDate(paidAtDateDay + 1);
        await paymentService.create({
          ...values,
          paidAt: paidAtDate,
        } as Payment);
        toast.success('Pago registrado con éxito');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
    } finally {
      navigate(-1);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4 mb-2">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <CardTitle>Agregar Pago</CardTitle>
        </div>
        <CardDescription>
          Registra un nuevo pago para {bill.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={formInitialValues}
          validationSchema={paymentSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div className="space-y-4">
                <FormInput label="Monto" name="amount" type="number" />
                {/* <FormInput label="Fecha de pago" name="paidAt" type="date" /> */}
                <FormDatePicker label="Fecha de pago" name="paidAt" />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" type="button" onClick={() => {}}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    'Guardar Pago'
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

export default PaymentForm;
