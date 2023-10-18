import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  constructor( private router: Router, private http:HttpClient, private alertController: AlertController){ this.getUser(); }

  username: string = '';
  password: string = '';

  ngOnInit() {}

  usuariosDB: any = [];

  async presentAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK']
    });
  
    await alert.present();
  };  

  verifyCampos() {
    if (this.username === "" && this.password === "") {
        this.presentAlert("Campos vacíos", "Usuario y contraseña son requeridos.");
    } else if (this.username === "") {
        this.presentAlert("Campo vacío", "Usuario es requerido.");
    } else if (this.password === "") {
        this.presentAlert("Campo vacío", "Contraseña es requerida.");
    }
  };

  getUser() {
    this.http.get('http://localhost/IUMACO/consulta.php').subscribe(
      (response) => {
        console.log('Respuesta del servidor:', response);
        this.usuariosDB = response;
      },
      (error) => {
        console.error('Error al obtener datos del servidor:', error);
      }
    )
  };

  login() {
    this.verifyCampos();
    const inputUsername = this.username;
    const inputPassword = this.password;
    const user = this.usuariosDB.find((u: any) => u.nombre === inputUsername && u.credenciales === inputPassword);
  
    if (user) {
      // Las credenciales son correctas, verificar el valor del campo "cargo"
      if (user.cargo === 'instructor') {
        // Usuario instructor
        this.router.navigate(['/home']);
      } else if (user.cargo === 'coordinador') {
        // Usuario coordinador
        this.router.navigate(['/home-coordinador']);
      } else if (user.cargo === 'aprendiz'){
        // Cargo aprendiz
        this.presentAlert("", "Los aprendices no tien acceso a la paguina.");
      }
    } else {}
  };
  
}