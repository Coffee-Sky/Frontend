import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CreateAdminService {

  constructor() { }
  $create = new EventEmitter<any>();
}
