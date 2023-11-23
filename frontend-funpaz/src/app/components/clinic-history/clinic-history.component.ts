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
  // Clave del sitio ReCaptcha obtenida de las configuraciones
  protected siteKey = AppConfig.reCaptchaSiteKey;
  // Definicion de el formulario
  form!: FormGroup;
  // Arreglo donde se almacenan los archivos seleccionados
  archivosSeleccionados: File[] = [];
  // Token para validar la realizacion del reCaptcha
  tokenCaptcha: string | null = null;

  // Constructor del componente
  constructor(
    public _MessageService: ClinicHistoryService,
    private fb: FormBuilder
  ) {
    this.crearFormulario();
  }

  /**
   * Verifica que se hayan realizado todo los filtros para el envio del formulario, si es asi
   * realiza el envio
   */
  async enviar() {
    // Verificar la validez del captcha
    if (!this.isCaptchaValid()) {
      this.mostrarErrorCaptcha();
      return;
    }
    // Verificar si no se ha seleccionado un archivo
    if (this.archivosSeleccionados.length === 0) {
      this.mostrarErrorArchivo();
      return;
    }

    // Validar extensiones y tamaño de archivos si se han seleccionado
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

    //Si todo está bien, enviar el mensaje
    await this.enviarMensaje(this.tokenCaptcha);
  }

  /**
   * Envia el formulario como mensaje al servicio correspondiente
   */
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

  /**
   * Crea el formulario con validaciones
   */
  crearFormulario() {
    this.form = this.fb.group({
      archivos: [null, Validators.required],
      recaptchaReactive: ['', Validators.required],
    });
  }

  /**
   * Callback para el evento de resolución de captcha
   */
  resolved(token: any) {
    this.tokenCaptcha = token;
  }

  /**
   * Callback para el evento de error de captcha
   */
  public onError(errorDetails: RecaptchaErrorParameters): void {
    console.log(`reCAPTCHA error encountered`);
  }

  /**
   * Verificar si el captcha es valido
   */
  isCaptchaValid() {
    return this.tokenCaptcha !== null;
  }

  /**
   * Callback para el evento de selección de archivos
   */
  onFileSelected(event: any) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files) {
      this.archivosSeleccionados = Array.from(inputElement.files);
    } else {
      this.archivosSeleccionados = [];
    }
  }

  /**
   * Obtiene la extension de un archivo
   */
  obtenerExtensionArchivo(archivo: File) {
    return (archivo.name.split('.').pop() || '').toLowerCase();
  }

  /**
   * Verifica si la extension de un archivo es permitida
   */
  esExtensionPermitida(extension: string) {
    const extensionesPermitidas = ['pdf'];
    return extensionesPermitidas.includes(extension);
  }

  /**
   * Verifica si el tamaño de un archivo excede el limite
   */
  tamanoArchivoExcedeLimite(archivo: File) {
    const fileSizeInBytes = archivo.size;
    const fileSizeInMB = fileSizeInBytes / 1024 / 1024;
    return fileSizeInMB > 8;
  }

  /**
   * Muestra un mensaje de error al no haber resuelto el reCaptcha para enviar el formulario
   */
  mostrarErrorCaptcha() {
    Swal.fire('Error', 'Por favor, resuelve el reCAPTCHA', 'error');
  }

  /**
   * Muestra un mensaje de error por extensión de archivo no permitida
   */
  mostrarErrorExtensionArchivo() {
    Swal.fire(
      'Advertencia',
      'Ajunte solo archivos con la extensión .pdf, de lo contrario no se podra realizar el envio',
      'warning'
    );
  }

  /**
   * Muestra una advertencia debido a que el tamaño de los archivos exceden el tamaño de 8MB
   */
  mostrarErrorTamanoArchivo() {
    Swal.fire(
      'Advertencia',
      'Los archivos adjuntos superan el tamaño de 8MB. Recuerda que no deben superar esa cantidad.',
      'warning'
    );
  }

  /**
   * Muestra una advertencia al no adjuntar un archivo en el formulario
   */
  mostrarErrorArchivo() {
    Swal.fire(
      'Advertencia',
      'Por favor, adjunte los documentos solicitados en el formulario',
      'warning'
    );
  }

  /**
   * Muestra un mensaje de exito cuando el formulario se completo correctamente
   */
  mostrarMensajeExito() {
    Swal.fire(
      'Formulario de contacto',
      'Mensaje enviado correctamente',
      'success'
    );
  }

  /**
   * Limpia el formulario y archivos seleccionados
   */
  async limpiar() {
    await this.form.reset();
    this.archivosSeleccionados = [];
  }
}
