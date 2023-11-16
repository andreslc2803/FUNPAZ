import { Component } from '@angular/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent {
  services = [
    {
      name: 'Psicoterapia',
      description: 'Terapia de psicoterapia individual, grupal y familiar para apoyar a los pacientes.',
      image: '../../../assets/media/FotosServicios/psicoterapia.jpg'
    },
    {
      name: 'Psiquiatría',
      description: 'Terapia de psiquiátria individual, grupal y familiar para apoyar a los pacientes.',
      image: '../../../assets/media/FotosServicios/psiquiatria.jpg'
    },
    {
      name: 'Consulta psiquiatría ',
      description: 'Realiza tu consulta de psiquiatría con nosotros.',
      image: '../../../assets/media/FotosServicios/consulta.jpg'
    },
    {
      name: 'Consulta psicología',
      description: 'Realiza tu consulta de psicología con nosotros.',
      image: '../../../assets/media/FotosServicios/consulta_psicologia.jpg'
    },
    {
      name: 'Hospitalización',
      description: 'FUNPAZ ofrece servicios de hospitalización para brindarte el mayor apoyo.',
      image: '../../../assets/media/FotosServicios/hospitalizacion.jpg'
    },
    {
      name: 'Consulta trabajo social',
      description: 'Realiza tu consulta de trabajo social con nosotros.',
      image: '../../../assets/media/FotosServicios/trabajo_social.jpg'
    }
  ];
}
