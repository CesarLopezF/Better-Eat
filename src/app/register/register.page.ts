import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(private userService: UserService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController) { }

  ngOnInit() {
  }

  async register(name, email, password, passwordConfirm){
    
    const loading = await this.loadingController.create({
      translucent: true
    });

    await loading.present();

    if(password.value !== passwordConfirm.value){
      await loading.dismiss();

      const alert = await this.alertController.create({
        header: 'Alert',
        message: 'The passwords do not match',
        buttons: ['OK']
      });

      await alert.present();

      return;
    }

    try {

      const user = await this.userService.register(name.value, email.value, password.value, "https://firebasestorage.googleapis.com/v0/b/better-eat.appspot.com/o/User%20Images%2Fdefault%2Favatar.png?alt=media&token=cab38fe7-4085-4d9a-9d6b-bde71986208e");

      await loading.dismiss();

      if(user.message){
  
        const alert = await this.alertController.create({
          header: 'Alert',
          message: user.message,
          buttons: ['OK']
        });

        await alert.present();

      } else if(user) {

        const alert = await this.alertController.create({
          header: 'Alert',
          message: 'Your user has been created, please verify your email',
          buttons: [{
            text: 'OK',
            handler: () => {
              this.router.navigateByUrl('login');
            }}]
        });

        await alert.present();

      }

    } catch (error) {
      console.log('Error', error);
      await loading.dismiss();
    }
  }

}
