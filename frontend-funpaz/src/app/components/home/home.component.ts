import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  darkTheme: boolean = false;

  email = 'secretariaipsfunpaz@gmail.com';
}
