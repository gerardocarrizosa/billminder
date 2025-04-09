import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/modules/common/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import ExpenseForm from '../components/expense-form';
import { Button } from '@/modules/common/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CategoryWithSubcategories } from '../interfaces/category.interface';
import categoriesService from '@/lib/api/categories.api';
import subcategoryService from '@/lib/api/subcategory.api';
import { useState } from 'react';

const AddExpensePage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryWithSubcategories[]>([]);

  const fetchCategories = async () => {
    const categoriesResult: CategoryWithSubcategories[] = [];
    const categoriesData = await categoriesService.getAll();
    const subcategoriesFound = await subcategoryService.getAll();
    for (const category of categoriesData) {
      categoriesResult.push({
        ...category,
        subcategories: subcategoriesFound.filter(
          (s) => s.categoryId === category.id
        ),
      });
    }
    setCategories(categoriesResult);
  };
  fetchCategories();

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4 mb-2">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="icon"
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <CardTitle>Agregar gasto del mes</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ExpenseForm categoriesOptions={categories} />
      </CardContent>
    </Card>
  );
};

export default AddExpensePage;
