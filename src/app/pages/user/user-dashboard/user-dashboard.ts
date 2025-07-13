import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { Transaction } from '../../../models/Transaction';

import { dummyAccount } from '../../../mock-data/account.mock';
import { Account } from '../../../models/Account';
@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, ChartModule],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css'
})
export class UserDashboard implements OnInit {
  account:any;
  chartData: any;
  chartOptions: any;
  cardNumber = localStorage.getItem('cardNumber'); // or decode from JWT
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.account = dummyAccount;

    const labels = this.account.transactions.map((tx:Transaction)=>
      new Date(tx.createdAt).toLocaleDateString()
    );

    const amounts = this.account.transactions.map((tx:Transaction) =>
      tx.type === 'DEPOSIT' ? tx.amount : -tx.amount
    );

    this.chartData = {
      labels,
      datasets: [
        {
          label: 'Transaction Amount',
          data: amounts,
          fill: false,
          borderColor: '#6366F1',
          tension: 0.3
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
      },
      scales: {
        x: {
          ticks: {
            color: '#6B7280'
          }
        },
        y: {
          ticks: {
            color: '#6B7280'
          }
        }
      }
    };
  }

}
