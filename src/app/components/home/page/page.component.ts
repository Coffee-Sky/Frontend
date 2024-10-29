import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { SearchFlightsComponent } from '../search-flights/search-flights.component';


@Component({
  selector: 'app-page',
  standalone: true,
  imports: [HeaderComponent, CommonModule, SearchFlightsComponent],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css'
})
export class PageComponent implements OnInit{
  constructor() {}
  ngOnInit(): void {
    
  }
}
