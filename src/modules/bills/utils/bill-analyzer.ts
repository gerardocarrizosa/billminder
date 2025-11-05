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
   * Get a valid date, clamping invalid days (e.g., day 31 in February)
   * to the last valid day of the month
   */
  private getValidDate(year: number, month: number, day: number): Date {
    const date = new Date(year, month, day);
    // If the day was auto-adjusted (invalid day), clamp to last day of month
    if (date.getDate() !== day && day > 28) {
      return new Date(year, month + 1, 0);
    }
    return date;
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

    return this.getValidDate(
      nextPaymentYear,
      nextPaymentMonth,
      this.bill.paymentDeadline
    );
  }

  /**
   * Check if a bill is due based on last payment made.
   * Returns: true (due), 'overdue' (deadline passed), false (paid), 'skipped' (zero amount), or null (no payments)
   */
  isBillDue() {
    if (!this.bill.payments || this.bill.payments.length === 0) return null;

    const lastPayment = this.bill.payments[0];

    // Check if the last payment has zero amount (unused month)
    if (lastPayment.amount === 0) {
      return 'skipped';
    }

    const lastPaymentDate = lastPayment.paidAt;
    const today = new Date();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    switch (this.bill.type) {
      case 'credit_card': {
        // Check if cutoffDate and paymentDeadline exist
        if (!this.bill.cutoffDate || !this.bill.paymentDeadline) {
          return null;
        }

        // Calculate the most recent cutoff date based on today
        let cutoffMonth = todayMonth;
        let cutoffYear = todayYear;

        if (today.getDate() <= this.bill.cutoffDate) {
          // We haven't reached this month's cutoff yet, so use last month's cutoff
          cutoffMonth = todayMonth - 1;
          if (cutoffMonth < 0) {
            cutoffMonth = 11;
            cutoffYear--;
          }
        }
        // If today.getDate() > cutoffDate, we use this month's cutoff (already set)

        const mostRecentCutoffDate = this.getValidDate(
          cutoffYear,
          cutoffMonth,
          this.bill.cutoffDate
        );

        // Calculate the payment deadline corresponding to the cutoff date
        // Payment deadline is typically in the same month or next month after cutoff
        let deadlineMonth = cutoffMonth;
        let deadlineYear = cutoffYear;

        // If deadline day is before cutoff day, deadline is next month
        if (this.bill.paymentDeadline < this.bill.cutoffDate) {
          deadlineMonth = cutoffMonth + 1;
          if (deadlineMonth > 11) {
            deadlineMonth = 0;
            deadlineYear++;
          }
        }

        const correspondingPaymentDeadline = this.getValidDate(
          deadlineYear,
          deadlineMonth,
          this.bill.paymentDeadline
        );

        // Normalize dates to compare only date parts (ignore time)
        const normalizeDate = (date: Date) => {
          return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        };

        const normalizedLastPaymentDate = normalizeDate(lastPaymentDate);
        const normalizedCutoffDate = normalizeDate(mostRecentCutoffDate);
        const normalizedToday = normalizeDate(today);

        // Check if last payment is for the current billing cycle
        // Payment is valid if it was made on or after the most recent cutoff date
        const hasPaymentForCurrentPeriod =
          normalizedLastPaymentDate >= normalizedCutoffDate;

        // Check if we're past the most recent cutoff date
        const isPastCutoffDate = normalizedToday > normalizedCutoffDate;

        if (!hasPaymentForCurrentPeriod) {
          // No payment for current period
          if (isPastCutoffDate) {
            // Check if payment deadline has also passed
            const normalizedDeadline = normalizeDate(
              correspondingPaymentDeadline
            );
            if (normalizedToday > normalizedDeadline) {
              return 'overdue'; // overdue - cutoff and deadline passed without payment
            }
            // Cutoff passed but deadline hasn't - still due but not overdue yet
            return true; // due - cutoff date passed without payment for that period
          }
          // Cutoff date hasn't passed yet, show NA
          return null; // NA - cutoff date not reached yet
        }

        // Payment exists for current period
        // Check if today is after payment deadline AND last payment was before deadline
        // This means payment deadline has passed but payment was made after deadline
        const normalizedDeadline = normalizeDate(correspondingPaymentDeadline);
        if (
          normalizedToday > normalizedDeadline &&
          normalizedLastPaymentDate < normalizedDeadline
        ) {
          return true; // due - payment deadline passed without timely payment
        }

        return false; // paid - payment exists for the current period
      }

      case 'service':
      case 'subscription': {
        // Check if paymentDeadline exists
        if (!this.bill.paymentDeadline) {
          return null;
        }

        // Calculate the current payment deadline based on today
        let deadlineMonth = todayMonth;
        let deadlineYear = todayYear;

        // Calculate the start of the current period (beginning of current month)
        const currentPeriodStart = new Date(todayYear, todayMonth, 1);

        // If today's day is past the deadline, check if we need next month's deadline
        if (today.getDate() > this.bill.paymentDeadline) {
          // We're past this month's deadline, so check next month's deadline
          deadlineMonth = todayMonth + 1;
          if (deadlineMonth > 11) {
            deadlineMonth = 0;
            deadlineYear++;
          }
        }

        const currentPaymentDeadline = this.getValidDate(
          deadlineYear,
          deadlineMonth,
          this.bill.paymentDeadline
        );

        // Check if last payment is for the current period
        // Payment is valid if it was made in the current month (or after period start)
        const hasPaymentForCurrentPeriod =
          lastPaymentDate >= currentPeriodStart;

        if (!hasPaymentForCurrentPeriod) {
          // No payment for current period
          // If deadline hasn't passed yet, show NA
          if (today <= currentPaymentDeadline) {
            return null; // NA - no payment yet for current period, deadline not reached
          }
          // Deadline has passed without payment
          return true; // due - payment deadline passed without payment
        }

        // Payment exists for current period
        // Check if today is after payment deadline AND last payment was before deadline
        if (
          today > currentPaymentDeadline &&
          lastPaymentDate < currentPaymentDeadline
        ) {
          return true; // due - payment deadline passed without timely payment
        }

        return false; // paid - payment exists for the current period
      }

      default:
        return null;
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
