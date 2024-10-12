import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore, addDoc, collection, collectionData, doc, docData, query, updateDoc, where } from '@angular/fire/firestore';
import { AuthServiceService } from '../service/auth-service.service';
import { Observable } from 'rxjs';
import { deleteDoc } from 'firebase/firestore';

export class Post {
  id?: string;
  userId: string;
  title: string;
  content: string;
  createdAt: any;

  constructor(userId: string, title: string, content: string, createdAt: any) {
    this.userId = userId;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
  }
}

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private userId: string | undefined;

  constructor(private firestore: Firestore, private authService: AuthServiceService) {
    // Initialisation asynchrone du userId
    this.authService.getProfile().then(user => {
      this.userId = user?.uid;
      console.log('User ID:', this.userId);
    }).catch(error => {
      console.error('Error getting user profile:', error);
    });
  }

  // Ajout d'un post
  async addPost(post: Post): Promise<void> {
    if (!this.userId) {
      await this.initializeUserId();
    }
  
    post.userId = this.userId!;
    console.log('Adding post:', post);
  
    const postRef = collection(this.firestore, 'posts');
    await addDoc(postRef, post); 
  }

  // Récupère les posts d'un utilisateur spécifique
  getPosts(userId: string): Observable<Post[]> {
    const postRef = collection(this.firestore, 'posts');
    const refq = query(postRef, where('userId', '==', userId));
    return collectionData(refq, { idField: 'id' }) as Observable<Post[]>;
  }
  // Ajoutez cette méthode dans PostsService
getAllPosts(): Observable<Post[]> {
  const postRef = collection(this.firestore, 'posts');
  return collectionData(postRef, { idField: 'id' }) as Observable<Post[]>;
}

  // Méthode pour initialiser userId, retourne une Promise
  private async initializeUserId(): Promise<void> {
    if (!this.userId) {
      const user = await this.authService.getProfile();
      this.userId = user?.uid;
      console.log('User ID initialized:', this.userId);
    }
  }

  // Récupère un post par son ID
  getPostById(id: string): Observable<Post> {
    const postRef = doc(this.firestore, `posts/${id}`);
    return docData(postRef, { idField: 'id' }) as Observable<Post>;
  }

  // Supprime un post par son ID
  removePost(id: string): Promise<void> {
    const postRef = doc(this.firestore, `posts/${id}`);
    return deleteDoc(postRef);
  }

  // Met à jour un post existant
  updatePost(post: Post): Promise<void> {
    const postRef = doc(this.firestore, `posts/${post.id}`);
    return updateDoc(postRef, { title: post.title, content: post.content });
  }
}
