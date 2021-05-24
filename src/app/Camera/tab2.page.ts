import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Camera , CameraOptions } from '@ionic-native/camera/ngx';
import { CameraPreview } from '@ionic-native/camera-preview/ngx';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';
import { GoogleVisionService } from '../services/google-vision.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  user$:Observable<User> = this.userService.afAuth.user;

  IMAGE_TAKEN: any;
  IMAGE_DATA: any;
  fl = "on";
  products: { key: string, category: string, percentage: number }[];

  constructor(private userService:UserService,
    private cameraPreview:CameraPreview,
    private camera: Camera,
    private router:Router,
    private vision:GoogleVisionService,
    private alertController: AlertController) {

  }

  ionViewWillEnter(){
    this.IMAGE_TAKEN = null;
    setTimeout(() => {
      this.cameraPreview.startCamera({ x: 0, y: 0, height: window.screen.height * 0.66, camera: "rear", toBack: false});
    }, 500);
  }

  ionViewWillLeave(){
    this.IMAGE_TAKEN = null;
    this.cameraPreview.stopCamera();
  }

  flashlight(){
    if(this.fl == "on"){
      this.cameraPreview.setFlashMode("torch");
      this.fl = "off";
    } else if(this.fl == "off"){
      this.cameraPreview.setFlashMode("off");
      this.fl = "on";
    }
  }

  cancel(){
    if(!this.IMAGE_TAKEN){
      this.cameraPreview.stopCamera();
    }
    this.router.navigate(["/tabs/tab1"]);
  }

  takePicture() {
    /*Este codigo es para seleccionar una foto desde la galeria
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      allowEdit: false
    }

    this.camera.getPicture(options).then(imageData => {
      this.cameraPreview.stopCamera();
      this.IMAGE_TAKEN = 'data:image/jpeg;base64,'+ imageData;
      this.IMAGE_DATA = imageData;
    })

    return*/

    this.cameraPreview.takePicture({
      width: window.screen.width,
      height: window.screen.height * 0.66,
      quality: 100
    }).then(async (imageData) => {
      this.IMAGE_TAKEN = 'data:image/jpeg;base64,'+ imageData[0];
      this.IMAGE_DATA = imageData[0];
      this.cameraPreview.stopCamera();
    }, (err) => {
      console.log(err);
    });
  }

  send(){
    this.vision.getSimilarProducts(this.IMAGE_DATA).subscribe(async result => {
      const respuesta = JSON.stringify(result.json());
      const respuestaObj = JSON.parse(respuesta);

      var results = respuestaObj.responses[0].productSearchResults.results;

      this.products  = [];
      
      results.forEach(result => {
        this.products.push({key: result.product.name.split('/').pop(-1), category: result.product.productLabels[0].value, percentage: result.score});
      });
      
      this.cameraPreview.stopCamera();

      this.router.navigateByUrl('identification-result', {state: {products: this.products }});

    })
    
  }

  retry(){
    this.IMAGE_TAKEN = null;
    this.cameraPreview.startCamera({ x: 0, y: 0, height: window.screen.height * 0.66, camera: "rear", toBack: false});
  }

  profile(){
    this.IMAGE_TAKEN = null;
    this.cameraPreview.stopCamera();
    this.router.navigateByUrl('profile');
  }

}
