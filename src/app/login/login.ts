import { Component } from '@angular/core';
import { Auth } from '../services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  errorMessages: string[] = [];
isRegisterMode = false;
name='';
phoneNumber='';
 email = '';
  password = '';
  error = '';
  loading = false;
  constructor(private authService:Auth,private router: Router,private cdr: ChangeDetectorRef){

  }

  login() {
    this.error = '';
    this.loading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {
        this.error = 'Invalid email or password';
        this.loading = false;
      }
    });
  }



  submit() {
  this.error = '';
  this.loading = true;

  if (this.isRegisterMode) {
    this.authService.register(this.name, this.email, this.password, this.phoneNumber)
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/']); 
        },
        error: err => {
    this.errorMessages = []; 

    if (err.status === 400) {

      
      if (Array.isArray(err.error)) {
        this.errorMessages.push(...err.error); 
      } else {
        this.errorMessages.push(err.error); 
      }

      this.cdr.markForCheck();
    } else {
      this.errorMessages.push('Something went wrong. Please try again.');
    }
  }
      });
  } else {
    
    this.authService.login(this.email, this.password)
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/']); 
        },
        error: err => {
    this.errorMessages = []; 

    if (err.status === 400) {

      
      if (Array.isArray(err.error)) {
        this.errorMessages.push(...err.error); 
      } else {
        this.errorMessages.push(err.error);
      }

      this.cdr.markForCheck();
    } else if (err.status===500){
        if (Array.isArray(err.error)) {
        this.errorMessages.push(...err.error);
      } else {
        this.errorMessages.push(err.error);
      }

      this.cdr.markForCheck();

    }
  }
      });
  }
}

  toggleMode() {
  this.isRegisterMode = !this.isRegisterMode;
}
}
