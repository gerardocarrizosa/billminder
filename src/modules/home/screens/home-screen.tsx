import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/modules/common/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/modules/common/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import billService from '@/lib/api/bills.api';
import {
  BillCardData,
  BillCardStatus,
} from '@/modules/bills/interfaces/bill.interface';
import CompactBillItem from '@/modules/home/components/compact-bill-item';
import { createBillAnalyzer } from '@/modules/bills/utils/bill-analyzer';
import { useExpensesStore } from '@/modules/monthly-budget/stores/useExpensesStore';
import BudgetSubcategoryStatusbar from '@/modules/monthly-budget/components/budget-subcategory-statusbar';
import { formatCurrency } from '@/modules/common/utils/format-currency';
import Loader from '@/modules/common/components/loader';
import {
  DollarSign,
  Plus,
  CreditCard,
  Wallet,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

function HomeScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bills, setBills] = useState<BillCardData[]>([]);
  const [importantBills, setImportantBills] = useState<BillCardData[]>([]);
  const [recentlyPaidBills, setRecentlyPaidBills] = useState<BillCardData[]>(
    []
  );
  const [loadingBills, setLoadingBills] = useState(true);
  const [billsError, setBillsError] = useState<string | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  // Get budget data from store
  const {
    expensesTotal,
    criticalSubcategories,
    loading: budgetLoading,
    error: budgetError,
    fetchUserData,
  } = useExpensesStore();

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        // Fetch budget data
        fetchUserData(user.id);

        // Fetch bills
        try {
          setLoadingBills(true);
          const userBills = await billService.getAllByUserId(user.id, {
            payments: true,
          });

          const billsData: BillCardData[] = [];

          for (const bill of userBills) {
            const analyzer = createBillAnalyzer(bill);
            const isDue = analyzer.isBillDue();
            let status: BillCardStatus = 'NA';

            if (isDue === null) {
              status = 'NA';
            } else if (isDue === 'skipped') {
              status = 'skipped';
            } else if (isDue === 'overdue') {
              status = 'overdue';
            } else if (isDue) {
              status = 'due';
            } else {
              status = 'paid';
            }

            billsData.push({
              bill,
              status,
            });
          }

          // Sort bills by priority
          const sortedBills = billsData.sort((a, b) => {
            const priorityOrder: Record<BillCardStatus, number> = {
              overdue: 0,
              due: 1,
              paid: 2,
              skipped: 3,
              NA: 4,
            };
            return priorityOrder[a.status] - priorityOrder[b.status];
          });

          setBills(sortedBills);

          // Filter important bills (overdue, due, and skipped)
          const important = sortedBills.filter(
            (b) =>
              b.status === 'overdue' ||
              b.status === 'due' ||
              b.status === 'skipped'
          );
          setImportantBills(important);

          // Get recently paid bills (max 5)
          const paid = sortedBills
            .filter((b) => b.status === 'paid')
            .slice(0, 5);
          setRecentlyPaidBills(paid);
        } catch (err) {
          console.error('Error fetching bills:', err);
          setBillsError('No se pudieron cargar los recordatorios');
        } finally {
          setLoadingBills(false);
        }
      }
    };

    fetchData();
  }, [user, fetchUserData]);

  const handleAddPayment = (billId: string) => {
    setIsPaymentDialogOpen(false);
    navigate(`/bills/${billId}/payments/new`);
  };

  const allBills = bills.map((b) => b.bill);
  const availableBillsForPayment = allBills.filter(
    (bill) => !bill.status || bill.status === 'active'
  );

  if (loadingBills || budgetLoading) {
    return <Loader centered />;
  }

  return (
    <div className="container mx-auto p-2 max-w-7xl">
      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Dialog
          open={isPaymentDialogOpen}
          onOpenChange={setIsPaymentDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="w-full flex flex-row items-center justify-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Agregar Pago</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Seleccionar recordatorio</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {availableBillsForPayment.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No hay recordatorios activos disponibles
                </p>
              ) : (
                availableBillsForPayment.map((bill) => (
                  <Button
                    key={bill.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => bill.id && handleAddPayment(bill.id)}
                  >
                    <div
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: bill.color }}
                    />
                    {bill.name}
                  </Button>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Button
          className="w-full flex flex-row items-center justify-center gap-2"
          onClick={() => navigate('/budget/add-expense')}
        >
          <Wallet className="h-4 w-4" />
          <span>Agregar Gasto</span>
        </Button>
      </div>

      {/* Top Section: Reminders */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recordatorios</CardTitle>
            <Link to="/bills">
              <Button variant="ghost" size="sm">
                Ver todos
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {billsError ? (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded text-sm">
              {billsError}
            </div>
          ) : importantBills.length > 0 || recentlyPaidBills.length > 0 ? (
            <div className="space-y-4">
              {/* Pending Bills */}
              {importantBills.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Pendientes
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {importantBills.map(({ bill, status }) => (
                      <CompactBillItem
                        key={bill.id}
                        bill={bill}
                        status={status}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Recently Paid Bills */}
              {recentlyPaidBills.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Pagados Recientemente
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {recentlyPaidBills.map(({ bill, status }) => (
                      <CompactBillItem
                        key={bill.id}
                        bill={bill}
                        status={status}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center">
              <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                No tienes recordatorios registrados
              </p>
              <Link to="/bills/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear recordatorio
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom Section: Monthly Budget */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <CardTitle>Presupuesto del Mes</CardTitle>
              </div>
              <Link to="/budget">
                <Button variant="ghost" size="sm">
                  Ver detalle
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {budgetError ? (
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded text-sm">
                Error al cargar el presupuesto
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Total de gastos
                    </p>
                    <p className="text-3xl font-bold">
                      {formatCurrency(expensesTotal)}
                    </p>
                  </div>
                </div>

                {criticalSubcategories.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm text-muted-foreground">
                      Categorías que requieren atención
                    </h3>
                    {criticalSubcategories.slice(0, 5).map((subcategory) => (
                      <BudgetSubcategoryStatusbar
                        key={subcategory.id}
                        subcategory={subcategory}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <CheckCircle2 className="h-8 w-8 mx-auto text-green-500 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Todas las categorías están dentro del presupuesto
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Empty State for Budget */}
        {!budgetLoading &&
          !budgetError &&
          criticalSubcategories.length === 0 &&
          expensesTotal === 0 && (
            <Card>
              <CardContent className="py-8 text-center">
                <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  No hay gastos registrados este mes
                </p>
                <Button onClick={() => navigate('/budget/add-expense')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar primer gasto
                </Button>
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  );
}

export default HomeScreen;
