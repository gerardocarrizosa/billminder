import { CategoryWithSubcategories } from './category.interface';
import { Subcategory } from './subcategory.interface';
import { categories } from './categories';
import { CategoriesEnum } from './categories.enum';
import { SubcategoriesEnum } from './subcategories.enum';

class CategoriesService {
  private categories: CategoryWithSubcategories[];
  private categoryMap = new Map<CategoriesEnum, CategoryWithSubcategories>();
  private subcategoryMap = new Map<
    SubcategoriesEnum,
    Subcategory & { categoryName: string }
  >();

  constructor() {
    this.categories = categories;
    this._buildLookupMaps();
  }

  /**
   * Build lookup maps for categories and subcategories
   * @private
   */
  private _buildLookupMaps(): void {
    this.categoryMap.clear();
    this.subcategoryMap.clear();

    this.categories.forEach((category) => {
      this.categoryMap.set(category.id, category);

      category.subcategories.forEach((subcategory) => {
        this.subcategoryMap.set(subcategory.id, {
          ...subcategory,
          categoryName: category.name,
        });
      });
    });
  }

  /**
   * Get all categories
   * @returns All categories with their subcategories
   */
  getAllCategories(): CategoryWithSubcategories[] {
    return this.categories;
  }

  /**
   * Get all categories as a simplified array (id and name only)
   * @returns Array of category objects with id and name
   */
  getCategoriesArray(): Array<{ id: number; name: string }> {
    return this.categories.map((category) => ({
      id: category.id,
      name: category.name,
    }));
  }

  /**
   * Get a specific category by its ID
   * @param categoryId - The category ID
   * @returns The category object or null if not found
   */
  getCategory(categoryId: CategoriesEnum): CategoryWithSubcategories | null {
    return this.categoryMap.get(categoryId) || null;
  }

  /**
   * Get all subcategories for a specific category
   * @param categoryId - The category ID
   * @returns Array of subcategories or null if category doesn't exist
   */
  getSubcategories(categoryId: CategoriesEnum): Subcategory[] | null {
    const category = this.categoryMap.get(categoryId);
    return category ? category.subcategories : null;
  }

  /**
   * Get a specific subcategory by its ID and category ID
   * @param categoryId - The category ID
   * @param subcategoryId - The subcategory ID
   * @returns The subcategory object or null if not found
   */
  getSubcategory(
    categoryId: CategoriesEnum,
    subcategoryId: number
  ): Subcategory | null {
    const category = this.categoryMap.get(categoryId);
    if (!category) return null;

    const subcategory = category.subcategories.find(
      (sub) => sub.id === subcategoryId
    );
    return subcategory || null;
  }

  /**
   * Find a subcategory anywhere in the structure by its ID
   * @param subcategoryId - The subcategory ID to find
   * @returns The subcategory object with category info or null if not found
   */
  findSubcategoryById(
    subcategoryId: number
  ): (Subcategory & { categoryName: string }) | null {
    return this.subcategoryMap.get(subcategoryId) || null;
  }

  getCategoryBySubcategory(subcategoryId: SubcategoriesEnum) {
    const category = this.categories.find((c) =>
      c.subcategories.map((s) => s.id).includes(subcategoryId)
    );

    return category || null;
  }

  /**
   * Get all categories separated by necessity
   * @returns Object with necessary and non-necessary categories
   */
  getCategoriesByNecessity(): {
    necessary: Array<{
      categoryId: CategoriesEnum;
      categoryName: string;
      subcategories: Subcategory[];
    }>;
    nonNecessary: Array<{
      categoryId: CategoriesEnum;
      categoryName: string;
      subcategories: Subcategory[];
    }>;
  } {
    const result = {
      necessary: [] as Array<{
        categoryId: CategoriesEnum;
        categoryName: string;
        subcategories: Subcategory[];
      }>,
      nonNecessary: [] as Array<{
        categoryId: CategoriesEnum;
        categoryName: string;
        subcategories: Subcategory[];
      }>,
    };

    this.categories.forEach((category) => {
      // Get necessary subcategories
      const necessarySubcategories = category.subcategories.filter(
        (subcategory) => subcategory.necessity
      );

      // Get non-necessary subcategories
      const nonNecessarySubcategories = category.subcategories.filter(
        (subcategory) => !subcategory.necessity
      );

      // Add to results if there are subcategories in either category
      if (necessarySubcategories.length > 0) {
        result.necessary.push({
          categoryId: category.id,
          categoryName: category.name,
          subcategories: necessarySubcategories,
        });
      }

      if (nonNecessarySubcategories.length > 0) {
        result.nonNecessary.push({
          categoryId: category.id,
          categoryName: category.name,
          subcategories: nonNecessarySubcategories,
        });
      }
    });

    return result;
  }

  /**
   * Get a serializable representation of all categories (suitable for JSON)
   * @returns The categories structure in the original format
   */
  toJSON(): {
    categories: Array<{
      name: string;
      subCategories: Array<{ name: string; necessity: boolean }>;
    }>;
  } {
    return {
      categories: this.categories.map((category) => ({
        name: category.name,
        subCategories: category.subcategories.map((subcategory) => ({
          name: subcategory.name,
          necessity: subcategory.necessity,
        })),
      })),
    };
  }
}

const categoriesService = new CategoriesService();

export default categoriesService;
