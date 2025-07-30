import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { HttpClientModule } from '@angular/common/http';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TreeTableModule } from 'primeng/treetable';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Store } from '../../models/store.model';
import { Stock } from '../../models/stock.model';
import { StockHistory } from '../../models/stock-history.model';
import { StoreService } from '../../services/store.service';
import { StockService, StockOperation } from '../../services/stock.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    HttpClientModule,
    CardModule,
    ToolbarModule,
    ButtonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    TreeTableModule,
    FloatLabelModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
})
export class AdminDashboardComponent implements OnInit {
  // UI State
  searchKeyword: string = '';
  showStocks: boolean = false;
  showStockHistory: boolean = false;
  showAddStockDialog: boolean = false;
  showConsumeStockDialog: boolean = false;
  showCreateStockDialog: boolean = false;
  searchedLocation: string = '';

  // Data
  stores: Store[] = [];
  stocks: Stock[] = [];
  stockHistory: StockHistory[] = [];
  selectedStock: Stock | null = null;
  selectedStoreForStock: Store | null = null;

  // Loading states
  isLoadingStores: boolean = false;
  isLoadingStocks: boolean = false;
  isLoadingHistory: boolean = false;
  isCreatingStore: boolean = false;
  isAddingStock: boolean = false;
  isConsumingStock: boolean = false;
  isCreatingStock: boolean = false;

  // Forms
  addStockForm = {
    storeId: '',
    productId: '',
    quantity: 0,
    reason: ''
  };

  consumeStockForm = {
    storeId: '',
    productId: '',
    quantity: 0,
    reason: ''
  };

  createStockForm = {
    storeId: '',
    productId: '',
    quantity: 0,
    reason: ''
  };

  newStore = {
    location: '',
  };

  constructor(
    private storeService: StoreService,
    private stockService: StockService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.fetchStores();
  }

  // Store Management
  fetchStores() {
    this.isLoadingStores = true;
    this.storeService.getStores().subscribe({
      next: (stores) => {
        this.stores = stores;
        this.isLoadingStores = false;
        this.showSuccessMessage('Stores loaded successfully');
      },
      error: (error) => {
        console.error('Failed to load stores', error);
        this.isLoadingStores = false;
        this.showErrorMessage(error.message || 'Failed to load stores');
      },
    });
  }

  createStore() {
    this.isCreatingStore = true;
    this.storeService.createStore(this.newStore).subscribe({
      next: () => {
        this.fetchStores();
        this.newStore.location = '';
        this.isCreatingStore = false;
        this.showSuccessMessage('Store created successfully');
      },
      error: (error) => {
        console.error('Error creating store:', error);
        this.isCreatingStore = false;
        this.showErrorMessage(error.message || 'Failed to create store');
      },
    });
  }

  // Stock Search and Management
  searchStocksByLocation() {
    if (!this.searchKeyword.trim()) {
      this.showWarningMessage('Please enter a store location to search');
      return;
    }

    const store = this.storeService.findStoreByLocation(this.stores, this.searchKeyword);

    if (!store) {
      this.stocks = [];
      this.showStocks = true;
      this.searchedLocation = this.searchKeyword;
      this.selectedStoreForStock = null;
      this.showWarningMessage(`No store found for location: "${this.searchKeyword}"`);
      return;
    }

    this.selectedStoreForStock = store;
    this.isLoadingStocks = true;

    this.stockService.getStocksByStoreId(store.id).subscribe({
      next: (stocks) => {
        this.stocks = stocks;
        this.showStocks = true;
        this.searchedLocation = this.searchKeyword;
        this.isLoadingStocks = false;

        if (stocks.length === 0) {
          this.showInfoMessage(`No stocks found for store: "${store.location}"`);
        } else {
          this.showSuccessMessage(`Found ${stocks.length} stock item(s) for "${store.location}"`);
        }
      },
      error: (error) => {
        console.error('Failed to load stocks for store:', store.id, error);
        this.stocks = [];
        this.showStocks = true;
        this.searchedLocation = this.searchKeyword;
        this.selectedStoreForStock = null;
        this.isLoadingStocks = false;
        this.showErrorMessage(error.message || 'Failed to load stocks for this store');
      },
    });
  }

  hideStocks() {
    this.showStocks = false;
    this.stocks = [];
    this.searchKeyword = '';
    this.searchedLocation = '';
    this.hideStockHistory();
  }

  // Stock History
  viewStockHistory(stock: Stock) {
    this.selectedStock = stock;
    this.isLoadingHistory = true;
    this.showStockHistory = true;

    this.stockService.getStockHistory(stock.storeId, stock.productId).subscribe({
      next: (history) => {
        this.stockHistory = history;
        this.isLoadingHistory = false;
        if (history.length === 0) {
          this.showInfoMessage('No history found for this stock item');
        } else {
          this.showSuccessMessage(`Found ${history.length} history record(s)`);
        }
      },
      error: (error) => {
        console.error('Failed to load stock history:', error);
        this.stockHistory = [];
        this.isLoadingHistory = false;
        this.showErrorMessage(error.message || 'Failed to load stock history');
      },
    });
  }

  hideStockHistory() {
    this.showStockHistory = false;
    this.stockHistory = [];
    this.selectedStock = null;
  }

  // Dialog Management
  openAddStockDialog(stock?: Stock) {
    if (stock) {
      this.addStockForm = {
        storeId: stock.storeId,
        productId: stock.productId,
        quantity: 0,
        reason: ''
      };
    } else {
      this.resetAddStockForm();
    }
    this.showAddStockDialog = true;
  }

  openConsumeStockDialog(stock: Stock) {
    this.consumeStockForm = {
      storeId: stock.storeId,
      productId: stock.productId,
      quantity: 0,
      reason: ''
    };
    this.selectedStock = stock;
    this.showConsumeStockDialog = true;
  }

  openCreateStockDialog() {
    this.resetCreateStockForm();
    this.showCreateStockDialog = true;
  }

  closeAddStockDialog() {
    this.showAddStockDialog = false;
    this.resetAddStockForm();
  }

  closeConsumeStockDialog() {
    this.showConsumeStockDialog = false;
    this.resetConsumeStockForm();
    this.selectedStock = null;
  }

  closeCreateStockDialog() {
    this.showCreateStockDialog = false;
    this.resetCreateStockForm();
  }

  // Stock Operations
  addStock() {
    const operation: StockOperation = {
      storeId: this.addStockForm.storeId,
      productId: this.addStockForm.productId,
      quantity: this.addStockForm.quantity,
      reason: this.addStockForm.reason
    };

    this.isAddingStock = true;
    this.stockService.addStock(operation, this.selectedStock?.quantity).subscribe({
      next: () => {
        this.isAddingStock = false;
        //this.viewStockHistory(this.selectedStock!);
        this.closeAddStockDialog();
        this.showSuccessMessage(`Successfully added ${operation.quantity} units to stock`);
        this.refreshCurrentStocks();
        if (this.showStockHistory && this.selectedStock) {
          this.viewStockHistory(this.selectedStock);
        }
      },
      error: (error) => {
        console.error('Error adding stock:', error);
        this.isAddingStock = false;
        this.showErrorMessage(error.message || 'Failed to add stock');
      },
    });
  }

  consumeStock() {
    const operation: StockOperation = {
      storeId: this.consumeStockForm.storeId,
      productId: this.consumeStockForm.productId,
      quantity: this.consumeStockForm.quantity,
      reason: this.consumeStockForm.reason
    };

    this.isConsumingStock = true;
    this.stockService.consumeStock(operation, this.selectedStock?.quantity).subscribe({
      next: () => {
        this.isConsumingStock = false;
        this.viewStockHistory(this.selectedStock!);
        this.closeConsumeStockDialog();
        this.showSuccessMessage(`Successfully consumed ${operation.quantity} units from stock`);
        this.refreshCurrentStocks();
        // Refresh history if it's currently being viewed
        if (this.showStockHistory && this.selectedStock) {
          this.viewStockHistory(this.selectedStock);
        }
      },
      error: (error) => {
        console.error('Error consuming stock:', error);
        this.isConsumingStock = false;
        this.showErrorMessage(error.message || 'Failed to consume stock');
      },
    });
  }

  createStock() {
    const operation: StockOperation = {
      storeId: this.createStockForm.storeId,
      productId: this.createStockForm.productId,
      quantity: this.createStockForm.quantity,
      reason: this.createStockForm.reason
    };

    this.isCreatingStock = true;
    this.stockService.createStock(operation).subscribe({
      next: () => {
        this.isCreatingStock = false;
        this.closeCreateStockDialog();
        this.showSuccessMessage(`Successfully created stock with ${operation.quantity} units`);

        // Refresh stocks if currently viewing the same store
        if (this.showStocks && this.selectedStoreForStock && this.selectedStoreForStock.id === operation.storeId) {
          this.refreshCurrentStocks();
        }
      },
      error: (error) => {
        console.error('Error creating stock:', error);
        this.isCreatingStock = false;
        this.showErrorMessage(error.message || 'Failed to create stock');
      },
    });
  }

  refreshCurrentStocks() {
    if (this.selectedStoreForStock) {
      this.isLoadingStocks = true;
      this.stockService.getStocksByStoreId(this.selectedStoreForStock.id).subscribe({
        next: (stocks) => {
          this.stocks = stocks;
          this.isLoadingStocks = false;
        },
        error: (error) => {
          console.error('Failed to refresh stocks:', error);
          this.isLoadingStocks = false;
        },
      });
    }
  }

  // Form Reset Methods
  resetAddStockForm() {
    this.addStockForm = {
      storeId: '',
      productId: '',
      quantity: 0,
      reason: ''
    };
  }

  resetConsumeStockForm() {
    this.consumeStockForm = {
      storeId: '',
      productId: '',
      quantity: 0,
      reason: ''
    };
  }

  resetCreateStockForm() {
    this.createStockForm = {
      storeId: '',
      productId: '',
      quantity: 0,
      reason: ''
    };
  }

  // Template Helper Methods
  getStoreLocationById(storeId: string): string {
    return this.storeService.getStoreLocationById(this.stores, storeId);
  }

  getStockStatus(quantity: number): string {
    return this.stockService.getStockStatus(quantity).status;
  }

  getStockStatusClass(quantity: number): string {
    return this.stockService.getStockStatus(quantity).statusClass;
  }

  formatDateTime(dateTimeString: string): string {
    return this.stockService.formatDateTime(dateTimeString);
  }

  getQuantityChangeClass(quantityChange: number): string {
    return this.stockService.getQuantityChangeClass(quantityChange);
  }

  getQuantityChangeIcon(quantityChange: number): string {
    return this.stockService.getQuantityChangeIcon(quantityChange);
  }

  // Toast Message Methods
  showSuccessMessage(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
      life: 3000
    });
  }

  showErrorMessage(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 5000
    });
  }

  showWarningMessage(message: string) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Warning',
      detail: message,
      life: 4000
    });
  }

  showInfoMessage(message: string) {
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: message,
      life: 3000
    });
  }
}