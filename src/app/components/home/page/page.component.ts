import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class PageComponent implements OnInit, OnDestroy{
  constructor() {}
  images = [
    { url: 'Image-6.png', alt: 'Imagen 6' }, // Imagen duplicada (última)
    { url: 'Image-1.png', alt: 'Imagen 1' },
    { url: 'Image-2.png', alt: 'Imagen 2' },
    { url: 'Image-3.png', alt: 'Imagen 3' },
    { url: 'Image-4.png', alt: 'Imagen 4' },
    { url: 'Image-5.png', alt: 'Imagen 5' },
    { url: 'Image-6.png', alt: 'Imagen 6' },
    { url: 'Image-1.png', alt: 'Imagen 1' } // Imagen duplicada (primera)
  ];

  currentIndex = 1; // Empezamos en la primera imagen no duplicada
  private intervalId: any;
  isLoaded = false;
  loadedImages = 0;

  ngOnInit() {
    this.preloadImages();
  }

  ngOnDestroy() {
    this.stopCarousel();
  }

  getCurrentTranslate(): number {
    return (this.currentIndex - 1) * (window.innerWidth < 768 ? 100 : 50);
  }

  preloadImages() {
    this.images.forEach((image, index) => {
      const img = new Image();
      img.src = image.url;
      img.onload = () => {
        this.loadedImages++;
        if (this.loadedImages === this.images.length - 2) {
          // Excluimos las imágenes duplicadas al verificar carga
          this.startCarousel();
        }
      };
      img.onerror = () => {
        console.error(`Error cargando imagen ${index + 1}`);
      };
    });
  }

  onImageLoad() {
    this.loadedImages++;
    if (this.loadedImages === this.images.length - 2) {
      // Excluimos las imágenes duplicadas al verificar carga
      this.isLoaded = true;
      this.startCarousel();
    }
  }

  startCarousel() {
    this.isLoaded = true;
    this.intervalId = setInterval(() => {
      this.next();
    }, 3000);
  }

  stopCarousel() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  next() {
    this.currentIndex++;
    if (this.currentIndex === this.images.length - 1) {
      // Si llegamos al final de la lista, "saltamos" a la primera imagen real
      setTimeout(() => (this.currentIndex = 1), 500);
    }
  }

  prev() {
    this.currentIndex--;
    if (this.currentIndex === 0) {
      // Si estamos en el primer duplicado, "saltamos" a la última imagen real
      setTimeout(() => (this.currentIndex = this.images.length - 2), 500);
    }
  }
}
