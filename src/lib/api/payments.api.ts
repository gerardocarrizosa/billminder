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
import { Payment } from '@/modules/bills/interfaces/payment.interface';
import { handleFirebaseDate } from '@/modules/common/utils/handle-firebase-date';

class PaymentService {
  private collectionName = 'Payments';
  private collection = collection(db, this.collectionName);

  async create(data: Payment): Promise<string> {
    try {
      const { id, ...dataWithoutId } = data;

      const fb_paidAtDate = handleFirebaseDate(dataWithoutId.paidAt);
      const fb_createdAtDate = handleFirebaseDate(dataWithoutId.createdAt);

      const docRef = await addDoc(this.collection, {
        ...dataWithoutId,
        paidAt: Timestamp.fromDate(fb_paidAtDate),
        createdAt: Timestamp.fromDate(fb_createdAtDate),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  async getAllByBillId(billId: string): Promise<Payment[]> {
    try {
      const q = query(
        this.collection,
        where('billId', '==', billId),
        orderBy('paidAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate(),
            paidAt: doc.data().paidAt.toDate(),
          } as Payment)
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
        ? ({
            id: docSnap.id,
            ...docSnap.data(),
            paidAt: docSnap.data().paidAt.toDate(),
            createdAt: docSnap.data().createdAt.toDate(),
          } as Payment)
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

      // Convert date fields to Firestore Timestamps
      const convertedData: any = { ...cleanedUpdateData };
      if (cleanedUpdateData.paidAt instanceof Date) {
        const fb_paidAtDate = handleFirebaseDate(cleanedUpdateData.paidAt);
        convertedData.paidAt = Timestamp.fromDate(fb_paidAtDate);
      }
      if (cleanedUpdateData.createdAt instanceof Date) {
        const fb_createdAtDate = handleFirebaseDate(
          cleanedUpdateData.createdAt
        );
        convertedData.createdAt = Timestamp.fromDate(fb_createdAtDate);
      }

      await updateDoc(docRef, convertedData);
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
