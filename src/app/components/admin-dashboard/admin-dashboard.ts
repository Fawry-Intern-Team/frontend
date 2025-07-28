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
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TreeTableModule } from 'primeng/treetable';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Store } from '../../models/store.model';
import { Stock } from '../../models/stock.model';
import { StockHistory } from '../../models/stock-history.model';

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
  searchKeyword: string = '';
  stores: Store[] = [];
  stocks: Stock[] = [];
  stockHistory: StockHistory[] = [];
  showAddDialog: boolean = false;
  showStocks: boolean = false;
  showStockHistory: boolean = false;
  showAddStockDialog: boolean = false;
  showConsumeStockDialog: boolean = false;
  showCreateStockDialog: boolean = false;
  searchedLocation: string = '';
  selectedStock: Stock | null = null;
  selectedStoreForStock: Store | null = null;
  isLoadingStores: boolean = false;
  isLoadingStocks: boolean = false;
  isLoadingHistory: boolean = false;
  isCreatingStore: boolean = false;
  isAddingStock: boolean = false;
  isConsumingStock: boolean = false;
  isCreatingStock: boolean = false;

  // Stock management forms
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
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.fetchStores();
  }

  fetchStores() {
    this.isLoadingStores = true;
    this.http.get<Store[]>('http://localhost:8087/api/store').subscribe({
      next: (data) => {
        this.stores = data;
        this.isLoadingStores = false;
        this.showSuccessMessage('Stores loaded successfully');
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load stores', err);
        this.isLoadingStores = false;
        this.showErrorMessage('Failed to load stores');
      },
    });
  }

  createStore() {
    if (!this.newStore.location.trim()) {
      this.showWarningMessage('Please enter a store location');
      return;
    }

    this.isCreatingStore = true;
    this.http
      .post('http://localhost:8087/api/store/create', this.newStore)
      .subscribe({
        next: () => {
          this.fetchStores();
          this.showAddDialog = false;
          this.newStore.location = '';
          this.isCreatingStore = false;
          this.showSuccessMessage('Store created successfully');
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error creating store:', err);
          this.isCreatingStore = false;
          
          if (err.status === 400 && err.error?.message) {
            this.showErrorMessage(err.error.message);
          } else {
            this.showErrorMessage('Failed to create store');
          }
        },
      });
  }

  searchStocksByLocation() {
    if (!this.searchKeyword.trim()) {
      this.showWarningMessage('Please enter a store location to search');
      return;
    }

    // Find store by location (case-insensitive partial match)
    const store = this.stores.find(s => 
      s.location.toLowerCase().includes(this.searchKeyword.toLowerCase())
    );

    if (!store) {
      this.stocks = [];
      this.showStocks = true;
      this.searchedLocation = this.searchKeyword;
      this.selectedStoreForStock = null;
      this.showWarningMessage(`No store found for location: "${this.searchKeyword}"`);
      return;
    }

    this.selectedStoreForStock = store; // Track the selected store

    // Fetch stocks for the found store
    this.isLoadingStocks = true;
    this.http.get<Stock[]>(`http://localhost:8087/api/store/${store.id}/stock`).subscribe({
      next: (data) => {
        this.stocks = data;
        this.showStocks = true;
        this.searchedLocation = this.searchKeyword;
        this.isLoadingStocks = false;
        
        if (data.length === 0) {
          this.showInfoMessage(`No stocks found for store: "${store.location}"`);
        } else {
          this.showSuccessMessage(`Found ${data.length} stock item(s) for "${store.location}"`);
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load stocks for store:', store.id, err);
        this.stocks = [];
        this.showStocks = true;
        this.searchedLocation = this.searchKeyword;
        this.selectedStoreForStock = null;
        this.isLoadingStocks = false;
        this.showErrorMessage('Failed to load stocks for this store');
      },
    });
  }

  hideStocks() {
    this.showStocks = false;
    this.stocks = [];
    this.searchKeyword = '';
    this.searchedLocation = '';
    this.hideStockHistory(); // Also hide history when hiding stocks
  }

  // Stock History Methods
  viewStockHistory(stock: Stock) {
    this.selectedStock = stock;
    this.isLoadingHistory = true;
    this.showStockHistory = true;

    this.http.get<StockHistory[]>(`http://localhost:8087/api/store/${stock.storeId}/history`).subscribe({
      next: (data) => {
        // Filter history for the specific product
        this.stockHistory = data.filter(history => history.productId === stock.productId);
        this.isLoadingHistory = false;
        
        if (this.stockHistory.length === 0) {
          this.showInfoMessage(`No history found for this stock item`);
        } else {
          this.showSuccessMessage(`Found ${this.stockHistory.length} history record(s)`);
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load stock history:', err);
        this.stockHistory = [];
        this.isLoadingHistory = false;
        this.showErrorMessage('Failed to load stock history');
      },
    });
  }

  hideStockHistory() {
    this.showStockHistory = false;
    this.stockHistory = [];
    this.selectedStock = null;
  }

  formatDateTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  }

  getQuantityChangeClass(quantityChange: number): string {
    if (quantityChange > 0) return 'text-green-600 font-semibold';
    if (quantityChange < 0) return 'text-red-600 font-semibold';
    return 'text-gray-600';
  }

  getQuantityChangeIcon(quantityChange: number): string {
    if (quantityChange > 0) return 'pi pi-arrow-up';
    if (quantityChange < 0) return 'pi pi-arrow-down';
    return 'pi pi-minus';
  }

  // Stock Management Methods
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

  addStock() {
    if (!this.addStockForm.storeId || !this.addStockForm.productId || this.addStockForm.quantity <= 0) {
      this.showWarningMessage('Please fill all required fields with valid values');
      return;
    }

    this.isAddingStock = true;
    const stockDto = {
      storeId: this.addStockForm.storeId,
      productId: this.addStockForm.productId,
      quantity: this.addStockForm.quantity,
      Reason: this.addStockForm.reason || 'Stock addition'
    };

    this.http.post('http://localhost:8087/api/store/stock/add', stockDto).subscribe({
      next: () => {
        this.isAddingStock = false;
        this.closeAddStockDialog();
        this.showSuccessMessage(`Successfully added ${stockDto.quantity} units to stock`);
        
        // Refresh stocks if currently viewing
        if (this.showStocks && this.selectedStoreForStock) {
          this.refreshCurrentStocks();
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error adding stock:', err);
        this.isAddingStock = false;
        
        if (err.status === 404) {
          this.showErrorMessage('Stock not found. Please create the stock first.');
        } else if (err.error?.message) {
          this.showErrorMessage(err.error.message);
        } else {
          this.showErrorMessage('Failed to add stock');
        }
      },
    });
  }

  consumeStock() {
    if (!this.consumeStockForm.storeId || !this.consumeStockForm.productId || this.consumeStockForm.quantity <= 0) {
      this.showWarningMessage('Please fill all required fields with valid values');
      return;
    }

    if (this.selectedStock && this.consumeStockForm.quantity > this.selectedStock.quantity) {
      this.showWarningMessage(`Cannot consume ${this.consumeStockForm.quantity} units. Only ${this.selectedStock.quantity} available.`);
      return;
    }

    this.isConsumingStock = true;
    const stockDto = {
      storeId: this.consumeStockForm.storeId,
      productId: this.consumeStockForm.productId,
      quantity: this.consumeStockForm.quantity,
      Reason: this.consumeStockForm.reason || 'Stock consumption'
    };

    this.http.post('http://localhost:8087/api/store/stock/consume', stockDto).subscribe({
      next: () => {
        this.isConsumingStock = false;
        this.closeConsumeStockDialog();
        this.showSuccessMessage(`Successfully consumed ${stockDto.quantity} units from stock`);
        
        // Refresh stocks if currently viewing
        if (this.showStocks && this.selectedStoreForStock) {
          this.refreshCurrentStocks();
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error consuming stock:', err);
        this.isConsumingStock = false;
        
        if (err.status === 400 && err.error?.message?.includes('Not enough stock')) {
          this.showErrorMessage('Not enough stock available for consumption');
        } else if (err.error?.message) {
          this.showErrorMessage(err.error.message);
        } else {
          this.showErrorMessage('Failed to consume stock');
        }
      },
    });
  }

  createStock() {
    if (!this.createStockForm.storeId || !this.createStockForm.productId || this.createStockForm.quantity <= 0) {
      this.showWarningMessage('Please fill all required fields with valid values');
      return;
    }

    this.isCreatingStock = true;
    const stockDto = {
      storeId: this.createStockForm.storeId,
      productId: this.createStockForm.productId,
      quantity: this.createStockForm.quantity,
      Reason: this.createStockForm.reason || 'Initial stock creation'
    };

    this.http.post('http://localhost:8087/api/store/stock/create', stockDto).subscribe({
      next: () => {
        this.isCreatingStock = false;
        this.closeCreateStockDialog();
        this.showSuccessMessage(`Successfully created stock with ${stockDto.quantity} units`);
        
        // Refresh stocks if currently viewing the same store
        if (this.showStocks && this.selectedStoreForStock && this.selectedStoreForStock.id === stockDto.storeId) {
          this.refreshCurrentStocks();
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error creating stock:', err);
        this.isCreatingStock = false;
        
        if (err.status === 400 && err.error?.message?.includes('already created')) {
          this.showErrorMessage('Stock already exists for this store and product combination');
        } else if (err.error?.message) {
          this.showErrorMessage(err.error.message);
        } else {
          this.showErrorMessage('Failed to create stock');
        }
      },
    });
  }

  refreshCurrentStocks() {
    if (this.selectedStoreForStock) {
      this.isLoadingStocks = true;
      this.http.get<Stock[]>(`http://localhost:8087/api/store/${this.selectedStoreForStock.id}/stock`).subscribe({
        next: (data) => {
          this.stocks = data;
          this.isLoadingStocks = false;
        },
        error: (err: HttpErrorResponse) => {
          console.error('Failed to refresh stocks:', err);
          this.isLoadingStocks = false;
        },
      });
    }
  }

  // Helper methods for template
  getStoreLocationById(storeId: string): string {
    const store = this.stores.find(s => s.id === storeId);
    return store?.location || 'Unknown Store';
  }

  getStockStatus(quantity: number): string {
    if (quantity === 0) return 'Out of Stock';
    if (quantity < 10) return 'Low Stock';
    return 'In Stock';
  }

  getStockStatusClass(quantity: number): string {
    if (quantity === 0) return 'status-badge status-out-of-stock';
    if (quantity < 10) return 'status-badge status-low-stock';
    return 'status-badge status-in-stock';
  }

  // Toast message methods
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