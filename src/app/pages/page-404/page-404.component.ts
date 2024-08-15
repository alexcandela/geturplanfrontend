import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-page-404',
  standalone: true,
  imports: [],
  templateUrl: './page-404.component.html',
  styleUrl: './page-404.component.scss'
})
export class Page404Component {
  constructor(private titulo: Title,) { 
    titulo.setTitle('404');
   }
}
