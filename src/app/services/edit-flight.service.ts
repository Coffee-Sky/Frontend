import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EditFlightService {

  constructor() { }
  public isEditing: boolean = false;
  
  toggleEditFlight() {
    this.isEditing = true;
  }
}
