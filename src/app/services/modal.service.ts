import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }
  $create = new EventEmitter<any>();
  $status = new EventEmitter<any>();
  $password = new EventEmitter<any>();
  $promotion = new EventEmitter<any>();
  $cancel = new EventEmitter<any>();
  $edit = new EventEmitter<any>();
  $verifyPassword = new EventEmitter<any>();
}
