import {Transaction} from '../models/Transaction'

export interface Account {
  cardNumber: string;
  name: string;
  balance: number;
  transactions: Transaction[];
}

