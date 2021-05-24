import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage {

  user$:Observable<User> = this.userService.afAuth.user;

  constructor(private userService: UserService) { }

  async onSendEmail(): Promise<void> {
    try{
      await this.userService.sendVerifcationEmail();
    }catch(error){
      console.log('Error ->', error);
    }
  }

  ngOnDestroy(){
    this.userService.logout();
  }

}
