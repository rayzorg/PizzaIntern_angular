import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pizza } from '../models/pizza';

@Injectable({ providedIn: 'root' })
export class PizzaService {

  private apiUrl = 'http://localhost:8080/api/pizzas';

  constructor(private http: HttpClient) {}

  getAllPizzas(): Observable<Pizza[]> {
    return this.http.get<Pizza[]>(this.apiUrl);
  }

  updateAvailability(id: number, available: boolean) {
     return this.http.put(
    `http://localhost:8080/api/admin/pizzas/${id}/availability`,
    null,
    { params: { available } }
  );
  }
}
