import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class MessageAppointmentService {
  private apiUrl = 'http://localhost:3000/api/formulario-cita';
  constructor(private _http: HttpClient) {}

  sendMessage(formData: FormData): Observable<any> {
    return this._http.post<any>(this.apiUrl, formData);
  }
}
