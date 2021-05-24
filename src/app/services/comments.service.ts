import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference, DocumentSnapshot } from '@angular/fire/firestore';
import firebase from 'firebase';
import { Comment } from '../interfaces/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private afs:AngularFirestore) { }

  getUserComment(uid, productKey): AngularFirestoreCollection<Comment>{
    return this.afs.collection<Comment>("comments", ref => ref.where("productKey", "==", productKey).where("uid", "==", uid));
  }

  getProductComments(productKey): AngularFirestoreCollection<Comment>{
    return this.afs.collection<Comment>("comments", ref => ref.where("productKey", "==", productKey).orderBy("dateAdded", "desc"));
  }

  postComment(uid, displayName, productKey, photoURL, comment, score): Promise<DocumentSnapshot<any>>{
    return this.afs.collection<any>("comments").add({
      uid: uid,
      displayName: displayName,
      productKey: productKey,
      photoURL: photoURL,
      comment: comment,
      score: score,
      dateAdded: firebase.firestore.FieldValue.serverTimestamp()
    }).then(comment => {
      return comment.get();
    })
  }

  deleteComment(key){
    return this.afs.collection("comments").doc(key).delete();
  }

  async updateComment(key, comment, score){
    const doc = this.afs.collection<Comment>("comments").doc(key);
    await doc.update({
      comment: comment,
      score: score,
      dateAdded: firebase.firestore.FieldValue.serverTimestamp()
    })
    return doc.ref.get();
  }

}
