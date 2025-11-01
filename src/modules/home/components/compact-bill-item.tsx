import { Link } from 'react-router-dom';
import { Bill } from '@/modules/bills/interfaces/bill.interface';
import { BillCardStatus } from '@/modules/bills/interfaces/bill.interface';
import { getStatusBadge } from '@/modules/bills/utils/bill-status-badge';
import { getBillTypeIcon } from '@/modules/bills/utils/bill-type-icon';
import { CalendarClockIcon } from 'lucide-react';

interface CompactBillItemProps {
  bill: Bill;
  status: BillCardStatus;
}

const CompactBillItem: React.FC<CompactBillItemProps> = ({ bill, status }) => {
  return (
    <Link to={`/bills/${bill.id}`}>
      <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
        {/* Color indicator */}
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: bill.color }}
        />

        {/* Bill info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex-shrink-0">
              {getBillTypeIcon(bill.type, bill.color)}
            </div>
            <span className="font-medium text-sm truncate">{bill.name}</span>
          </div>
          {bill.paymentDeadline && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarClockIcon className="h-3 w-3" />
              <span>Día {bill.paymentDeadline}</span>
            </div>
          )}
        </div>

        {/* Status badge */}
        <div className="flex-shrink-0">{getStatusBadge(status)}</div>
      </div>
    </Link>
  );
};

export default CompactBillItem;

