import { BillWithIncludes } from '../interfaces/bill.interface';

/**
 * BillAnalyzer class encapsulates bill-related business logic
 * and calculations in a single class.
 */
export class BillAnalyzer {
  private bill: BillWithIncludes;

  constructor(bill: BillWithIncludes) {
    this.bill = bill;
  }

  /**
   * Calculate total amount paid for the bill
   */
  getTotalPaid(): number {
    if (!this.bill?.payments || this.bill.payments.length === 0) return 0;
    return this.bill.payments.reduce(
      (sum: number, payment: any) => sum + payment.amount,
      0
    );
  }

  /**
   * Get average payment amount
   */
  getAveragePayment(): number {
    if (!this.bill?.payments || this.bill.payments.length === 0) return 0;
    return this.getTotalPaid() / this.bill.payments.length;
  }

  /**
   * Calculate next payment due date
   */
  getNextPaymentDue(): Date | null {
    if (!this.bill || !this.bill.paymentDeadline) return null;

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // If today is past the deadline, next payment is next month
    let nextPaymentMonth =
      today.getDate() > this.bill.paymentDeadline
        ? currentMonth + 1
        : currentMonth;
    let nextPaymentYear = currentYear;

    // Handle December rollover
    if (nextPaymentMonth > 11) {
      nextPaymentMonth = 0;
      nextPaymentYear++;
    }

    return new Date(
      nextPaymentYear,
      nextPaymentMonth,
      this.bill.paymentDeadline
    );
  }

  /**
   * Check if a bill is due based on last payment made.
   */
  isBillDue() {
    if (!this.bill.payments || this.bill.payments.length === 0) return null;

    const lastPayment = this.bill.payments[0];
    const lastPaymentDate = lastPayment.paidAt;

    const actualMonth = new Date().getMonth() + 1;
    const actualYear = new Date().getFullYear();

    switch (this.bill.type) {
      case 'credit_card': {
        const actualCutoffDate = new Date(
          actualYear,
          actualMonth - 1,
          this.bill.cutoffDate
        );

        if (lastPaymentDate <= actualCutoffDate) return true;
        return false;
      }

      case 'service':
      case 'subscription': {
        const actualPaymentDeadline = new Date(
          actualYear,
          actualMonth - 1,
          this.bill.paymentDeadline
        );

        if (lastPaymentDate <= actualPaymentDeadline) return true;
        return false;
      }

      default:
        break;
    }
  }

  /**
   * Check if payment is due soon (within 7 days)
   */
  isPaymentDueSoon(): boolean {
    const nextDue = this.getNextPaymentDue();
    if (!nextDue) return false;

    const today = new Date();
    const daysUntilDue = Math.ceil(
      (nextDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilDue <= 7 && daysUntilDue >= 0;
  }

  /**
   * Check if payment is overdue
   */
  isPaymentOverdue(): boolean {
    const nextDue = this.getNextPaymentDue();
    if (!nextDue) return false;

    const today = new Date();
    return nextDue < today;
  }

  /**
   * Get all bill analysis in a single object
   */
  getAnalysis() {
    const nextPaymentDue = this.getNextPaymentDue();

    return {
      totalPaid: this.getTotalPaid(),
      averagePayment: this.getAveragePayment(),
      nextPaymentDue,
      isBillDue: this.isBillDue(),
      isPaymentDueSoon: this.isPaymentDueSoon(),
      isPaymentOverdue: this.isPaymentOverdue(),
      totalPayments: this.bill.payments?.length || 0,
      hasPayments: this.bill.payments && this.bill.payments.length > 0,
    };
  }
}

/**
 * Factory function to create a BillAnalyzer instance
 */
export const createBillAnalyzer = (bill: BillWithIncludes) => {
  return new BillAnalyzer(bill);
};
