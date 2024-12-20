import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { Post, PostsService } from 'src/app/service/posts.service';
import { IonModal, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
})
export class PostsPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;

  title!: string;
  posts!: string;
  userId: any;
  selectedPost: Post = {
    userId: '',
    title: '',
    content: '',
    createdAt: undefined,

  };
  postsList: Post[] = [];

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private loadingController: LoadingController,
    private postService: PostsService,
    private authService: AuthServiceService,
    private router: Router
  ) {}

  async addPost() {
    try {
      await this.postService.addPost({
        userId: this.userId,
        title: this.title,
        content: this.posts,
        createdAt: new Date(),
      });

      this.title = '';
      this.posts = '';
      const toast = await this.toastCtrl.create({
        message: 'Post added successfully',
        duration: 2000,
      });
      await toast.present();
    } catch (error:any) {
      const toast = await this.toastCtrl.create({
        message: error.message,
        duration: 2000,
      });
      await toast.present();
    }
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      console.log(ev.detail.data);
    }
  }

  confirm() {
    this.modal.dismiss('confirm');
    this.addPost();
  }

  ngOnInit() {
    this.authService.getProfile().then(user => {
      if (user) {
        this.userId = user.uid;
        this.postService.getPosts(this.userId).subscribe(res => {
          this.postsList = res;
        });
      } else {
        console.error('User not logged in.');
      }
    }).catch(error => {
      console.error('Error getting user profile:', error);
    });
  }
  

  async openPost(post: Post) {
    const modal = await this.modalCtrl.create({
      component: PostsPage,
      componentProps: { id: post.id },
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.6,
    });

    await modal.present();
  }
  signOut() {
    this.authService.signOut(); 
    this.router.navigate(['/login']);
  }
  async deletePost(postId: string | undefined) {
    if (postId) {
      try {
        await this.postService.removePost(postId);
        const toast = await this.toastCtrl.create({
          message: 'Post deleted successfully',
          duration: 2000,
        });
        await toast.present();
        // Refresh the posts list after deletion
        this.postsList = this.postsList.filter(p => p.id !== postId);
      } catch (error: any) {
        const toast = await this.toastCtrl.create({
          message: error.message,
          duration: 2000,
        });
        await toast.present();
      }
    }
  }
  
}
