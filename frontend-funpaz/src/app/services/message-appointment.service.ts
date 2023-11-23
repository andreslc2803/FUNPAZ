import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Servicio para interactuar con la API relacionada con el formulario de citas en la clínica médica.
 * Proporciona métodos para enviar mensajes y realizar operaciones relacionadas con las citas médicas.
 *
 * @export
 * @class MessageAppointmentService
 */
@Injectable()
export class MessageAppointmentService {
  // URL de la API para el formulario de citas médicas
  private apiUrl = 'http://localhost:3000/api/formulario-cita';

  /**
   * Crea una instancia del servicio `MessageAppointmentService`.
   * @param {HttpClient} _http - Instancia de HttpClient para realizar solicitudes HTTP.
   */
  constructor(private _http: HttpClient) {}

  /**
   * Envía un mensaje, que en este contexto representa el formulario de citas médicas,
   * a la API de la clínica médica.
   *
   * @param {FormData} formData - Objeto FormData que contiene los datos del formulario.
   * @param {string} token - Token de autenticación para autorizar la solicitud.
   * @returns {Observable<any>} - Observable que emite la respuesta de la API.
   */
  sendMessage(formData: FormData, token: string): Observable<any> {
    // Crear encabezados con el token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Enviar la solicitud POST con los datos del formulario y los encabezados
    return this._http.post<any>(this.apiUrl, formData, { headers });
  }
}
