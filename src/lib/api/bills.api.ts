import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  Bill,
  BillWithIncludes,
} from '@/modules/bills/interfaces/bill.interface';
import { Payment } from '@/modules/bills/interfaces/payment.interface';

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

  async getAllByUserId(
    userId: string,
    include?: { payments?: boolean }
  ): Promise<BillWithIncludes[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const bills: BillWithIncludes[] = [];

      for (const billDoc of querySnapshot.docs) {
        const billDocData = billDoc.data();

        const billData = {
          id: billDoc.id,
          ...billDocData,
          createdAt: billDocData.createdAt.toDate(),
          updatedAt: billDocData.updatedAt.toDate(),
        } as BillWithIncludes;

        if (include?.payments) {
          const paymentsQuery = query(
            collection(db, 'Payments'),
            where('billId', '==', billData.id),
            orderBy('paidAt', 'desc')
          );
          const paymentsSnapshot = await getDocs(paymentsQuery);
          const payments: Payment[] = paymentsSnapshot.docs.map((doc) => {
            const docData = doc.data();
            return {
              id: doc.id,
              ...docData,
              createdAt: docData.createdAt.toDate(),
              paidAt: docData.paidAt.toDate(),
            };
          }) as Payment[];

          billData.payments = payments;
        }

        bills.push(billData);
      }
      return bills;
    } catch (error) {
      console.error('Error fetching bills by userId:', error);
      throw error;
    }
  }

  async getById(
    id: string,
    include?: { payments?: boolean }
  ): Promise<BillWithIncludes | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return null;

      const billData: BillWithIncludes = {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt.toDate(),
        updatedAt: docSnap.data().updatedAt.toDate(),
      } as Bill;

      if (include?.payments) {
        const paymentsQuery = query(
          collection(db, 'Payments'),
          where('billId', '==', billData.id),
          orderBy('paidAt', 'desc')
        );
        const paymentsSnapshot = await getDocs(paymentsQuery);
        const payments: Payment[] = paymentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
          paidAt: doc.data().paidAt.toDate(),
        })) as Payment[];

        billData.payments = payments; // Attach payments to bill
      }

      return billData;
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
