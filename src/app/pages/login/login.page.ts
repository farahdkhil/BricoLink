import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/service/auth-service.service';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  ionicForm!: FormGroup;

  // email:any
  // password:any
  // contact:any
  darkMode: boolean = true;
  constructor(private toastController: ToastController, private alertController: AlertController,
     private loadingController: LoadingController, private authService: AuthServiceService,
      private router: Router, public formBuilder: FormBuilder) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.darkMode = prefersDark.matches;
       }
       cambio() {
        // const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        this.darkMode = !this.darkMode;
        document.body.classList.toggle( 'dark' );
        
      }
  ngOnInit() {
    this.ionicForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
      password: ['', [
        // Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}'),
        Validators.required,
      ]
      ],
    });
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();
    // console.log(this.email + this.password);
    if (this.ionicForm.valid) {

      //  await  loading.dismiss();
      const user = await this.authService.loginUser(this.ionicForm.value.email, this.ionicForm.value.password).catch((err) => {
        this.presentToast(err)
        console.log(err);
        loading.dismiss();
      })

      if (user) {
        loading.dismiss();
        this.router.navigate(
          ['/all-posts'])
      }
    } else {
      return console.log('Please provide all the required values!');
    }

  }
  get errorControl() {
    return this.ionicForm.controls;
  }

  async presentToast(message: undefined) {
    console.log(message);

    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top',
      color:'danger',
    });

    await toast.present();
  }
}