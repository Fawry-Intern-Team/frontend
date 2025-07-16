import {Transaction} from '../models/Transaction'

export interface Account {
  id:string,
  cardNumber: string;
  name: string;
  balance: number;
  transactions: Transaction[];
}

export interface AccountLogin {
  cardNumber: string;
  password: string;

}

