import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
email:any

  constructor(private authService:AuthServiceService,private toastController: ToastController,private router: Router) { }

  ngOnInit() {
  }
  // reset(){
  //   this.authService.resetPassword(this.email).then( () =>{      
  //     console.log('sent'); 
  //     this.presentToast()
  //   })
  // }
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  async resetPassword(email: string) {
    try {
      await this.authService.resetPassword(this.email);
      console.log('Reset email sent successfully');
      this.presentToast()
      return true; // Indicate success
    } catch (error) {
      console.error('Error sending reset email:', error);
      // Optionally present a toast message here if needed
      const toast = await this.toastController.create({
        message: 'Failed to send reset email. Please try again.',
        duration: 2000,
        position: 'bottom',
        color: 'danger',
      });
      await toast.present();
      return false; // Indicate failure
    }
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your reset password link has been sent on your email',
      duration: 2000, 
      position: 'bottom',
      icon:'mail-outline',
    });
  
    await toast.present();
    toast.onDidDismiss().then(()=>{
      this.router.navigate(['/login']);
    })
  }
}