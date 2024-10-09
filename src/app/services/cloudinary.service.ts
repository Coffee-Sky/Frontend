import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {

  private cloudName = environment.CLOUDINARY_CLOUD_NAME;
  private uploadPreset = environment.CLOUDINARY_UPLOAD_PRESET;

  constructor(private http: HttpClient) {}

  /**
   * Sube una imagen a Cloudinary
   * @param file El archivo que se va a subir
   * @returns Un observable con el resultado de la subida
   */
  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);  // Añade el preset de subida

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

    return this.http.post(cloudinaryUrl, formData);
  }
}
