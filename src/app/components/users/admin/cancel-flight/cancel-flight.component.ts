import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../../services/modal.service';

@Component({
  selector: 'app-cancel-flight',
  standalone: true,
  imports: [],
  templateUrl: './cancel-flight.component.html',
  styleUrl: './cancel-flight.component.css'
})
export class CancelFlightComponent implements OnInit{

  constructor(private cancelFlightService: ModalService){

  }

  ngOnInit(): void {
    
  }

  close(){
    this.cancelFlightService.$cancel.emit(false);
  }
}
