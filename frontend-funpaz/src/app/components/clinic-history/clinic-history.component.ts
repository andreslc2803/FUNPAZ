import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { RecaptchaErrorParameters } from 'ng-recaptcha';
import Swal from 'sweetalert2';

import { AppConfig } from 'src/config/config';
import { ClinicHistoryService } from 'src/app/services/clinic-history.service';

@Component({
  selector: 'app-clinic-history',
  templateUrl: './clinic-history.component.html',
  styleUrls: ['./clinic-history.component.css'],
})
export class ClinicHistoryComponent {
  protected siteKey = AppConfig.reCaptchaSiteKey;
  form!: FormGroup;
  archivosSeleccionados: File[] = [];
  tokenCaptcha: string | null = null;

  constructor(
    public _MessageService: ClinicHistoryService,
    private fb: FormBuilder
  ) {
    this.crearFormulario();
  }

  async enviar() {
    if (!this.isCaptchaValid()) {
      this.mostrarErrorCaptcha();
      return;
    }

    if (this.archivosSeleccionados.length === 0) {
      this.mostrarErrorArchivo();
      return;
    }

    if (this.archivosSeleccionados.length > 0) {
      for (const archivo of this.archivosSeleccionados) {
        const fileExtension = this.obtenerExtensionArchivo(archivo);
        if (!this.esExtensionPermitida(fileExtension)) {
          this.mostrarErrorExtensionArchivo();
          return;
        }

        if (this.tamanoArchivoExcedeLimite(archivo)) {
          this.mostrarErrorTamanoArchivo();
          return;
        }
      }
    }

    await this.enviarMensaje(this.tokenCaptcha);
  }

  async enviarMensaje(token: any) {
    const formData = new FormData();

    for (const archivo of this.archivosSeleccionados) {
      formData.append('archivos', archivo, archivo.name);
    }

    this._MessageService.sendMessage(formData, token).subscribe(
      () => {
        this.mostrarMensajeExito();
        this.limpiar();
      },
      (error) => {
        console.error('Error al enviar el mensaje:', error);
      }
    );
  }

  crearFormulario() {
    this.form = this.fb.group({
      archivos: [null, Validators.required],
      recaptchaReactive: ['', Validators.required],
    });
  }

  resolved(token: any) {
    this.tokenCaptcha = token;
  }

  public onError(errorDetails: RecaptchaErrorParameters): void {
    console.log(`reCAPTCHA error encountered`);
  }

  isCaptchaValid() {
    return this.tokenCaptcha !== null;
  }

  onFileSelected(event: any) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files) {
      this.archivosSeleccionados = Array.from(inputElement.files);
    } else {
      this.archivosSeleccionados = [];
    }
  }

  obtenerExtensionArchivo(archivo: File) {
    return (archivo.name.split('.').pop() || '').toLowerCase();
  }

  esExtensionPermitida(extension: string) {
    const extensionesPermitidas = ['pdf'];
    return extensionesPermitidas.includes(extension);
  }

  tamanoArchivoExcedeLimite(archivo: File) {
    const fileSizeInBytes = archivo.size;
    const fileSizeInMB = fileSizeInBytes / 1024 / 1024;
    return fileSizeInMB > 8;
  }

  mostrarErrorCaptcha() {
    Swal.fire('Error', 'Por favor, resuelve el reCAPTCHA', 'error');
  }

  mostrarErrorExtensionArchivo() {
    Swal.fire(
      'Advertencia',
      'Ajunte solo archivos con la extensión .pdf, de lo contrario no se podra realizar el envio',
      'warning'
    );
  }

  mostrarErrorTamanoArchivo() {
    Swal.fire(
      'Advertencia',
      'Los archivos adjuntos superan el tamaño de 8MB. Recuerda que no deben superar esa cantidad.',
      'warning'
    );
  }

  mostrarErrorArchivo() {
    Swal.fire(
      'Advertencia',
      'Por favor, adjunte los documentos solicitados en el formulario',
      'warning'
    );
  }

  mostrarMensajeExito() {
    Swal.fire(
      'Formulario de contacto',
      'Mensaje enviado correctamente',
      'success'
    );
  }

  async limpiar() {
    await this.form.reset();
    this.archivosSeleccionados = [];
  }
}
