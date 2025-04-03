import { BillCardData } from '../interfaces/bill.interface';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/ui/card';
import { CalendarClockIcon, CalendarIcon } from 'lucide-react';
import { getBillTypeIcon } from '../utils/bill-type-icon';
import { getBillTypeLabel } from '../utils/bill-type-label';
import { getStatusBadge } from '../utils/bill-status-badge';

const BillCard: React.FC<BillCardData> = ({ bill, status }) => {
  return (
    <Card
      key={bill.id}
      style={{ borderColor: bill.color }}
      className="overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer shadow-sm"
    >
      <CardHeader className="flex flex-row justify-between items-center">
        <div className="flex items-center gap-2">
          {getBillTypeIcon(bill.type, bill.color)}
          <CardTitle className="text-lg font-medium">{bill.name}</CardTitle>
        </div>
        {getStatusBadge(status)}
      </CardHeader>
      <CardContent className="px-6 py-2">
        <div className="text-sm text-gray-500 mt-1">
          {getBillTypeLabel(bill.type)}
        </div>
      </CardContent>
      <CardFooter className="px-6 py-4 flex justify-between items-center">
        <div className="flex flex-wrap gap-2 w-full">
          <div className="flex flex-col gap-2 flex-1 min-w-32">
            {bill.type === 'credit_card' && (
              <div className="flex items-center text-sm text-gray-500">
                <CalendarIcon className="h-3 w-3 mr-1" />
                Fecha de corte los días {bill.cutoffDate}
              </div>
            )}
            <div className="flex items-center text-sm text-gray-500">
              <CalendarClockIcon className="h-3 w-3 mr-1" />
              Fecha límite de pago los días {bill.paymentDeadline}
            </div>
          </div>
          {/* <div>
            <Link to={bill.id + '/payments/new'}>
              <Button>
                Registrar pago
                <CircleDollarSign />
              </Button>
            </Link>
          </div> */}
        </div>
      </CardFooter>
    </Card>
  );
};

export default BillCard;
