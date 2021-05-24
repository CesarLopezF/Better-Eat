import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonItemSliding } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Comment } from '../interfaces/comment';
import { Product } from '../interfaces/product';
import { User } from '../interfaces/user';
import { CommentsService } from '../services/comments.service';
import { ProductsService } from '../services/products.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {

  user$:Observable<User> = this.userService.afAuth.user;

  product: Product;
  score: number;
  user: User;
  productScore: number;
  
  userComment:Comment;
  userCommentExists: boolean;
  editable: boolean = false;
  newComment: string = "";

  comments: Array<Comment>;
  commentsExist: boolean;

  constructor(private router: Router,
    private productsService:ProductsService,
    private userService:UserService,
    private commentsService:CommentsService,
    private alertController: AlertController) { 

      var key = this.router.getCurrentNavigation().extras.state.key;

      this.productsService.getProduct(key).snapshotChanges().pipe(
        map(changes => 
          ({key: changes.payload.id, ...changes.payload.data()})
        )
      ).subscribe(product => {

        this.product = product;

        this.user$.subscribe(user => {
          this.user = user;

          this.commentsService.getUserComment(this.user.uid, this.product.key).snapshotChanges().pipe(
            map(changes => 
              changes.map(c =>
                ({key: c.payload.doc.id, ...c.payload.doc.data()})
              )
            )
          ).subscribe(comment => {

            this.userComment = comment[0];

            if(typeof this.userComment === "object"){
              this.newComment = this.userComment.comment;
              this.userCommentExists = true;
            } else {
              this.userCommentExists = false;
            }

          })

        })

        this.commentsService.getProductComments(this.product.key).snapshotChanges().pipe(
          map(changes => 
            changes.map(c =>
              ({key: c.payload.doc.id, ...c.payload.doc.data()})
            )
          )
        ).subscribe(comments => {
          this.comments = comments;
          this.productScore = 0;

          if(this.comments.length > 0){
            this.comments.forEach(comment => {
              this.productScore += comment.score;
            })

            this.productScore /= this.comments.length;
            this.productScore = Math.round(this.productScore * 100) / 100;
            this.commentsExist = true;
          } else {
            this.commentsExist = false;
          }

        })

      })

     }

  ngOnInit() {
    
  }

  logScoreChange(score){
    this.score = score;
  }

  async postComment(comment){
    if(!this.score){
      const alert = await this.alertController.create({
        header: "Aviso",
        message: "Por favor califique el producto",
        buttons: [{
          text: 'Ok',
          handler: () => {
          }
        }]
      });
      await alert.present();
      return;
    }
    this.commentsService.postComment(this.user.uid, this.user.displayName, this.product.key, this.user.photoURL, comment.value, this.score).then(userComment => {
      if(this.product.score != this.productScore){
        this.productsService.updateScore(this.product.key, this.productScore)
      }
      this.userComment = {key:userComment.id, ...userComment.data()};
      this.userCommentExists = true;
    })
  }

  async delete(slidingItem: IonItemSliding){
    slidingItem.close();
    const alert = await this.alertController.create({
      header: "Aviso",
      message: "¿Está seguro que quiere borrar el comentario?",
      buttons: [{
        text: 'Cancel',
        handler: () => {
        }
      },{
        text: 'Delete',
        handler: () => {
          this.commentsService.deleteComment(this.userComment.key).then(async () => {
            this.userCommentExists = false;
          })
        }
      }]
    });
    await alert.present();
  }

  enableEdit(slidingItem: IonItemSliding){
    this.editable = true;
    slidingItem.close();
  }

  updateComment(){
    this.commentsService.updateComment(this.userComment.key, this.newComment, this.score).then(answer => {
      if(this.product.score != this.productScore){
        this.productsService.updateScore(this.product.key, this.productScore)
      } 
      this.userComment = ({key: answer.id, ...answer.data()});
      this.editable = false;
    })
  }
  
  cancelUpdateComment(){
    this.editable = false;
  }

  moreComments(){
    this.router.navigate(['more-comments'], {state: {key: this.product.key}});
  }

}
