import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-llamado-atencion',
  templateUrl: './llamado-atencion.page.html',
  styleUrls: ['./llamado-atencion.page.scss'],
})
export class LlamadoAtencionPage implements OnInit {

  constructor(private router: Router, private http:HttpClient, private alertController: AlertController){ this.obtenerFichasUnicas(); this.getUser();}; 

  ngOnInit(){ this.filtrarDestinatarios(); };

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

  asunto = 'llamado de atención';
  nota: string = '';

  newId: number= 0;
  newNombre: string = '';
  newEmail: string = '';
  newCargo: string = '';

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
    this.http.get('http://localhost/IUMACO/consulta.php').subscribe(
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

  /* Aca se prueba la funcionalidad del Envio del correo  this.destinatarios = [{id: 0 ,nombre: 'Mensaje', email: 'No se ha seleccionado un destinatario.', cargo: 'Sin cargo' }];*/
  enviarCorreo() {
    if (this.destinatario === "") {
      this.presentAlert("Campo vacío", "Por favor escoge un destinatario.");
    } else {
      const asuntoCodificado = encodeURIComponent(this.asunto);
      const cuerpoCodificado = encodeURIComponent(this.cuerpo);
      const mailtoLink = `mailto:${this.destinatario}?subject=${asuntoCodificado}&body=${cuerpoCodificado}`;
      window.location.href = mailtoLink;
    }
  }
  
  
  sendEmail() {
    const emailData = {
      to: 'destinatario@example.com',
      subject: 'Asunto del correo',
      body: 'Contenido del correo',
    };
  
    this.http.post('http://localhost/IUMACO/consulta.php', emailData)
      .subscribe(response => {
        console.log('Correo enviado correctamente', response);
      }, error => {
        console.error('Error al enviar el correo', error);
      });
  }
}
