import { useEffect, useState } from 'react';
import billService from '@/lib/api/bills.api';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '../../common/components/ui/button';
import { BillCardData, BillCardStatus } from '../interfaces/bill.interface';
import BillCard from '../components/bill-card';
import { createBillAnalyzer } from '../utils/bill-analyzer';
import Loader from '@/modules/common/components/loader';

function BillsScreen() {
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

          for (const bill of userBills) {
            const analyzer = createBillAnalyzer(bill);
            const isDue = analyzer.isBillDue();
            if (isDue === null) {
              billsData.push({
                bill,
                status: 'NA',
              });
              continue;
            }
            if (isDue) {
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

          const sortedBills = billsData.sort((a, b) => {
            const priorityOrder: Record<BillCardStatus, number> = {
              due: 0,
              paid: 1,
              NA: 2,
            };
            return priorityOrder[a.status] - priorityOrder[b.status];
          });

          setBills(sortedBills);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
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
        <h1 className="text-3xl font-bold">Mis gastos</h1>
        <Link to="create">
          <Button>Nuevo gasto</Button>
        </Link>
      </div>

      {bills.length === 0 ? (
        <div className="text-center py-16 rounded-lg shadow-sm">
          <p className="text-gray-500 mb-6">No tienes gastos registrados.</p>
          <Link to="create">
            <Button>Nuevo gasto</Button>
          </Link>
        </div>
      ) : (
        <div>
          <p className="text-gray-500 mb-6">Total: {bills.length} gastos</p>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {bills.map(({ bill, status }) => (
              <Link key={bill.id} to={bill.id!}>
                <BillCard key={bill.id} bill={bill} status={status} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default BillsScreen;
