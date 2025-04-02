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
import { Payment } from '@/modules/bills/interfaces/payment.interface';
import { paymentSchema } from '@/modules/bills/interfaces/payment.validation-schema';

class PaymentService {
  private collectionName = 'Payments';
  private collection = collection(db, this.collectionName);

  async create(data: Payment): Promise<string> {
    try {
      await paymentSchema.validate(data);
      const { id, ...dataWithoutId } = data as any;
      const docRef = await addDoc(this.collection, dataWithoutId);
      return docRef.id;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  async getAllByBillId(billId: string): Promise<Payment[]> {
    try {
      const q = query(this.collection, where('billId', '==', billId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Payment)
      );
    } catch (error) {
      console.error('Error fetching payments by billId:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Payment | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists()
        ? ({ id: docSnap.id, ...docSnap.data() } as Payment)
        : null;
    } catch (error) {
      console.error('Error fetching payment:', error);
      throw error;
    }
  }

  async update(id: string, updateData: Partial<Payment>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const cleanedUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([_, v]) => v !== undefined)
      );
      await updateDoc(docRef, cleanedUpdateData);
    } catch (error) {
      console.error('Error updating payment:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting payment:', error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();
export default paymentService;
