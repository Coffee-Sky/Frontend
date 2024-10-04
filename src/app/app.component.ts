import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegisterComponent } from "./components/users/register/register.component";
import { LoginComponent } from "./components/users/login/login.component";
import { HeaderComponent } from "./components/home/header/header.component";
import { PageComponent } from "./components/home/page/page.component";
import { RootHomeComponent } from "./components/users/root/root-home/root-home.component";
import { CloudinaryService } from './services/cloudinary.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RegisterComponent, LoginComponent, HeaderComponent, PageComponent, RootHomeComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';

  // selectedFile: File | null = null;

  // constructor(private cloudinary: CloudinaryService) {}

  //  // Método para manejar la selección del archivo
  // onFileSelected(event: any) {
  //   if (event.target.files && event.target.files[0]) {
  //     this.selectedFile = event.target.files[0];
  //   }
  // }

  // // Método para subir la imagen
  // uploadImage() {
  //   if (this.selectedFile) {
  //     this.cloudinary.uploadImage(this.selectedFile).subscribe(
  //       (response) => {
  //         console.log('Imagen subida correctamente', response);
  //       },
  //       (error) => {
  //         console.error('Error al subir la imagen', error);
  //       }
  //     );
  //   }
  // }
}
