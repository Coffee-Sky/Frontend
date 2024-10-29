import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from '../../../../services/modal.service';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-cancel-flight',
  standalone: true,
  imports: [],
  templateUrl: './cancel-flight.component.html',
  styleUrl: './cancel-flight.component.css'
})
export class CancelFlightComponent implements OnInit{

  constructor(private cancelFlightService: ModalService, private apiService: ApiService) {

  }

  @Input() flightCode!: number;

  ngOnInit(): void {
    
  }

  cancelFlight(){

    this.apiService.putData('manage/delete-flight?flightId='+this.flightCode, {flightID: Number(this.flightCode)}).subscribe(
      (response) => {
        window.alert('Vuelo cancelado con éxito');
        this.close();
        window.location.reload();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  close(){
    this.cancelFlightService.$cancel.emit(false);
  }
}
