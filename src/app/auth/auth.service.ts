import { Injectable } from '@angular/core';
import { Router } from  "@angular/router";
import { User } from  "../classes/user";
import { AngularFireAuth } from  "@angular/fire/auth";
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;
  roleChangeObserver: any;
  
  constructor(
    private toastr: ToastrService,
    public auth: AngularFireAuth,
    public router:  Router
  ) {
    this.auth.authState.subscribe(user => {
    if (user){
      this.user = user;
      localStorage.setItem('user', JSON.stringify(this.user));
    } else {
      localStorage.setItem('user', null);
    }
  })
  }

  async login(email: string, password: string) {
    try {
      const result = await this.auth.signInWithEmailAndPassword(email, password);
      if (!result.user.emailVerified) {
        this.toastr.info("Un email vous a été envoyé. Il faut cliquer sur son lien pour finir l'inscription.");
        return;
      }
      //else
      localStorage.setItem('user', JSON.stringify(result.user));
      this.router.navigate(['profile']);
    } catch(e) {
      console.log(e);
    }

  }

  async logout() {
    this.auth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['login']);
  }

  async register(email: string, password: string) {
    try {
      const result = await this.auth.createUserWithEmailAndPassword(email, password);
      this.router.navigate(['verify-email']);
    } catch(e) {
      if (e.code === "auth/email-already-in-use") {
        this.toastr.error("Cet email est déjà utilisé, identifiez-vous ou redemandez votre mot de passe ci-dessous.");
      }
      else {
        this.toastr.error(e.message, 'Erreur');
      }
    }
  }

  async sendEmailVerification() {
    await (await this.auth.currentUser).sendEmailVerification();
    this.toastr.success('Email de verification renvoyé !');
  }

  async sendPasswordResetEmail(passwordResetEmail: string) {
    await this.auth.sendPasswordResetEmail(passwordResetEmail);
    this.toastr.success('Email de réinitialisation de mot de passe envoyé !');
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }
  get uid(): string {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.uid;
  }


  onRoleChange = new Observable(observer => {
    this.roleChangeObserver = observer;
  });
  onMenuChange = new Observable(observer => {
    this.onRoleChange.subscribe((menu: any) => observer.next(this.getNewMenu()));
  });

  getNewMenu() {
    return [
      {
        name: 'Fruit',
        children: [
          {name: 'Apple'},
          {name: 'Banana'},
          {name: 'Fruit loops'},
        ]
      }, {
        name: 'Vegetables',
        children: [
          {
            name: 'Green',
            children: [
              {name: 'Broccoli'},
              {name: 'Brussels sprouts'},
            ]
          }, {
            name: 'Orange',
            children: [
              {name: 'Pumpkins'},
              {name: 'Carrots'},
            ]
          },
        ]
      },
    ];
  }
}
