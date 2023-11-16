import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ContactComponent } from './components/contact/contact.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { AppointmentComponent } from './components/appointment/appointment.component';
import { ServicesComponent } from './components/services/services.component';
import { PqrsComponent } from './components/pqrs/pqrs.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'appointment', component: AppointmentComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'pqrs', component: PqrsComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },   
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
