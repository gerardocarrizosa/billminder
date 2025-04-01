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

function BillsScreen() {
  const navigate = useNavigate();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBills = async (): Promise<void> => {
      try {
        setLoading(true);
        if (user?.uid) {
          const userBills = await billService.getAllByUserId(user.id);
          setBills(userBills);
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

  const getBillTypeIcon = (type: string) => {
    switch (type) {
      case 'credit_card':
        return <CreditCardIcon className="h-5 w-5" />;
      case 'service':
        return <LightbulbIcon className="h-5 w-5" />;
      case 'subscription':
        return <RefreshCwIcon className="h-5 w-5" />;
      default:
        return <CreditCardIcon className="h-5 w-5" />;
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

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
          Activa
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
          Inactiva
        </Badge>
      );
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
            {bills.map((bill: Bill) => (
              <Card
                key={bill.id}
                className="overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer border-0 shadow-sm"
                onClick={() => navigate(`/bills/${bill.id}`)}
              >
                <CardHeader className="pb-2 pt-4 px-6 flex flex-row justify-between items-center">
                  <div className="flex items-center gap-2">
                    {getBillTypeIcon(bill.type)}
                    <CardTitle className="text-lg font-medium">
                      {bill.name}
                    </CardTitle>
                  </div>
                  {getStatusBadge(bill.status)}
                </CardHeader>
                <CardContent className="px-6 py-2">
                  <div className="text-sm text-gray-500 mt-1">
                    {getBillTypeLabel(bill.type)}
                  </div>
                </CardContent>
                <CardFooter className="px-6 py-4 bg-gray-50 flex justify-between items-center">
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
