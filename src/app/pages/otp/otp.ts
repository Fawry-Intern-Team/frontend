import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PaymentService ,ConfirmTransactionRequest} from '../../services/PaymentService';
@Component({
  selector: 'app-otp',
  imports: [ReactiveFormsModule, CommonModule,ButtonModule, InputTextModule,ToastModule],
  providers: [  MessageService],
  standalone: true,
  templateUrl: './otp.html',
  styleUrl: './otp.css'
})
export class Otp {
 form: FormGroup;
  constructor(private fb: FormBuilder,private paymentService:PaymentService, private messageService: MessageService) {
    this.form = this.fb.group({
     otp: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]{6}$')]],
    });
  }
  onSubmit() {
    const confirmTransactionRequest:ConfirmTransactionRequest={
      otp:this.form.get('otp')?.value,
      transactionId:localStorage.getItem('transactionId')
    }
    this.paymentService.confirmTransaction(confirmTransactionRequest).subscribe({
    next: (response) => {
        console.log('Transaction initiated successfully', response);
      },
      error: (error) => {
        console.error('Error confirmed transaction', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error  });
      }
    })
  }

}
