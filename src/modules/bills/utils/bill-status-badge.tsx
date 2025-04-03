import { BillCardStatus } from '../interfaces/bill.interface';
import { Badge } from '@/modules/common/components/ui/badge';

export const getStatusBadge = (status: BillCardStatus) => {
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
