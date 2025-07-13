import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { dummyAccounts } from '../../../mock-data/account.mock';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Transaction } from '../../../models/Transaction';
import { RouterModule } from '@angular/router';
import { ChartModule } from 'primeng/chart';
@Component({
  selector: 'app-account-transactions',
  standalone: true,
  imports: [CommonModule, TableModule, RouterModule, ChartModule],
  templateUrl: './account-transactions.html',
  styleUrl: './account-transactions.css'
})
export class AccountTransactions {
  cardNumber: string = '';
  accountName: string = '';
  transactions: Transaction[] = [];
  lineChartData: any;
  lineChartOptions: any;
  doughnutChartData: any;
  doughnutChartOptions: any;


  ngOnInit(): void {
    const paramCard = this.route.snapshot.paramMap.get('cardNumber');
    this.cardNumber = paramCard ?? '';

    const matchedAccount = dummyAccounts.find(acc => acc.cardNumber === this.cardNumber);

    if (matchedAccount) {
      this.accountName = matchedAccount.name;
      this.transactions = matchedAccount.transactions;

      // Prepare Line Chart: Transactions over time
      const labels = matchedAccount.transactions.map(tx =>
        new Date(tx.createdAt).toLocaleDateString()
      );
      const data = matchedAccount.transactions.map(tx => tx.amount);

      this.lineChartData = {
        labels,
        datasets: [
          {
            label: 'Transaction Amount',
            data,
            fill: false,
            borderColor: '#6366F1',
            tension: 0.4,
          },
        ],
      };

      this.lineChartOptions = {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: '#374151',
            },
          },
        },
        scales: {
          x: {
            ticks: { color: '#6B7280' },
            grid: { display: false },
          },
          y: {
            ticks: { color: '#6B7280' },
            grid: { color: '#E5E7EB' },
          },
        },
      };

      // Prepare Doughnut Chart: Type breakdown
      const depositCount = matchedAccount.transactions.filter(tx => tx.type === 'DEPOSIT').length;
      const withdrawalCount = matchedAccount.transactions.filter(tx => tx.type === 'WITHDRAWAL').length;

      this.doughnutChartData = {
        labels: ['Deposit', 'Withdrawal'],
        datasets: [
          {
            data: [depositCount, withdrawalCount],
            backgroundColor: ['#10B981', '#EF4444'],
            hoverBackgroundColor: ['#059669', '#DC2626'],
          },
        ],
      };

      this.doughnutChartOptions = {
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#374151' },
          },
        },
      };
    }

  }

  constructor(private route: ActivatedRoute) { }
}
