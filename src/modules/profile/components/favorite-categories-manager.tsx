import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import favoriteCategoriesService from "@/lib/api/favorite-categories.api";
import { FavoriteCategory } from "@/modules/categories/interfaces/favorite-category.interface";
import { categories } from "@/modules/categories/categories";
import { Button } from "@/modules/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/modules/common/components/ui/card";
import { AlertCircle, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Badge } from "@/modules/common/components/ui/badge";

const FavoriteCategoriesManager = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] =
    useState<string>("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await favoriteCategoriesService.getAllByUserId(user.id);
      setFavorites(data);
    } catch (error) {
      toast.error("Error al cargar categorías favoritas");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!user) return;
    if (!selectedCategoryId || !selectedSubcategoryId) {
      toast.error("Selecciona categoría y subcategoría");
      return;
    }
    if (favorites.length >= 10) {
      toast.error("Máximo 10 favoritos permitidos");
      return;
    }

    try {
      setAdding(true);
      const categoryIdNum = parseInt(selectedCategoryId);
      const subcategoryIdNum = parseInt(selectedSubcategoryId);

      // Check if already exists
      const exists = favorites.some(
        (fav) =>
          fav.categoryId === categoryIdNum &&
          fav.subcategoryId === subcategoryIdNum
      );
      if (exists) {
        toast.error("Esta categoría ya está en tus favoritos");
        return;
      }

      await favoriteCategoriesService.create(
        user.id,
        categoryIdNum,
        subcategoryIdNum
      );
      toast.success("Favorito agregado");
      setSelectedCategoryId("");
      setSelectedSubcategoryId("");
      fetchFavorites();
    } catch (error) {
      toast.error("Error al agregar favorito");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await favoriteCategoriesService.delete(id);
      toast.success("Favorito eliminado");
      fetchFavorites();
    } catch (error) {
      toast.error("Error al eliminar favorito");
    }
  };

  const getCategoryName = (id: number) => {
    return categories.find((c) => c.id === id)?.name || "Desconocido";
  };

  const getSubcategoryName = (catId: number, subId: number) => {
    const cat = categories.find((c) => c.id === catId);
    return (
      cat?.subcategories.find((s) => s.id === subId)?.name || "Desconocido"
    );
  };

  const selectedCategory = categories.find(
    (c) => c.id.toString() === selectedCategoryId
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tus Categorías Favoritas</h2>
        <Badge variant="outline">{favorites.length} / 10</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Agregar Nueva</CardTitle>
              <CardDescription>
                Selecciona para acceso rápido al registrar gastos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoría</label>
                <select
                  className="select select-bordered w-full rounded-lg"
                  value={selectedCategoryId}
                  onChange={(e) => {
                    setSelectedCategoryId(e.target.value);
                    setSelectedSubcategoryId("");
                  }}
                >
                  <option value="" disabled>
                    Selecciona una categoría
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Subcategoría</label>
                <select
                  className="select select-bordered w-full rounded-lg"
                  value={selectedSubcategoryId}
                  onChange={(e) => setSelectedSubcategoryId(e.target.value)}
                  disabled={!selectedCategoryId}
                >
                  <option value="" disabled>
                    Selecciona una subcategoría
                  </option>
                  {selectedCategory?.subcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                onClick={handleAdd}
                className="w-full"
                disabled={
                  adding ||
                  !selectedCategoryId ||
                  !selectedSubcategoryId ||
                  favorites.length >= 10
                }
              >
                {adding ? (
                  <span className="loading loading-spinner" />
                ) : (
                  <Plus size={16} className="mr-2" />
                )}
                Agregar a Favoritos
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-sm text-muted-foreground">
            Listado Actual
          </h3>
          {loading ? (
            <div className="flex justify-center p-8">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-muted/50 text-muted-foreground text-center">
              <AlertCircle className="mb-2 h-8 w-8 opacity-50" />
              <p>No tienes favoritos aún.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {favorites.map((fav) => {
                const cat = categories.find((c) => c.id === fav.categoryId);
                return (
                  <div
                    key={fav.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-10 rounded-full"
                        style={{ backgroundColor: cat?.color || "#ccc" }}
                      />
                      <div>
                        <p className="font-medium">
                          {getCategoryName(fav.categoryId)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {getSubcategoryName(
                            fav.categoryId,
                            fav.subcategoryId
                          )}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(fav.id!)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoriteCategoriesManager;
