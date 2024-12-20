import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from '../../../../services/modal.service';
import { ApiService } from '../../../../services/api.service';
import { CommonModule } from '@angular/common';

// import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cancel-flight',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cancel-flight.component.html',
  styleUrl: './cancel-flight.component.css'
})
export class CancelFlightComponent implements OnInit{

  constructor(private cancelFlightService: ModalService, private apiService: ApiService) {

  }

  @Input() flightCode!: number;
  @Input() flightDate!: string;
  @Input() flightStatus!: number;

  flightCancelled: boolean = false;

  ngOnInit(): void {
    this.validateCancel();
  }

  validateCancel(){
    let currentDate = new Date();
    let flightDate = new Date(this.flightDate);
    // console.log(flightDate < currentDate)
    // console.log(this.flightStatus)
    if(flightDate < currentDate || this.flightStatus !== 1){
      this.flightCancelled = true;
    }else{
      this.flightCancelled = false;
    }
  }

  cancelFlight(){

    this.apiService.putData('manage/delete-flight?flightId='+this.flightCode, {flightID: Number(this.flightCode)}).subscribe(
      (response) => {
        // window.alert('Vuelo cancelado con éxito');
        Swal.fire({
          icon: "error",
          title: "Cancelar vuelo",
          text: "Vuelo cancelado con éxito.",
          confirmButtonColor: "#0F766E",
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true
        }).then(() => {
          this.close();
          window.location.reload();
        });
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
