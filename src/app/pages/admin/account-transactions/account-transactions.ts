import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Transaction } from '../../../models/Transaction';
import { RouterModule } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { AccountService } from '../../../services/account-service';
@Component({
  selector: 'app-account-transactions',
  standalone: true,
  imports: [CommonModule, TableModule, RouterModule, ChartModule],
  templateUrl: './account-transactions.html',
  styleUrl: './account-transactions.css'
})
export class AccountTransactions {
  id: string = '';
  cardName: string = '';
  accountName: string = '';
  transactions: Transaction[] = [];
  lineChartData: any;
  lineChartOptions: any;
  doughnutChartData: any;
  doughnutChartOptions: any;



  ngOnInit(): void {
    console.log("first")
    const id = this.route.snapshot.paramMap.get('id');
    this.accountService.getAccount(id || '').subscribe(
      {
        next: (res) => {
          this.cardName=res.name
          this.transactions = res.transactions;
          this.Prepare();
        },
        error: (err) => {
          console.error('Error fetching transactions:', err);
        }
      }
    )


  }


  Prepare() {
    this.accountName = this.cardName
    // Prepare Line Chart: Transactions over time
    const labels = this.transactions.map(tx =>
      new Date(tx.createdAt).toLocaleDateString()
    );
    const data = this.transactions.map(tx => tx.amount);

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
    const depositCount = this.transactions.filter(tx => tx.type === 'DEPOSIT').length;
    const withdrawalCount = this.transactions.filter(tx => tx.type === 'WITHDRAWAL').length;

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
  constructor(private route: ActivatedRoute,
    private accountService: AccountService
  ) { }
}


