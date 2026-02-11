import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../services/cartService';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Auth } from '../services/authService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar {
  username: string | null = null;
  role: string | null = null;

  cartCount$: Observable<number>;
  dropdownOpen = false;

  constructor(
    public auth: Auth,
    private cartService: CartService,
    private router: Router,
  ) {
    this.auth.username$.subscribe((name) => {
      this.username = name;
    });

    this.auth.role$.subscribe((role) => (this.role = role));
    this.cartCount$ = this.cartService.cartItems$.pipe(
      map((items) => items.reduce((sum, i) => sum + i.quantity, 0)),
    );
  }

  logout() {
    this.auth.logout();

    this.router.navigate(['/']);
  }

  goToOrders() {
    this.router.navigate(['/my-orders']);
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
}
