import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Expense } from '@/modules/monthly-budget/interfaces/expense.interface';

class ExpensesService {
  private collectionName = 'Expenses';
  private collection = collection(db, this.collectionName);

  async create(data: Expense): Promise<string> {
    try {
      const { id, ...dataWithoutId } = data;

      const createdAtDate = new Date(data.createdAt);
      const createdAtDateDay = createdAtDate.getDate();
      createdAtDate.setDate(createdAtDateDay + 1);

      const docRef = await addDoc(this.collection, {
        ...dataWithoutId,
        createdAt: Timestamp.fromDate(createdAtDate),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  }

  async getAllByUserId(userId: string, month: number): Promise<Expense[]> {
    try {
      const q = query(
        this.collection,
        where('userId', '==', userId),
        where('month', '==', month),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      const expenses: Expense[] = [];
      querySnapshot.forEach((doc) => {
        expenses.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
        } as Expense);
      });

      // const sortedExpensesAsc = expenses.sort(
      //   (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
      // );
      // return sortedExpensesAsc;

      return expenses;
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Expense | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt.toDate(),
        } as Expense;
      }
      return null;
    } catch (error) {
      console.error('Error fetching expense:', error);
      throw error;
    }
  }

  async update(id: string, updateData: Partial<Expense>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const cleanedData = Object.fromEntries(
        Object.entries(updateData).filter(([_, v]) => v !== undefined)
      );

      // Convert createdAt field to Firestore Timestamp if present
      const convertedData: any = { ...cleanedData };
      if (cleanedData.createdAt) {
        const createdAtDate = new Date(cleanedData.createdAt);
        const createdAtDateDay = createdAtDate.getDate();
        createdAtDate.setDate(createdAtDateDay + 1);
        convertedData.createdAt = Timestamp.fromDate(createdAtDate);
      }

      await updateDoc(docRef, convertedData);
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  }
}

export const expensesService = new ExpensesService();
export default expensesService;
