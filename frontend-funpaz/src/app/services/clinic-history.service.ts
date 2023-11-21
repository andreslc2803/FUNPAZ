import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClinicHistoryService {
  private apiUrl = 'http://localhost:3000/api/formulario-historia';
  constructor(private _http: HttpClient) {}

  sendMessage(formData: FormData, token: string): Observable<any> {
    // Crear encabezados con el token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Enviar la solicitud POST con los datos del formulario y los encabezados
    return this._http.post<any>(this.apiUrl, formData, { headers });
  }
}
