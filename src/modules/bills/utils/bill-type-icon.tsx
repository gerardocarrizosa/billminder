import { CreditCardIcon, LightbulbIcon, RefreshCwIcon } from 'lucide-react';

export const getBillTypeIcon = (type: string, color?: string) => {
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
