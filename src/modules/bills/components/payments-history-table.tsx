import React, { useState } from 'react';
import { Button } from '@/modules/common/components/ui/button';
import { ChevronLeft, ChevronRight, Edit } from 'lucide-react';
import { formatDate } from '../../common/utils/format-date';
import { Payment } from '../interfaces/payment.interface';
import { useTheme } from '@/modules/common/components/theme-controller';
import { formatCurrency } from '@/modules/common/utils/format-currency';
import { useNavigate } from 'react-router-dom';

interface PaymentsHistoryTableProps {
  payments: Payment[];
}

const PaymentsHistoryTable: React.FC<PaymentsHistoryTableProps> = ({
  payments,
}) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const currentPageSize = 5;
  // const [currentPageSize, setCurrentPageSize] = useState(5);

  const headerClass = theme === 'dark' ? 'bg-background/20' : 'bg-muted/50';
  const rowHoverClass =
    theme === 'dark' ? 'hover:bg-muted/10' : 'hover:bg-muted/30';

  const totalPages = Math.ceil(payments.length / currentPageSize);
  const startIndex = (currentPage - 1) * currentPageSize;
  const endIndex = startIndex + currentPageSize;
  const currentPayments = payments.slice(startIndex, endIndex);

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (!payments || payments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No hay historial disponible para este gasto.
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
            <th className="px-4 py-3 text-right font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {currentPayments.map((payment) => (
            <tr key={payment.id} className={`border-b ${rowHoverClass}`}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <span className="font-medium">
                    {formatCurrency(payment.amount)}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3">
                {formatDate(payment.paidAt, { month: 'numeric' })}
              </td>
              {/* <td className="px-4 py-3">{formatDate(payment.createdAt)}</td> */}
              <td className="px-4 py-3 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`payments/${payment.id}`)}
                >
                  <Edit />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsHistoryTable;
