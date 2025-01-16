import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { membremodel } from '../Model/membremodel';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  // External API URL
  apiurl = 'https://retoolapi.dev/HYd96h/data';

  // Get all employees from the external API
  GetAllEmployees(): Observable<membremodel[]> {
    return this.http.get<membremodel[]>(this.apiurl);
  }
}