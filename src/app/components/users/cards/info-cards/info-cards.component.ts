import { Component } from '@angular/core';
import { HeaderComponent } from '../../../home/header/header.component';

@Component({
  selector: 'app-info-cards',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './info-cards.component.html',
  styleUrl: './info-cards.component.css'
})
export class InfoCardsComponent {

}
