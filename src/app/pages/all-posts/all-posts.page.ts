import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { Post, PostsService } from 'src/app/service/posts.service';
import { PostsPage } from '../posts/posts.page';
import { OverlayEventDetail } from '@ionic/core/components';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.page.html',
  styleUrls: ['./all-posts.page.scss'],
})
export class AllPostsPage implements OnInit {

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

  ngOnInit() {
    this.loadAllPosts();
  }

  loadAllPosts() {
    this.postService.getAllPosts().subscribe((res) => {
      this.postsList = res;
    }, error => {
      console.error('Error loading posts:', error);
    });
  }

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
    } catch (error: any) {
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

}
