import { Button } from '@/modules/common/components/ui/button';
import { formatCurrency } from '@/modules/common/utils/format-currency';
import { BanknoteIcon, PersonStandingIcon, Plus } from 'lucide-react';

export const MonthlyBudgetLayout = () => {
  const today = new Date();
  const expenses = [
    { name: 'Mensualidad Subaru', amount: 8214.47, createdAt: today },
    { name: 'TDC BBVA', amount: 11697.5, createdAt: today },
    { name: 'Luz', amount: 600.0, createdAt: today },
    { name: 'TDC Liverpool ', amount: 497.59, createdAt: today },
    { name: 'Telcel', amount: 324.35, createdAt: today },
    { name: 'Spotify', amount: 129.0, createdAt: today },
    { name: 'Laureles septiembre ', amount: 1343.0, createdAt: today },
    { name: 'Chocopau', amount: 75.0, createdAt: today },
    { name: 'Abarrey', amount: 114.88, createdAt: today },
    { name: 'Papitas Guaymas Abarrey', amount: 213.0, createdAt: today },
    { name: 'Caffenio para Radio Sistemas', amount: 102.0, createdAt: today },
    { name: 'Piezas para Livespeed', amount: 667.0, createdAt: today },
    { name: 'Retiro en OXXO para Cenaduría', amount: 220.0, createdAt: today },
    { name: 'TDC Rappi', amount: 29.9, createdAt: today },
    { name: 'Asadero 33 Livespeed', amount: 600.0, createdAt: today },
    {
      name: 'Aliexpress hubs, cassette & chain',
      amount: 3613.21,
      createdAt: today,
    },
    { name: 'Roobeers papás', amount: 70.0, createdAt: today },
    { name: 'Caffenio primos', amount: 99.0, createdAt: today },
    { name: 'OXXO burgues Papovskys', amount: 76.0, createdAt: today },
  ];

  let expensesTotal = 0;
  expenses.forEach((e) => (expensesTotal += e.amount));

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Gastos del mes</h3>
        <Button>
          <Plus />
        </Button>
      </div>
      {/* Buttons */}
      <div className="mt-2 flex justify-between gap-2">
        <Button className="flex-1" variant="secondary">
          Mi estilo de vida
          <PersonStandingIcon />
        </Button>
        <Button className="flex-1" variant="secondary">
          Mis ingresos
          <BanknoteIcon />
        </Button>
      </div>

      <div className="flex justify-between items-center text-sm mt-4">
        <p>Cantidad: {expenses.length}</p>
        <p>Total: {formatCurrency(expensesTotal)}</p>
      </div>
      {/* Scrollable view */}
      <div className="mt-2 space-y-2">
        {expenses.map((e) => (
          <div className="bg-card border p-2 rounded-xl">
            <div className="flex justify-between items-center ">
              <p className="text-sm">{e.name}</p>
              <span className="font-semibold text-sm">{e.amount}</span>
            </div>
            <div>
              <p className="text-sm text-gray-400">
                {e.createdAt.toLocaleDateString()}{' '}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
