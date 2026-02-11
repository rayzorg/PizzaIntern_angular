import { Component } from '@angular/core';
import { Auth } from '../services/authService';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  errorMessages: string[] = [];
  fieldErrors: { [key: string]: string } = {};
  isRegisterMode = false;
  name = '';
  phoneNumber = '';
  email = '';
  password = '';
  error = '';
  loading = false;
  constructor(
    private route: ActivatedRoute,
    private authService: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  submit() {
    this.loading = true;
    this.errorMessages = [];
    this.fieldErrors = {};

    if (!this.isRegisterMode) {
      this.authService.login(this.email, this.password).subscribe({
        next: () => {
          this.loading = false;
          this.navigateAfterLogin();
        },
        error: (err) => {
          this.loading = false;

          if (err.status === 401 || err.status === 403) {
            this.errorMessages = ['Invalid email or password'];
          } else if (err.status === 400 && Array.isArray(err.error)) {
            err.error.forEach((msg: string) => {
              this.errorMessages.push(msg);

              const parts = msg.split(':');
              if (parts.length === 2) {
                this.fieldErrors[parts[0].trim()] = parts[1].trim();
              }
            });
          } else {
            this.errorMessages = ['Something went wrong. Please try again.'];
          }

          this.cdr.markForCheck();
        },
      });

      return;
    }

    this.authService.register(this.name, this.email, this.password, this.phoneNumber).subscribe({
      next: () => {
        this.loading = false;
        this.navigateAfterLogin();
      },
      error: (err) => {
        this.loading = false;

        if (err.status === 400 && Array.isArray(err.error)) {
          err.error.forEach((msg: string) => {
            this.errorMessages.push(msg);

            const parts = msg.split(':');
            if (parts.length === 2) {
              this.fieldErrors[parts[0].trim()] = parts[1].trim();
            }
          });
        } else {
          this.errorMessages = ['Something went wrong. Please try again.'];
        }

        this.cdr.markForCheck();
      },
    });
  }

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;

    this.name = '';
    this.phoneNumber = '';
    this.email = '';
    this.password = '';
    this.errorMessages = [];
    this.fieldErrors = {};
    this.error = '';
    this.loading = false;
  }

  private navigateAfterLogin() {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';

    this.router.navigateByUrl(returnUrl);
  }
}
