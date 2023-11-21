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
  protected siteKey = AppConfig.reCaptchaSiteKey;
  form!: FormGroup;
  archivosSeleccionados: File[] = [];
  tokenCaptcha: string | null = null;

  constructor(
    public _MessageService: MessageContactService,
    private fb: FormBuilder
  ) {
    this.crearFormulario();
  }

  // Método principal para enviar el formulario
  async enviar() {
    if (!this.isCaptchaValid()) {
      this.mostrarErrorCaptcha();
      return;
    }

    if (this.form.invalid) {
      this.marcarCamposInvalidos();
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

    this.enviarMensaje(this.tokenCaptcha);
  }

  // Marca todos los campos del formulario como tocados
  marcarCamposInvalidos() {
    Object.values(this.form.controls).forEach((control) => {
      control.markAllAsTouched();
    });
  }

  // Muestra un mensaje de error para indicar que se debe resolver el reCAPTCHA
  mostrarErrorCaptcha() {
    Swal.fire('Error', 'Por favor, resuelve el reCAPTCHA', 'error');
  }

  // Obtiene y normaliza la extensión del archivo seleccionado
  obtenerExtensionArchivo(archivo: File) {
    return (archivo.name.split('.').pop() || '').toLowerCase();
  }

  // Verifica si la extensión del archivo es válida
  esExtensionPermitida(extension: string) {
    const extensionesPermitidas = ['pdf', 'jpg', 'jpeg', 'png'];
    return extensionesPermitidas.includes(extension);
  }

  // Verifica si el tamaño del archivo excede el límite
  tamanoArchivoExcedeLimite(archivo: File) {
    const fileSizeInBytes = archivo.size;
    const fileSizeInMB = fileSizeInBytes / 1024 / 1024;
    return fileSizeInMB > 8;
  }

  // Muestra un mensaje de error para archivos con extensiones no permitidas
  mostrarErrorExtensionArchivo() {
    Swal.fire(
      'Error',
      'Al menos uno de los archivos seleccionados no tiene una extensión permitida. Por favor, elija archivos con una de las siguientes extensiones: .pdf, .jpg, .jpeg, .png',
      'error'
    );
  }

  // Muestra un mensaje de advertencia para archivos que exceden el límite de tamaño
  mostrarErrorTamanoArchivo() {
    Swal.fire(
      'Advertencia',
      'Los archivos adjuntos superan el tamaño de 8MB. Recuerda que no deben superar esa cantidad.',
      'warning'
    );
  }

  // Envía el mensaje con los datos del formulario y muestra un mensaje de éxito
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

  // Muestra un mensaje de éxito después de enviar el formulario
  mostrarMensajeExito() {
    Swal.fire(
      'Formulario de contacto',
      'Mensaje enviado correctamente',
      'success'
    );
  }

  //Verifica si se cumplio con exito la validacion del reCaptcha
  resolved(token: any) {
    this.tokenCaptcha = token;
  }

  //Verificar si NO se cumplio con exito la validacion del reCaptcha
  public onError(errorDetails: RecaptchaErrorParameters): void {
    console.log(`reCAPTCHA error encountered`);
  }

  isCaptchaValid() {
    return this.tokenCaptcha !== null;
  }

  /**
   * Crea un formulario que tiene varios campos y define las reglas de validación para cada uno de estos campos
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

  onFileSelected(event: any) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files) {
      this.archivosSeleccionados = Array.from(inputElement.files);
    } else {
      this.archivosSeleccionados = [];
    }
  }

  /**
   * Metodos que se utilizan para verificar si los campos del formulario son válidos o no y si han sido "touched".
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
   * Reiniciar el contenido del form, consola y el reCAPTCHA después de enviar el formulario
   */
  async limpiar() {
    await this.form.reset();
    this.archivosSeleccionados = [];
  }
}
