import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  listaAsuntos: string[] = ['Llamado de atención', 'Citación a Comite', 'Felicitar al aprendiz'];

  constructor(private router: Router, private alertController: AlertController) {}

  ngOnInit(){}  

  /* Aca estan los parametros para los botones de navegacion hacia los formularios que envian los correos*/
  felicitarAprendiz() { this.router.navigate(['felicitar-aprendiz']); }
  llamadoAtencion() { this.router.navigate(['/llamado-atencion']); }
  citacionComite() { this.router.navigate(['/citacion-comite']); }

  async confirmarSalida() {
    const alert = await this.alertController.create({
      header: 'Confirmar salida',
      message: '¿Está seguro de que desea cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          cssClass: 'secondary',
          handler: () => {}
        },
        {
          text: 'Aceptar',
          handler: () => { this.router.navigate(['/login']); }
        }
      ]
    });
  
    await alert.present();
  };  
}
