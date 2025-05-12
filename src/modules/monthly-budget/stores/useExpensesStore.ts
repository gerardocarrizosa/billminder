import { create } from 'zustand';
import expensesService from '@/lib/api/expenses.api';
import lifestyleService from '@/lib/api/lifestyle.api';
import categoriesService from '@/modules/categories/categories.service';
import { Expense } from '../interfaces/expense.interface';
import { Lifestyle } from '../interfaces/lifestyle.interface';
import { BudgetStatus } from '../components/expense-scrollview-item';
import { SubcategoryBudgetInfo } from '../components/budget-subcategory-statusbar';

interface ExpensesState {
  // Data
  expenses: Expense[];
  lifestyle: Lifestyle | null;
  subcategoryNames: Record<number, string>;

  // Derived data
  expensesTotal: number;
  expensesBySubcategory: Record<number, number>;
  subcategoryBudgets: SubcategoryBudgetInfo[];
  criticalSubcategories: SubcategoryBudgetInfo[];
  normalSubcategories: SubcategoryBudgetInfo[];

  // Loading state
  loading: boolean;
  error: string | null;

  // Actions
  fetchUserData: (userId: string) => Promise<void>;
  addExpense: (expense: Expense) => Promise<void>;
  deleteExpense: (expenseId: string) => Promise<void>;
  updateExpense: (expense: Expense) => Promise<void>;
}

// Define the actions separately for better type inference
interface ExpensesStateWithActions extends ExpensesState {
  calculateDerivedData: () => void;
}

export const useExpensesStore = create<ExpensesStateWithActions>(
  (set, get) => ({
    // Initial state
    expenses: [],
    lifestyle: null,
    subcategoryNames: {},
    expensesTotal: 0,
    expensesBySubcategory: {},
    subcategoryBudgets: [],
    criticalSubcategories: [],
    normalSubcategories: [],
    today: new Date(),
    loading: false,
    error: null,

    // Calculate derived data from expenses and lifestyle
    calculateDerivedData: () => {
      const { expenses, lifestyle, subcategoryNames } = get();

      // Calculate expenses total
      const expensesTotal = expenses.reduce(
        (total, expense) => total + expense.amount,
        0
      );

      // Calculate expenses by subcategory
      const expensesBySubcategory: Record<number, number> = {};
      expenses.forEach((expense) => {
        const { subcategoryId, amount } = expense;
        expensesBySubcategory[subcategoryId] =
          (expensesBySubcategory[subcategoryId] || 0) + amount;
      });

      // Get all subcategory budgets with statuses
      const subcategoryBudgets: SubcategoryBudgetInfo[] = [];

      if (lifestyle) {
        // Get unique subcategory IDs from expenses
        const subcategoryIds = Array.from(
          new Set(expenses.map((expense) => expense.subcategoryId))
        );

        subcategoryIds.forEach((subcategoryId) => {
          // Find budget entry for this subcategory
          const budgetEntry = lifestyle.budgets.find(
            (b) => b.subcategoryId === subcategoryId
          );

          // Skip if no budget is set
          if (!budgetEntry || budgetEntry.budget <= 0) return;

          const totalAmount = expensesBySubcategory[subcategoryId] || 0;
          const budgetLimit = budgetEntry.budget;
          const percentage = (totalAmount / budgetLimit) * 100;

          // Determine status
          let status: BudgetStatus = 'normal';
          if (percentage >= 100) {
            status = 'exceeded';
          } else if (percentage >= 70) {
            status = 'warning';
          }

          subcategoryBudgets.push({
            id: subcategoryId,
            name:
              subcategoryNames[subcategoryId] ||
              `Subcategoría ${subcategoryId}`,
            totalAmount,
            budgetLimit,
            percentage,
            status,
          });
        });
      }

      // Sort subcategories by status priority and percentage
      subcategoryBudgets.sort((a, b) => {
        // First sort: exceeded > warning > normal
        const statusPriority = {
          exceeded: 0,
          warning: 1,
          normal: 2,
          'no-budget': 3,
        };

        const statusDiff = statusPriority[a.status] - statusPriority[b.status];

        // If status is the same, sort by percentage (highest first)
        if (statusDiff === 0) {
          return b.percentage - a.percentage;
        }

        return statusDiff;
      });

      // Separate critical from normal subcategories
      const criticalSubcategories = subcategoryBudgets.filter(
        (sb) => sb.status === 'exceeded' || sb.status === 'warning'
      );

      const normalSubcategories = subcategoryBudgets.filter(
        (sb) => sb.status === 'normal'
      );

      // Update state with calculated values
      set({
        expensesTotal,
        expensesBySubcategory,
        subcategoryBudgets,
        criticalSubcategories,
        normalSubcategories,
      });
    },

    // Fetch user data
    fetchUserData: async (userId: string) => {
      set({ loading: true, error: null });
      const today = new Date();
      const month = today.getMonth();
      try {
        // Fetch expenses and lifestyle data in parallel
        const [expensesData, lifestyleData] = await Promise.all([
          expensesService.getAllByUserId(userId, month),
          lifestyleService.getByUserId(userId),
        ]);

        // Get all categories and subcategories
        const categories = categoriesService.getAllCategories();

        // Create subcategory name mapping
        const subcategoryNames: Record<number, string> = {};
        categories.forEach((category) => {
          category.subcategories.forEach((subcategory) => {
            subcategoryNames[subcategory.id] = subcategory.name;
          });
        });

        // Update state with fetched data
        set({
          expenses: expensesData,
          lifestyle: lifestyleData,
          subcategoryNames,
          loading: false,
        });

        // Calculate all derived data based on new state
        get().calculateDerivedData();
      } catch (error) {
        console.error('Error fetching data:', error);
        set({
          loading: false,
          error:
            error instanceof Error ? error.message : 'Failed to fetch data',
        });
      }
    },

    // Add a new expense
    addExpense: async (expense: Expense) => {
      try {
        // Fix 1: Handle the case where create() returns a string (likely the ID)
        const newExpenseResult = await expensesService.create(expense);

        // If the API returns just the ID string instead of the full expense object
        let newExpense: Expense;
        if (typeof newExpenseResult === 'string') {
          // Create a new expense object with the returned ID
          newExpense = {
            ...expense,
            id: newExpenseResult,
          };
        } else {
          // The API returned the full expense object
          newExpense = newExpenseResult as Expense;
        }

        // Use the spread operator to create a new array with the new expense
        set((state) => ({
          expenses: [...state.expenses, newExpense],
        }));
        get().calculateDerivedData();
      } catch (error) {
        console.error('Error adding expense:', error);
        set({
          error:
            error instanceof Error ? error.message : 'Failed to add expense',
        });
      }
    },

    // Delete an expense
    deleteExpense: async (expenseId: string) => {
      try {
        await expensesService.delete(expenseId);
        set((state) => ({
          expenses: state.expenses.filter(
            (expense) => expense.id !== expenseId
          ),
        }));
        get().calculateDerivedData();
      } catch (error) {
        console.error('Error deleting expense:', error);
        set({
          error:
            error instanceof Error ? error.message : 'Failed to delete expense',
        });
      }
    },

    // Update an expense
    updateExpense: async (expense: Expense) => {
      try {
        // Check the interface of your expensesService.update method
        if (!expense.id) {
          throw new Error('Expense ID is required for updates');
        }

        // Fix 2: Handle the case where update() returns void instead of the updated expense
        await expensesService.update(expense.id, expense);

        // Since the API doesn't return the updated expense, we'll use the one we sent
        set((state) => ({
          expenses: state.expenses.map((e) =>
            e.id === expense.id ? expense : e
          ),
        }));
        get().calculateDerivedData();
      } catch (error) {
        console.error('Error updating expense:', error);
        set({
          error:
            error instanceof Error ? error.message : 'Failed to update expense',
        });
      }
    },
  })
);
