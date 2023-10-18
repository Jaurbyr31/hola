import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-felicitar-aprendiz',
  templateUrl: './felicitar-aprendiz.page.html',
  styleUrls: ['./felicitar-aprendiz.page.scss'],
})
export class FelicitarAprendizPage implements OnInit {

  constructor(private router: Router, private http:HttpClient, private alertController: AlertController){ this.obtenerFichasUnicas(); this.getUser(); }

  async presentAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK']
    });
  
    await alert.present();
  }; 

  /* Aca estan los parametros para los botones de salida y paguina anterior de la paguina*/
  volver(){ this.router.navigate(['/home']); }
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

  destinatario: string = '';
  destinatarios: any = [];

  usuariosDB: any = [];
  InfoAprendiz: any =[];

  fichasUnicas: any = [];
  fichaSeleccionada: any;

  fechaActual = new Date();
  dia = this.fechaActual.getDate();
  mes = this.fechaActual.getMonth() + 1; // Los meses en JavaScript van de 0 a 11, por lo que sumamos 1.
  anio = this.fechaActual.getFullYear();
  fechaFormateada = `${this.dia}/${this.mes}/${this.anio}`;

  asunto = 'Felicitación al aprendiz';

  nota: string = '';
  get cuerpo(): string { return `

  -------------------------------------------------
  ${this.fechaFormateada}

  Bogotá,
  Señor ${this.newNombre}
  ${this.newEmail}
  ${this.newCargo}
  Gestión de Redes de Datos
  Bogotá
  Asunto: ${this.asunto}

  Respetado Señor ${this.newNombre},

  Le informo que en la reunión del Comité de Evaluación y Seguimiento según consta en el Acta No 6 del 15 de junio de 2022, se recomienda felicitarlo por su excelente desempeño académico y actitudinal reflejado en compromiso, responsabilidad y colaboración.

  Sea esta la oportunidad para invitarlo a continuar con ese entusiasmo en el desarrollo de su formación profesional.

  Cordialmente,
  Jaime García Di - Motoli
  Subdirector
  Proyecto: Tatiana Díaz
  Cargo: Apoyo Administrativo Coordinación Académica
  Revisó: Gustavo Beltrán Macías
  Cargo: Coordinador Académico
  VB: Lorena Salas
  Cargo: Abogada Despacho Subdirector
  Regional Distrito Capital - Centro de Gestión de Mercados, Logística y Tecnologías de la Información
  Calle 52 No. 13-65, Bogotá D.C. - PBX 57 601 5461500

  Nota: ${this.nota}
  `};

  ngOnInit(){}

  newId: number= 0;
  newNombre: string = '';
  newEmail: string = '';
  newCargo: string = '';

  obtenerFichasUnicas() {
    const fichasUnicas = new Set<string>();
    for (const usuario of this.usuariosDB) { // Recorre los datos en usuariosDB y agrega las fichas al conjunto
      const ficha = usuario.ficha;
      fichasUnicas.add(ficha);
    }
    this.fichasUnicas = Array.from(fichasUnicas); // Convierte el conjunto de fichas únicas en un array
  };

  filtrarDestinatarios() {
    const userFiltered = new Set<string>();
    
    for (const usuario of this.usuariosDB) {
      if (usuario.ficha === this.fichaSeleccionada) { // Verifica si fichaSeleccionada coincide
        const ficha = usuario.nombre;
        userFiltered.add(ficha);
      }
    }
  
    this.destinatarios = Array.from(userFiltered);
  };

  informacionAprendiz() {
    const infoAprendiz = new Set<string>();
    for (const usuario of this.usuariosDB) { // Recorre los datos en usuariosDB y agrega las fichas al conjunto
      if (usuario.nombre === this.destinatario) { // Verifica si fichaSeleccionada coincide
        const ficha = usuario.ficha;
        const nombre = usuario.nombre;
        const cargo = usuario.cargo;
        const correo = usuario.correo;
        infoAprendiz.add('Nombre:'+nombre +' Ficha: '+ ficha +' Cargo: '+ cargo +' Correo: '+correo);
      }
    }
    this.InfoAprendiz = Array.from(infoAprendiz);
  };

  getUser() {
    this.http.get('http://localhost/iumaco_db/usuarios.php').subscribe(
      (response) => {
        console.log('Respuesta del servidor:', response);
        this.usuariosDB = response;

        this.obtenerFichasUnicas();
      },
      (error) => {
        console.error('Error al obtener datos del servidor:', error);
      }
    )
  };

   /* Aca se prueba la funcionalidad del formulario*/
   enviarCorreo() {
    if (this.destinatario === ""){
      this.presentAlert("Campo vacío", "Por favor escoga un aprendiz.");
    }else{  
      const mensajeCodificado = encodeURIComponent(this.cuerpo);
      const mailtoLink = `mailto:${this.destinatario}?subject=${this.asunto}&body=${mensajeCodificado}&attachment=${''}`;
      window.location.href = mailtoLink;
    }
  };

}
