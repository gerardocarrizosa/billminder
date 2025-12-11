import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/modules/common/components/ui/button";
import { Expense, expenseSchema } from "../interfaces/expense.interface";
import expensesService from "@/lib/api/expenses.api";
import FormInput from "@/modules/common/components/form-input";
import categoriesService from "@/modules/categories/categories.service";
import favoriteCategoriesService from "@/lib/api/favorite-categories.api";
import { FavoriteCategory } from "@/modules/categories/interfaces/favorite-category.interface";
import toast from "react-hot-toast";
import { Star } from "lucide-react";
import FormSelect from "@/modules/common/components/form-select";

interface ExpenseFormProps {
  expense?: Expense;
  isEditing?: boolean;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  expense,
  isEditing = false,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const categories = categoriesService.getAllCategories();
  const [favorites, setFavorites] = useState<FavoriteCategory[]>([]);

  useEffect(() => {
    if (user?.id) {
      loadFavorites();
    }
  }, [user?.id]);

  const loadFavorites = async () => {
    if (!user) return;
    try {
      const favs = await favoriteCategoriesService.getAllByUserId(user.id);
      setFavorites(favs);
    } catch (error) {
      console.error("Failed to load favorites", error);
    }
  };

  const toggleFavorite = async (catId: number, subId: number) => {
    if (!user) return;
    const existing = favorites.find(
      (f) => f.categoryId === catId && f.subcategoryId === subId
    );

    try {
      if (existing) {
        await favoriteCategoriesService.delete(existing.id);
        toast.success("Eliminado de favoritos");
      } else {
        await favoriteCategoriesService.create(user.id, catId, subId);
        toast.success("Agregado a favoritos");
      }
      loadFavorites();
    } catch (error: any) {
      toast.error(error.message || "Error actualizando favoritos");
    }
  };

  if (!user) return null;

  const today = new Date();

  const initialValues: Omit<Expense, "id"> = {
    userId: user.id,
    name: "",
    amount: 0,
    categoryId: -1,
    subcategoryId: -1,
    createdAt: today,
    month: today.getMonth(),
  };

  const formInitialValues = isEditing && expense ? expense : initialValues;

  const handleSubmit = async (values: Omit<Expense, "id">) => {
    try {
      if (isEditing && expense?.id) {
        await expensesService.update(expense.id, values);
      } else {
        await expensesService.create(values as Expense);
      }
      navigate("/budget");
    } catch (err) {
      console.error("Error saving expense:", err);
    }
  };

  return (
    <div className="mx-auto rounded-lg shadow-md">
      <Formik
        initialValues={formInitialValues}
        validationSchema={expenseSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting, setFieldValue }) => (
          <Form className="space-y-6">
            {/* Favorites Section */}
            {favorites.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Favoritos
                </label>
                <div className="flex flex-wrap gap-2">
                  {favorites.map((fav) => {
                    const cat = categories.find((c) => c.id === fav.categoryId);
                    const sub = cat?.subcategories.find(
                      (s) => s.id === fav.subcategoryId
                    );
                    if (!cat || !sub) return null;

                    return (
                      <button
                        key={fav.id}
                        type="button"
                        onClick={() => {
                          setFieldValue("categoryId", fav.categoryId);
                          setFieldValue("subcategoryId", fav.subcategoryId);
                        }}
                        className="badge badge-lg gap-2 rounded cursor-pointer transition-colors hover:opacity-80"
                        style={{
                          padding: "0.5rem",
                          backgroundColor: cat.color + "20", // 20% opacity
                          color: cat.color,
                          borderColor: cat.color,
                        }}
                      >
                        <Star className="w-3 h-3 fill-current" />
                        {sub.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <FormInput label="Concepto" name="name" />
            <FormInput label="Monto" name="amount" type="number" />
            <FormSelect
              label="Categoría"
              name="categoryId"
              optionBadge
              options={categories.map((c) => ({
                label: c.name,
                value: c.id,
                color: c.color,
              }))}
              onChange={() => setFieldValue("subcategoryId", -1)}
            />
            {categories.find((c) => c.id === Number(values.categoryId)) ? (
              <FormSelect
                label="Subcategoría"
                name="subcategoryId"
                options={categories
                  .find((c) => c.id === Number(values.categoryId))!
                  .subcategories.map((s) => ({
                    label: s.name,
                    value: s.id,
                  }))}
              />
            ) : null}

            {Number(values.categoryId) >= 0 &&
            Number(values.subcategoryId) >= 0 ? (
              <div className="flex justify-end -mt-4 mb-2">
                <button
                  type="button"
                  onClick={() =>
                    toggleFavorite(
                      Number(values.categoryId),
                      Number(values.subcategoryId)
                    )
                  }
                  className="text-xs flex items-center gap-1 text-gray-500 hover:text-yellow-500 transition-colors"
                >
                  {favorites.some(
                    (f) =>
                      f.categoryId === Number(values.categoryId) &&
                      f.subcategoryId === Number(values.subcategoryId)
                  ) ? (
                    <div className="flex gap-2 pt-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span>En favoritos</span>
                    </div>
                  ) : (
                    <div className="flex gap-2 pt-2">
                      <Star className="w-4 h-4" />
                      <span>Agregar a favoritos</span>
                    </div>
                  )}
                </button>
              </div>
            ) : null}
            <FormInput label="Fecha" name="createdAt" type="date" />
            <div className="flex space-x-4 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate("/budget")}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : isEditing ? (
                  "Guardar"
                ) : (
                  "Agregar"
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ExpenseForm;
