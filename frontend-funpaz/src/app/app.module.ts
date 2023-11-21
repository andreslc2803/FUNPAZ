import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgImageSliderModule } from 'ng-image-slider';
//recaptcha
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
//componentes
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContactComponent } from './components/contact/contact.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { AppointmentComponent } from './components/appointment/appointment.component';
import { PqrsComponent } from './components/pqrs/pqrs.component';
import { ServicesComponent } from './components/services/services.component';
//servicios
import { MessageContactService } from 'src/app/services/message-contact.service';
import { MessageAppointmentService } from 'src/app/services/message-appointment.service';
import { MessagePqrsService } from './services/message-pqrs.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    ContactComponent,
    AboutUsComponent,
    CarouselComponent,
    AppointmentComponent,
    ServicesComponent,
    PqrsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgImageSliderModule,
    RecaptchaModule,
    RecaptchaFormsModule,
  ],
  providers: [
    MessageContactService,
    MessageAppointmentService,
    MessagePqrsService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
