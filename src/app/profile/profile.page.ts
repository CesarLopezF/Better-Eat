import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AlertController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user$:Observable<User> = this.userService.afAuth.user;
  userData: User;

  constructor(private userService:UserService,
    private router:Router,
    private alertController:AlertController,
    private camera: Camera,
    private loadingController: LoadingController) {
      this.user$.subscribe(user =>{
        this.userData = user;
      })
     }

  ngOnInit() {
  }

  exit(){
    this.userService.logout().then(() => {
      this.router.navigateByUrl("login", {replaceUrl: true});
    });
  }

  async cambiarNombre(){

    const alert = await this.alertController.create({
      header: "Introduce un nuevo nombre",
      cssClass: "changeUser",
      inputs: [
        {name: 'displayName',
        placeholder: 'Nombre'}
      ],
      buttons: [{
        text: 'Cancelar',
        handler: () => {
        }
      },{
        text: 'Cambiar',
        handler: async data => {

          const loading = await this.loadingController.create({
            translucent: true
          });
          loading.present();

          if(data.displayName != null && data.displayName.length > 0){
            this.userService.changeUsername(data.displayName);
          }else{
            alert.message = "Enter valid name";
            return false;
          }
          loading.dismiss();
        }
      }]
    });
    await alert.present();

  }

  async cambiarFoto(){
    const alert = await this.alertController.create({
      header: "¿Quieres cambiar tu foto de perfil?",
      buttons: [{
        text: 'No',
        handler: () => {
        }
      },{
        text: 'Si',
        handler: async () => {
          const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
          }
      
          const loading = await this.loadingController.create({
            translucent: true
          });
          
          this.camera.getPicture(options).then(async image => {
            await loading.present();
            this.userService.uploadImg(image, this.userData.uid).then(async url => {
              await loading.dismiss();
            }, async error => {
              await loading.dismiss();
              const alert = await this.alertController.create({
                header: 'Error',
                message: error,
                buttons: ['OK']
              });
              await alert.present();
            })
          })
        }
      }]
    });
    await alert.present();

    
  }

  async nuevaContrasena(){
    const loading = await this.loadingController.create({
      translucent: true
    });

    loading.present();

    this.userService.resetPassword(this.userData.email).then(() => {
      loading.dismiss();
    })
  }

}
