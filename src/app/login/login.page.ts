import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private router:Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private userService: UserService) {
      this.userService.checkGoogleLogin().then(result => {
        if(result == "ok"){
          this.router.navigate(['/tabs/tab1']);
        }
      });
     }

  ngOnInit() {
  }

  ionViewWillEnter(){
    
  }

  async login(email, password){
    const loading = await this.loadingController.create({
      translucent: true
    });

    await loading.present();

    try{
      const user = await this.userService.login(email.value, password.value);
      if(user.message){

        await loading.dismiss();

        const alert = await this.alertController.create({
          header: 'Alert',
          message: user.message,
          buttons: ['OK']
        });

        await alert.present();
        
      } else {
        const isVerified = await this.userService.verify(user);
        this.redirectUser(isVerified);
      }
    }
    catch(error){
      console.log('Error ->', error);
    }
    await loading.dismiss();
  }

  private redirectUser(result): void{
    if(result === "emailVerified"){
      this.router.navigate(['/tabs/tab1']);
    } else if(result === "notVerified"){
      this.router.navigate(['verify-email']);
    }
  }

  moveToRegister(){

    this.router.navigateByUrl("/register");

  }

  async loginGoogle(){
    try{
      await this.userService.loginGoogle();
      this.router.navigateByUrl('/tabs/tab1');
    }catch(error){
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
