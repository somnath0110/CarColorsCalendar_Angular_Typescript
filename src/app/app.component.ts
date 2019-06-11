import { Component } from '@angular/core';
import { COLORS, HOLIDAYS } from './config/product.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'colorcarscalendar';
  colors = COLORS;
  holidays = HOLIDAYS;
}
