import { Component, OnInit, DoCheck, Inject } from '@angular/core';
import { RequestService, Causal } from '../../../../../service/request.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ok } from 'assert';
import { ActivatedRoute, Router } from "@angular/router";
import { WebsocketService } from '../../../../../service/websocket.service'

@Component({
  selector: 'app-rechazo-modal',
  templateUrl: './rechazo-modal.component.html',
  styleUrls: ['./rechazo-modal.component.css']
})

export class RechazoModalComponent implements OnInit, DoCheck {
  // public message;
  rechazoLista: string[] = [];
  perdidaOportunidad: string[] = [];
  valorEscojido: string[] = [];
  causal: Causal = {
    id_causal: '',
    mensaje: ''
  };

  causales: string[] = ['Rechazo', 'Oportunidad perdida'];
  causalEscojida: string = this.causales[this.data.option];

  constructor(public _requestService: RequestService, 
    private wsService: WebsocketService,
    public router: Router,
    public dialogRef: MatDialogRef<RechazoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
    this.getCausal();
  }

  getCausal() {
    this._requestService.getCausal().subscribe((res: any) => {
      for (const iterator of res) {
        if (iterator.type === 'Rechazo' && iterator.status === 'ACTIVO') {
          this.rechazoLista.push(iterator);
        }
        if (iterator.type === 'Oportunidad perdida' && iterator.status === 'ACTIVO') {
          this.perdidaOportunidad.push(iterator);
        }
      }
    });
  }

  escogerCausal() {
    console.log(this.causalEscojida);
  }

  ngOnInit() {console.log('dato seleccionado: ', this.data.option);
  }

  ngDoCheck() {
    if (this.causalEscojida === 'Rechazo') {
      this.valorEscojido = this.rechazoLista;
    }
    if (this.causalEscojida === 'Oportunidad perdida') {
      this.valorEscojido = this.perdidaOportunidad;
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }

  guardar() {
    this._requestService.addCausal(this.causal, this.data.id_lead ).subscribe(res => {
      //console.log(this.data);
      this._requestService.updateStatus(this.data.id_lead, { status: "cancelada"}).subscribe(
        res => {
          this.wsService.emit('notifications', this.data.payload)
          this.router.navigate(['/dashboard/admin']);
        },
        err => {
          console.log(err);
        }
      );
      this.onNoClick();
    });
  }
}
