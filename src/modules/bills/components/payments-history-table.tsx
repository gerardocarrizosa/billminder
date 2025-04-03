import React from 'react';
import { Button } from '@/modules/common/components/ui/button';
import { DollarSign } from 'lucide-react';
import { formatDate } from '../../common/utils/format-date';
import { Payment } from '../interfaces/payment.interface';
import { useTheme } from '@/modules/common/components/theme-controller';
import { formatCurrency } from '@/modules/common/utils/format-currency';

interface PaymentsHistoryTableProps {
  payments: Payment[];
}

const PaymentsHistoryTable: React.FC<PaymentsHistoryTableProps> = ({
  payments,
}) => {
  const { theme } = useTheme();

  const headerClass = theme === 'dark' ? 'bg-background/20' : 'bg-muted/50';
  const rowHoverClass =
    theme === 'dark' ? 'hover:bg-muted/10' : 'hover:bg-muted/30';

  if (!payments || payments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No hay historial disponible para esta factura.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => {}}>
          Agregar primer pago
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <table className="w-full border-collapse">
        <thead
          className={`${headerClass} text-xs uppercase text-muted-foreground`}
        >
          <tr>
            <th className="px-4 py-3 text-left font-medium">Cantidad</th>
            <th className="px-4 py-3 text-left font-medium">Fecha de pago</th>
            {/* <th className="px-4 py-3 text-left font-medium">
              Fecha de creación
            </th> */}
            {/* <th className="px-4 py-3 text-right font-medium">Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className={`border-b ${rowHoverClass}`}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-medium">
                    {formatCurrency(payment.amount)}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3">{formatDate(payment.paidAt)}</td>
              {/* <td className="px-4 py-3">{formatDate(payment.createdAt)}</td> */}
              {/* <td className="px-4 py-3 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewPayment && onViewPayment(payment.id!)}
                >
                  View
                </Button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentsHistoryTable;
