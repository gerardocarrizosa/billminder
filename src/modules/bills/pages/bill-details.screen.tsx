import React, { useState, useEffect } from "react";
import { Button } from "@/modules/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/modules/common/components/ui/card";
import {
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  Edit,
  Plus,
} from "lucide-react";
import { formatDate } from "../../common/utils/format-date";
import { Link, useParams } from "react-router-dom";
import { BillWithIncludes } from "../interfaces/bill.interface";
import { getBillTypeIcon } from "../utils/bill-type-icon";
import { getBillTypeLabel } from "../utils/bill-type-label";
import billService from "@/lib/api/bills.api";
import PaymentsHistoryTable from "../components/payments-history-table";
import { createBillAnalyzer } from "../utils/bill-analyzer";
import { formatCurrency } from "../../common/utils/format-currency";
import Loader from "@/modules/common/components/loader";
import BillStatusBadge from "../utils/bill-status-badge";

const BillDetailsScreen: React.FC = () => {
  const { billId } = useParams();
  if (!billId) return;
  const [bill, setBill] = useState<BillWithIncludes | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBill = async (): Promise<void> => {
    setLoading(true);
    try {
      const billData = await billService.getById(billId, { payments: true });
      setBill(billData);
    } catch (error) {
      console.error(`Error fetching bill with ID ${billId}:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBill();
  }, [billId]);

  if (loading) {
    return <Loader centered />;
  }

  if (!bill) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Recordatorio no encontrado</CardTitle>
            <CardDescription>
              Parece que este recordatorio no existe 🤔.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => window.history.back()}>Regresar</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const analyzer = createBillAnalyzer(bill);

  const {
    totalPaid,
    averagePayment,
    nextPaymentDue,
    isPaymentDueSoon,
    isPaymentOverdue,
    // isBillDue,
    billStatus,
  } = analyzer.getAnalysis();

  return (
    <div className="container mx-auto">
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <Link to={"/bills"}>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div
              className="w-6 h-6 rounded-full flex-shrink-0"
              style={{ backgroundColor: bill.color }}
            ></div>
            <h1 className="text-2xl sm:text-3xl font-bold">{bill.name}</h1>
            {/* <Badge variant={bill.status === 'active' ? 'default' : 'secondary'}>
              {bill.status}
            </Badge> */}
          </div>
          <div className="flex gap-2">
            <Link to="payments/new" className="w-full">
              <Button className="w-full">
                <Plus />
                Agregar pago
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Bill Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {getBillTypeIcon(bill.type)}
                <span>Información general</span>
              </div>
              <div>
                <Button variant="ghost">
                  <Edit />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Tipo</dt>
                <div>{getBillTypeLabel(bill.type)}</div>
              </div>

              {bill.cutoffDate && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Fecha de corte
                  </dt>
                  <dd className="text-base">
                    Día {bill.cutoffDate} de cada mes
                  </dd>
                </div>
              )}

              {bill.paymentDeadline && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Fecha límite de pago
                  </dt>
                  <dd className="text-base">
                    Día {bill.paymentDeadline} de cada mes
                  </dd>
                </div>
              )}

              <div>
                <dt className="text-sm font-medium text-gray-500">Creado el</dt>
                <dd className="text-base">{formatDate(bill.createdAt)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Payment Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>Estatus de pagos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              {/* status based on the last payment */}
              <div className="flex justify-between mb-4">
                <h3 className="text-base font-medium mb-1">Próximo pago</h3>
                <BillStatusBadge status={billStatus} />
              </div>

              {/* payment deadline date */}
              {nextPaymentDue ? (
                <>
                  <div className="mb-4">
                    <h3 className="text-base font-medium mb-1">
                      Fecha limite de pago
                    </h3>
                    <div className="flex items-center gap-2">
                      {isPaymentOverdue ? (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      ) : isPaymentDueSoon ? (
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      <p
                        className={`text-lg font-semibold ${
                          isPaymentOverdue
                            ? "text-red-500"
                            : isPaymentDueSoon
                            ? "text-amber-500"
                            : "text-green-500"
                        }`}
                      >
                        {formatDate(nextPaymentDue)}
                      </p>
                    </div>
                    {isPaymentOverdue && (
                      <p className="text-red-500 text-sm mt-1">
                        ¡Pago vencido!
                      </p>
                    )}
                    {isPaymentDueSoon && !isPaymentOverdue && (
                      <p className="text-amber-500 text-sm mt-1">
                        ¡Pago próximo a vencer!
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Último pago
                      </dt>
                      <dd className="text-base">
                        {bill.payments && bill.payments.length > 0 ? (
                          <div className="flex items-center gap-1">
                            <span className="font-medium">
                              {formatCurrency(bill.payments[0].amount)}
                            </span>
                            <span className="text-gray-500">
                              el {formatDate(bill.payments[0].paidAt)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500">
                            No hay pagos registrados
                          </span>
                        )}
                      </dd>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">
                  Fecha límite de pago no configurada
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              <span>Resumen de pagos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Cantidad de pagos
                </dt>
                <dd className="text-base">{bill.payments?.length || 0}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Total pagado
                </dt>
                <dd className="text-xl font-semibold">
                  {formatCurrency(totalPaid)}
                </dd>
              </div>
              {bill.payments && bill.payments.length > 0 && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Promedio de pagos
                  </dt>
                  <dd className="text-base">
                    {formatCurrency(averagePayment)}
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de pagos</CardTitle>
          <CardDescription>Ve todos los pagos hechos</CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentsHistoryTable payments={bill.payments || []} />
        </CardContent>
      </Card>
    </div>
  );
};

export default BillDetailsScreen;
