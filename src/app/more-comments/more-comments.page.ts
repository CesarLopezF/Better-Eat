import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Product } from '../interfaces/product';
import { CommentsService } from '../services/comments.service';
import { ProductsService } from '../services/products.service';
import { UserService } from '../services/user.service';
import { Comment } from '../interfaces/comment';

@Component({
  selector: 'app-more-comments',
  templateUrl: './more-comments.page.html',
  styleUrls: ['./more-comments.page.scss'],
})
export class MoreCommentsPage implements OnInit {

  product: Product;

  comments: Array<Comment>;

  constructor(private router: Router,
    private productsService:ProductsService,
    private userService:UserService,
    private commentsService:CommentsService,) { 

    var key = this.router.getCurrentNavigation().extras.state.key;

    this.productsService.getProduct(key).get().subscribe(product => {

      this.product = {key: product.id, ...product.data()};

      this.commentsService.getProductComments(this.product.key).snapshotChanges().pipe(
        map(changes => 
          changes.map(c =>
            ({key: c.payload.doc.id, ...c.payload.doc.data()})
          )
        )
      ).subscribe(comments => {
        this.comments = comments;
      })

    })
    
  }

  ngOnInit() {
  }

}
