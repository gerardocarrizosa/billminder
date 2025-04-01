import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Bill } from '@/modules/bills/interfaces/bill.interface';

class BillService {
  private collectionName = 'Bills';
  private collection = collection(db, this.collectionName);

  async create(data: Bill): Promise<string> {
    try {
      // Omit the 'id' if present as Firestore will generate it
      const { id, ...dataWithoutId } = data;

      const docRef = await addDoc(this.collection, dataWithoutId);

      return docRef.id;
    } catch (error) {
      console.error('Error creating bill:', error);
      throw error;
    }
  }

  async getAllByUserId(userId: string): Promise<Bill[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      const bills: Bill[] = [];
      querySnapshot.forEach((doc) => {
        bills.push({
          id: doc.id,
          ...doc.data(),
        } as Bill);
      });

      return bills;
    } catch (error) {
      console.error('Error fetching bills by userId:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Bill | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as Bill;
      }
      return null;
    } catch (error) {
      console.error('Error fetching bill:', error);
      throw error;
    }
  }

  async update(id: string, updateData: Partial<Bill>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);

      // Remove undefined values to prevent overwriting with undefined
      const cleanedUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([_, v]) => v !== undefined)
      );

      await updateDoc(docRef, cleanedUpdateData);
    } catch (error) {
      console.error('Error updating bill:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting bill:', error);
      throw error;
    }
  }
}

export const billService = new BillService();

export default billService;
