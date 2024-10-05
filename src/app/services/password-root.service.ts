import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordRootService {

  constructor() { }
  $password = new EventEmitter<any>();
}
