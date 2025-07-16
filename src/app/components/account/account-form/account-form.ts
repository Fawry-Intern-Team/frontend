import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../../services/account-service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-account-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './account-form.html',
  styleUrl: './account-form.css'
})
export class AccountForm  {
 form!: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private service: AccountService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      cardNumber: ['', Validators.required],
      name: ['', Validators.required],
      password: ['', Validators.required],
      balance: [0, Validators.required]
    });

    const cardNumber = this.route.snapshot.paramMap.get('cardNumber');
    if (cardNumber) {
      this.isEdit = true;
      this.service.getAccount(cardNumber).subscribe(account => {
        this.form.patchValue(account);
        this.form.get('cardNumber')?.disable(); 
      });
    }
  }

  submit() {
    const formValue = this.form.getRawValue(); 
    const cardNumber = formValue.cardNumber;

    if (this.isEdit) {
      this.service.updateAccount(cardNumber, formValue).subscribe(() => {
        this.router.navigate(['/admin/dashboard']);
      });
    } else {
      this.service.createAccount(formValue).subscribe(() => {
        this.router.navigate(['/admin/dashboard']);
      });
    }
  }
}
