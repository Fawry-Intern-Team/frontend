
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { Account } from '../../../models/Account';
import { dummyAccounts } from '../../../mock-data/account.mock';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, TableModule, CardModule, InputTextModule, FormsModule, ChartModule,RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard {
  accounts: Account[] = [];
  search: string = '';
  chartData: any;
  chartOptions: any;
  totalAccounts = 0;
  totalBalance = 0;
  totalTransactions = 0;
  lineChartData: any;
  lineChartOptions: any;


  ngOnInit(): void {
    this.accounts = dummyAccounts;
    this.totalAccounts = this.accounts.length;
    this.totalBalance = this.accounts.reduce((sum, acc) => sum + acc.balance, 0);
    this.totalTransactions = this.accounts.reduce((sum, acc) => sum + acc.transactions.length, 0);

    this.prepareChart(); // already exists
    this.prepareLineChart(); // next

  }

  get filteredAccounts(): Account[] {
    return this.accounts.filter(acc =>
      acc.name.toLowerCase().includes(this.search.toLowerCase()) ||
      acc.cardNumber.includes(this.search)
    );
  }

  prepareChart() {
    const allTransactions = this.accounts.flatMap(acc => acc.transactions);

    const dates = allTransactions.map(tx =>
      new Date(tx.createdAt).toLocaleDateString()
    );

    const typeCounts = {
      DEPOSIT: 0,
      WITHDRAWAL: 0
    };

    allTransactions.forEach(tx => {
      typeCounts[tx.type]++;
    });

    // Build chart
    this.chartData = {
      labels: Object.keys(typeCounts),
      datasets: [
        {
          data: Object.values(typeCounts),
          backgroundColor: ['#34D399', '#F87171'],
          hoverBackgroundColor: ['#10B981', '#EF4444']
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: '#374151'
          }
        }
      }
    };
  }
  prepareLineChart() {
    const allTx = this.accounts.flatMap(acc => acc.transactions);

    // Group by date
    const volumeByDate: Record<string, number> = {};

    allTx.forEach(tx => {
      const date = new Date(tx.createdAt).toLocaleDateString();
      volumeByDate[date] = (volumeByDate[date] || 0) + 1;
    });

    const sortedDates = Object.keys(volumeByDate).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    this.lineChartData = {
      labels: sortedDates,
      datasets: [
        {
          label: 'Transactions per Day',
          data: sortedDates.map(date => volumeByDate[date]),
          fill: true,
          borderColor: '#6366F1',
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          tension: 0.4
        }
      ]
    };

    this.lineChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: '#374151'
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#6B7280' }
        },
        y: {
          ticks: { color: '#6B7280' }
        }
      }
    };
  }

}
