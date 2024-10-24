import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreguntasService {
  private apiKey = ' $2b$12$aOPN7wbnS2sS80QBrb5Jx.HGhQUFe8THWWRyUR6OAmXO7.d0Tk0u6';
  private apiUrlBase = 'https://api.quiz-contest.xyz/questions';

  constructor(private http: HttpClient) {}

  obtenerPreguntas(categoria: string): Observable<any[]> {
    const url = `https://api.quiz-contest.xyz/questions?limit=10&page=1&category=geography`;
    const headers = new HttpHeaders({
      'Authorization': this.apiKey
    });

    return this.http.get<any[]>(url, { headers });
  }
}