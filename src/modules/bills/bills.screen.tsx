import { useEffect, useState } from 'react';
import { Bill } from '@/modules/bills/interfaces/bill.interface';
import billService from '@/lib/api/bills.api';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/ui/card';
import {
  CalendarIcon,
  CreditCardIcon,
  LightbulbIcon,
  RefreshCwIcon,
} from 'lucide-react';
import { Badge } from '@/modules/common/components/ui/badge';

// enum BillStatusStatus {
//   paid,
//   due,
//   NA,
// }
type BillCardStatus = 'paid' | 'due' | 'NA';

interface BillCardData {
  bill: Bill;
  status: BillCardStatus;
}

function BillsScreen() {
  const navigate = useNavigate();
  // const [bills, setBills] = useState<BillWithIncludes[]>([]);
  const [bills, setBills] = useState<BillCardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBills = async (): Promise<void> => {
      try {
        setLoading(true);
        if (user?.uid) {
          const userBills = await billService.getAllByUserId(user.id, {
            payments: true,
          });

          const billsData: BillCardData[] = [];
          const actualMonth = new Date().getMonth() + 1;
          const actualYear = new Date().getFullYear();

          for (const bill of userBills) {
            if (!bill.payments || bill.payments.length === 0) {
              console.log('no payments!');
              billsData.push({
                bill,
                status: 'NA',
              });
              continue;
            }
            const billLastPayment = bill.payments[bill.payments.length - 1];

            const billLastPaymentDate = billLastPayment.paidAt;
            console.log('billLastPaymentDate =>', billLastPaymentDate);

            const actualCutoffDate = new Date(
              actualYear,
              actualMonth - 1,
              bill.cutoffDate
            );
            console.log('actualCutoffDate =>', actualCutoffDate);

            if (actualCutoffDate > billLastPaymentDate) {
              console.log('actualCutoffDate > billLastPayment.paidAt!!!');
              billsData.push({
                bill,
                status: 'due',
              });
            } else {
              billsData.push({
                bill,
                status: 'paid',
              });
            }
          }

          setBills(billsData);
        }
      } catch (err) {
        console.error('Error fetching bills:', err);
        setError('Failed to load bills. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [user]);

  const formatDate = (date: Date | undefined): string => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getBillTypeIcon = (type: string, color: string) => {
    switch (type) {
      case 'credit_card':
        return <CreditCardIcon color={color} className="h-5 w-5" />;
      case 'service':
        return <LightbulbIcon color={color} className="h-5 w-5" />;
      case 'subscription':
        return <RefreshCwIcon color={color} className="h-5 w-5" />;
      default:
        return <CreditCardIcon color={color} className="h-5 w-5" />;
    }
  };

  const getBillTypeLabel = (type: string): string => {
    switch (type) {
      case 'credit_card':
        return 'Tarjeta de crédito';
      case 'service':
        return 'Servicio';
      case 'subscription':
        return 'Subscripción';
      default:
        return 'Desconocido';
    }
  };

  const getStatusBadge = (status: BillCardStatus) => {
    switch (status) {
      case 'NA':
        return <Badge className="bg-gray-100 text-gray-800">NA</Badge>;
      case 'due':
        return <Badge className="bg-red-100 text-red-800">Pendiente</Badge>;
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Pagado</Badge>;

      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mis Facturas</h1>
        <Button onClick={() => navigate('create')}>Nueva Factura</Button>
      </div>

      {bills.length === 0 ? (
        <div className="text-center py-16 rounded-lg shadow-sm">
          <p className="text-gray-500 mb-6">No tienes facturas registradas.</p>
          <Button onClick={() => navigate('create')}>
            Crear Nueva Factura
          </Button>
        </div>
      ) : (
        <div>
          <p className="text-gray-500 mb-6">Total: {bills.length} facturas</p>

          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {bills.map(({ bill, status }: BillCardData) => (
              <Card
                key={bill.id}
                style={{ borderColor: bill.color }}
                className="overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer shadow-sm"
                // onClick={() => navigate(`/bills/${bill.id}`)}
              >
                <CardHeader className="pb-2 pt-4 px-6 flex flex-row justify-between items-center">
                  <div className="flex items-center gap-2">
                    {getBillTypeIcon(bill.type, bill.color)}
                    <CardTitle className="text-lg font-medium">
                      {bill.name}
                    </CardTitle>
                  </div>
                  {getStatusBadge(status)}
                </CardHeader>
                <CardContent className="px-6 py-2">
                  <div className="text-sm text-gray-500 mt-1">
                    {getBillTypeLabel(bill.type)}
                  </div>
                </CardContent>
                <CardFooter className="px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center text-xs text-gray-500">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {formatDate(bill.createdAt)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Actualizado: {formatDate(bill.updatedAt)}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default BillsScreen;
