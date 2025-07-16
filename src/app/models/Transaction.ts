export interface Transaction {
  transactionId: string;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  amount: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
