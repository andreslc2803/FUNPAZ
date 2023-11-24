# Funpaz: Backend de la Plataforma de Salud Mental

¡Bienvenido al backend de Funpaz! Este componente está construido con Node.js y Express y sirve como el servidor para la plataforma de salud mental Funpaz. A continuación, encontrarás instrucciones sobre cómo ejecutar el backend, así como cómo configurar las claves de reCAPTCHA y la contraseña de la aplicación de Google.

## Ejecutar el Backend

Para ejecutar el backend de Funpaz, sigue estos pasos:

1. Clona este repositorio:

   ```bash
   git clone https://github.com/andreslc2803/FUNPAZ.git
   ```

2. Ingresa al directorio del backend:

    ```bash
    cd backend-funpaz
    ```

3. Instala las dependencias:

    ```bash
    npm install
    ```

4. Inicia el servidor:

    ```bash
    npm start
    ```

5. El backend estará en funcionamiento en [http://localhost:3000/](http://localhost:3000/).

¡Ahora el backend de Funpaz está listo para recibir solicitudes!

## Configuración de claves de reCAPTCHA y contraseña de la aplicación de Google

Para garantizar la seguridad y el correcto funcionamiento de Funpaz, necesitarás configurar las claves de reCAPTCHA y la contraseña de la aplicación de Google en el backend. Sigue estos pasos:

### Obtener Claves de reCAPTCHA

Para utilizar la funcionalidad de reCAPTCHA en el frontend, necesitarás obtener las claves de API de reCAPTCHA. Sigue estos pasos:

1. Visita el sitio web de [reCAPTCHA](https://www.google.com/recaptcha) de Google.

2. Haz clic en "Administrar reCAPTCHA" y selecciona "Añadir un nuevo sitio".

3. Completa el formulario con la información de Funpaz.

4. Selecciona el tipo de reCAPTCHA que deseas utilizar (por ejemplo, "reCAPTCHA v2" para este caso).

5. Añade los dominios autorizados para Funpaz.

6. Acepta los términos de servicio y haz clic en "Enviar".

7. Copia la clave secreta (Secret Key) proporcionada.

8. Abre el archivo de configuración del backend `src/config/config.js`

9. Agrega la clave de reCAPTCHA:

    ```javascript
    const SECRET_KEY = "";
    ```

### Contraseña de la Aplicación de Google

1. El primer paso es acceder a la sección de Administrar tu cuenta de Google
 
2. Buscamos la sección de Seguridad 
 
3. Buscamos Verificación en 2 pasos 
 
4. Buscamos la sección de Contraseñas de aplicaciones 
 
5. Das click y como paso a seguir creamos una aplicación 
 
6. Copia la clave que nos muestra en el portapapeles

4. Abre el archivo de configuración del backend y agrega la clave de la aplicación de Google:

    ```javascript
    const APPLICATION_PASSWORD_GOOGLE = "";
    ```
5. Agregas el correo electronico que va a utilizar el servicio 
    
    ```javascript
    const EMAIL = "";
    ```

### Nota
Asegúrate de mantener seguras las claves y contraseñas, y nunca las compartas en código fuente público.

## Contribución

¡Agradecemos tus contribuciones! Por favor, crea una rama con tus cambios y envía una solicitud de extracción (pull request) para su revisión.

