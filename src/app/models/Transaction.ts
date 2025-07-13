export interface Transaction {
  transactionId: number;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  amount: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
