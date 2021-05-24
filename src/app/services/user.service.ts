import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../interfaces/user';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public user$: Observable<User>;

  constructor(public afAuth: AngularFireAuth,
    private afs: AngularFirestore) {

    this.user$ = this.afAuth.authState.pipe(
      switchMap((user)=>{
        if ( user ) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        }
        return of(null);
      })
    );

   }

  //Registro de Usuarios
  async register(name:string ,email: string, password: string, photoUrl: string): Promise<any> {
    try{
      const{ user } = await this.afAuth.createUserWithEmailAndPassword(email, password);
      user.updateProfile({
        displayName: name,
        photoURL: photoUrl
      })
      await this.sendVerifcationEmail();
      return user;
    }
    catch(error){
      console.log('Error->', error);
      return error;
    }
  }

  //Manda un correo para verificar email
  async sendVerifcationEmail(): Promise<void> {
    try{
      return(await this.afAuth.currentUser).sendEmailVerification();
    }
    catch(error){
      console.log('Error ->', error);
    }
  }

  //Hace chequeo para ver si el email ha sido verificado
  verify(user): String{
    if(user.emailVerified === true){
      return "emailVerified";
    } else {
      return "notVerified";
    }
  }

  //Cambiar contraseña
  async resetPassword(email: string): Promise<void> {
    try{
      return this.afAuth.sendPasswordResetEmail(email);

    }
    catch(error){
      console.log('Error ->', error);
    }
  }

  //Entrada de Usuarios
  async login(email: string, password: string): Promise<any> {
    try{
      const { user } = await this.afAuth.signInWithEmailAndPassword(email, password);
      this.updateUserData(user);
      return user;
    }
    catch(error){
      return error;
    }
  }

  /*async loginGoogle(){
    try {
      
      const user = await this.googlePlus.login({
        webClientId: environment.googleWebClientId, // optional - clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
        offline: true, // Optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
      })
      const firebaseUser = await this.afAuth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(user.idToken));
      this.updateUserData(firebaseUser.user);
    } catch (err) {
      console.log(err)
    }
  }*/

  //Registro con Google
  loginGoogle(){
    try{
      var provider = new firebase.auth.GoogleAuthProvider();
      this.afAuth.signInWithRedirect(provider);
    }
    catch(error){
      console.log('Error ->', error);
    }
  }

  
  checkGoogleLogin(){
    return this.afAuth.getRedirectResult().then(async result => {
      if(result.credential) {
        const user = result.user;
        this.updateUserData(user);
        return "ok";
      }
    })
  }

  //Subir imagen a Storage
  uploadImg(img: string, id: string){
    let storageRef = firebase.storage().ref();
    let imageRef = storageRef.child('User Images').child(id).child("avatar.jpg");
    return imageRef.putString(img, 'base64').then(() => {
      return imageRef.getDownloadURL().then((url) => {
        this.changeImg(url);
        return url;
      })
    });
  }

  //Cambiar imagen de usuario
  changeImg(img: string){
    var user = firebase.auth().currentUser;
    user.updateProfile({
      photoURL: img
    }).then(() =>{
      this.updateUserData(user);
      this.updateComments(user);
    })
  }

  //Change username
  changeUsername(displayName: string){
    var user = firebase.auth().currentUser;
    user.updateProfile({
      displayName: displayName
    }).then(() =>{
      this.updateUserData(user);
      this.updateComments(user);
    })
  }
  
  private updateUserData(user:User){
    const UserRef:AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
    
    return UserRef.set(data, {merge: true })
  }

   //Actualiza imagen y nombre de todos los comentarios del usuario
   private updateComments(user:User){
    const userUpdates = {
      displayName: user.displayName,
      photoURL: user.photoURL
    }
    let batch = firebase.firestore().batch()
    this.afs.collection<Comment>("comments", ref => ref.where("uid", "==", user.uid)).get().forEach(response => {
      response.forEach(doc => {
        batch.update(doc.ref, userUpdates)
      })
      batch.commit();
    });
  }

  //Salida de usuarios
  async logout(): Promise<void> {
    try{
      await this.afAuth.signOut();
    }
    catch(error){
      console.log('Error ->', error);
    }
  }
}
