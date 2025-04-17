import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  SaveIcon,
  DollarSignIcon,
  InfoIcon,
} from 'lucide-react';
import { Button } from '@/modules/common/components/ui/button';
import { Input } from '@/modules/common/components/ui/input';
import { formatCurrency } from '@/modules/common/utils/format-currency';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/modules/common/components/ui/accordion';
import Loader from '@/modules/common/components/loader';
import {
  Lifestyle,
  LifestyleBudget,
} from '@/modules/monthly-budget/interfaces/lifestyle.interface';
import categoriesService from '@/modules/categories/categories.service';
import lifestyleService from '@/lib/api/lifestyle.api';
import toast from 'react-hot-toast';

const LifestyleBudgetPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lifestyle, setLifestyle] = useState<Lifestyle | null>(null);
  const [budgets, setBudgets] = useState<Record<number, number>>({});
  const [income, setIncome] = useState<number>(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const categories = categoriesService.getAllCategories();

  useEffect(() => {
    const fetchLifestyleBudgets = async () => {
      if (!user) return;

      try {
        const lifestyleData = await lifestyleService.getByUserId(user.id);

        if (lifestyleData) {
          setLifestyle(lifestyleData);
          setIncome(lifestyleData.income || 0);

          const budgetsObj: Record<number, number> = {};
          lifestyleData.budgets.forEach((budget) => {
            budgetsObj[budget.subcategoryId] = budget.budget;
          });

          setBudgets(budgetsObj);
          calculateTotalBudget(budgetsObj);
        } else {
          setLifestyle({
            userId: user.id,
            income: 0,
            budgets: [],
          });
        }
      } catch (error) {
        console.error('Error fetching lifestyle budgets:', error);
        toast.error('No se pudieron cargar los presupuestos');
      } finally {
        setLoading(false);
      }
    };

    fetchLifestyleBudgets();
  }, [user]);

  const calculateTotalBudget = (budgetsObj: Record<number, number>) => {
    const total = Object.values(budgetsObj).reduce(
      (sum, value) => sum + value,
      0
    );
    setTotalBudget(total);
  };

  const handleBudgetChange = (subcategoryId: number, value: string) => {
    const numValue = value === '' ? 0 : Number(value);

    const updatedBudgets = {
      ...budgets,
      [subcategoryId]: numValue,
    };

    setBudgets(updatedBudgets);
    calculateTotalBudget(updatedBudgets);
  };

  const handleIncomeChange = (value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    setIncome(numValue);
  };

  const handleSaveBudgets = async () => {
    if (!user || !lifestyle) return;

    setSaving(true);
    try {
      const budgetItems: LifestyleBudget[] = Object.entries(budgets)
        .filter(([_, value]) => value > 0)
        .map(([key, value]) => ({
          subcategoryId: Number(key),
          budget: value,
        }));

      const updatedLifestyle: Lifestyle = {
        ...lifestyle,
        income: income,
        budgets: budgetItems,
      };

      await lifestyleService.save(updatedLifestyle);

      toast.success('Presupuestos guardados correctamente');
    } catch (error) {
      console.error('Error saving budgets:', error);
      toast('No se pudieron guardar los presupuestos');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader centered />;

  return (
    <div className="max-w-xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center mb-4">
        <Link to="/budget">
          <Button variant="ghost" className="mr-2 p-2">
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h2 className="font-bold text-xl">Mi estilo de vida</h2>
          <p className="text-sm text-muted-foreground">
            Define tu presupuesto mensual por categoría conforme tu estilo de
            vida y gustos.
          </p>
        </div>
      </div>

      {/* Income Input */}
      <div className="bg-card border rounded-xl p-4 mb-6 shadow-sm">
        <h3 className="font-medium mb-3">Ingreso Mensual</h3>
        <div className="relative">
          <DollarSignIcon className="h-4 w-4 text-muted-foreground absolute left-2 top-1/2 transform -translate-y-1/2" />
          <Input
            type="number"
            value={income > 0 ? income : ''}
            onChange={(e) => handleIncomeChange(e.target.value)}
            placeholder="0"
            className="pl-8"
          />
        </div>
      </div>

      {/* Total Budget Summary */}
      <div className="bg-card border rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Presupuesto Total</h3>
          <div className="flex items-center gap-1">
            <InfoIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {Object.values(budgets).filter((b) => b > 0).length} categorías
            </span>
          </div>
        </div>
        <p className="text-2xl font-bold text-center my-3">
          {formatCurrency(totalBudget)}
        </p>
        {income > 0 && (
          <div className="text-center text-sm">
            <span
              className={`${
                totalBudget > income ? 'text-red-500' : 'text-green-500'
              }`}
            >
              {totalBudget > income
                ? `${formatCurrency(
                    totalBudget - income
                  )} por encima de tu ingreso`
                : `${formatCurrency(income - totalBudget)} disponible`}
            </span>
          </div>
        )}
      </div>

      {/* Categories Accordion */}
      <Accordion type="multiple" className="mb-6">
        {categories.map((category) => (
          <AccordionItem key={category.id} value={`category-${category.id}`}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: category.color }}
                  />
                  <span>{category.name}</span>
                </div>
                {category.subcategories.some(
                  (sub) => (budgets[sub.id] || 0) > 0
                ) && (
                  <div className="bg-primary/10 text-primary text-xs font-medium rounded-full px-2 py-0.5 mr-2">
                    {
                      category.subcategories.filter(
                        (sub) => (budgets[sub.id] || 0) > 0
                      ).length
                    }
                  </div>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pl-7">
                {category.subcategories.map((subcategory) => {
                  const budget = budgets[subcategory.id] || 0;

                  return (
                    <div
                      key={subcategory.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {subcategory.name}
                        </p>
                        {subcategory.necessity && (
                          <span className="text-xs text-muted-foreground">
                            Necesidad básica
                          </span>
                        )}
                      </div>
                      <div className="relative w-28">
                        <DollarSignIcon className="h-4 w-4 text-muted-foreground absolute left-2 top-1/2 transform -translate-y-1/2" />
                        <Input
                          type="number"
                          value={budget > 0 ? budget : ''}
                          onChange={(e) =>
                            handleBudgetChange(subcategory.id, e.target.value)
                          }
                          placeholder="0"
                          className="pl-8"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Save Button - Fixed at bottom */}
      <div className="fixed bottom-4 left-0 right-0 mx-auto max-w-md px-4">
        <Button
          className="w-full py-6"
          onClick={handleSaveBudgets}
          disabled={saving}
        >
          {saving ? (
            <Loader />
          ) : (
            <>
              <SaveIcon className="mr-2 h-5 w-5" />
              Guardar presupuesto
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default LifestyleBudgetPage;
