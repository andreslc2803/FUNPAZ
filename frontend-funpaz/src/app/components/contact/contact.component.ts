import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { RecaptchaErrorParameters } from 'ng-recaptcha';
import Swal from 'sweetalert2';

import { AppConfig } from 'src/config/config';
import { MessageContactService } from 'src/app/services/message-contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent {
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
    public _MessageService: MessageContactService,
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
    // Validar el formulario antes de enviar
    if (this.form.invalid) {
      this.marcarCamposInvalidos();
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

    // Si todo está bien, enviar el mensaje
    this.enviarMensaje(this.tokenCaptcha);
  }

  /**
   * Marcar todos los campos del formulario como tocados
   */
  marcarCamposInvalidos() {
    Object.values(this.form.controls).forEach((control) => {
      control.markAllAsTouched();
    });
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
    const extensionesPermitidas = ['pdf', 'jpg', 'jpeg', 'png'];
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
   * Muestra un mensaje de error por extensión de archivo no permitida
   */
  mostrarErrorExtensionArchivo() {
    Swal.fire(
      'Error',
      'Al menos uno de los archivos seleccionados no tiene una extensión permitida. Por favor, elija archivos con una de las siguientes extensiones: .pdf, .jpg, .jpeg, .png',
      'error'
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
   * Muestra un mensaje de error al no haber resuelto el reCaptcha para enviar el formulario
   */
  mostrarErrorCaptcha() {
    Swal.fire('Error', 'Por favor, resuelve el reCAPTCHA', 'error');
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
   * Envia el formulario como mensaje al servicio correspondiente
   */
  async enviarMensaje(token: any) {
    const formData = new FormData();
    formData.append('nombre', this.form.get('nombre')?.value);
    formData.append('apellido', this.form.get('apellido')?.value);
    formData.append('correo', this.form.get('correo')?.value);
    formData.append('descripcion', this.form.get('descripcion')?.value);

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
   * Crea el formulario con validaciones
   */
  crearFormulario() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      correo: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
          ),
        ],
      ],
      descripcion: ['', Validators.required],
      archivos: [null],
      recaptchaReactive: ['', Validators.required],
    });
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
   * Propiedades computadas para verificar validez de campos individuales
   */
  get nombreNoValido() {
    return this.form.get('nombre')?.invalid && this.form.get('nombre')?.touched;
  }

  get apellidoNoValido() {
    return (
      this.form.get('apellido')?.invalid && this.form.get('apellido')?.touched
    );
  }

  get correoNoValido() {
    return this.form.get('correo')?.invalid && this.form.get('correo')?.touched;
  }

  get descripcionNoValido() {
    return (
      this.form.get('descripcion')?.invalid &&
      this.form.get('descripcion')?.touched
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
