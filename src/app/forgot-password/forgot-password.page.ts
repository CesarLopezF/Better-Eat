import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage {

  constructor(private userService:UserService,
    private router:Router,
    private loadingController: LoadingController,
    private alertController: AlertController,) { }

  async resetPassword(email){
    const loading = await this.loadingController.create({
      translucent: true
    });

    await loading.present();

    try{
      
      await this.userService.resetPassword(email.value);

      await loading.dismiss();

      const alert = await this.alertController.create({
        header: 'Alert',
        message: "Se ha mandado un correo para cambiar la contraseña",
        buttons: ['OK']
      });

      await alert.present();

      this.router.navigate(['/login']);

    }
    catch(error){

      await loading.dismiss();

      const alert = await this.alertController.create({
        header: 'Alert',
        message: error,
        buttons: ['OK']
      });

      await alert.present();

      console.log('Error ->', error);

    }
  }

}
