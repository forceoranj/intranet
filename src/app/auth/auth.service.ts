import { Injectable } from '@angular/core';
import { Router } from  "@angular/router";
import * as _ from 'lodash-es';
import { User } from  "../classes/user";
import { AngularFireAuth } from  "@angular/fire/auth";
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: User;
  onChange: Observable<boolean>;  //True if authed
  authed: boolean;
  currentUser: any;

  constructor(
    private toastr: ToastrService,
    public auth: AngularFireAuth,
    public router:  Router
  ) {
    console.log("auth.authState.subscribe init")
    this.auth.authState.subscribe(currentUser => {
      console.log("auth.authState.subscribe called", currentUser)
      this.updateAuthStatus(currentUser);
    });

    this.onChange = new Observable<boolean>(subscriber => {
      console.log("authService onChange called")
      subscriber.next(this.updateAuthStatus(this.currentUser));
    });

    this.auth.currentUser
    .then(currentUser => this.updateAuthStatus(currentUser));
  }


  updateAuthStatus(currentUser: any): boolean {
    console.log("whenAuthed: auth changed", currentUser);
    this.currentUser = currentUser;

    if (currentUser) {
      if (currentUser.emailVerified) {
        console.log("whenAuthed: just calling after auth changed");
        this.authed = true;
      }
      else {
        console.log("whenAuthed: email yet to verify");
        this.authed = false;
      }
    }
    else {
      console.log("deauthed");
      this.authed = false;
    }

    return this.authed;
  }


  async login(email: string, password: string) {
    try {
      console.log("login called");
      const result = await this.auth.signInWithEmailAndPassword(email, password);
      console.log("result", result);
      if (!result.user.emailVerified) {
        this.toastr.info("Un email vous a été envoyé. Il faut cliquer sur son lien pour finir l'inscription.");
        return;
      }
      //else
      this.updateAuthStatus(await this.auth.currentUser)
      this.router.navigate(['']);
    } catch(e) {
      if (e.code === "auth/user-not-found") {
        this.toastr.error("Cet email est inconnu.");
      }
      else {
        this.toastr.error(e.message, 'Erreur');
      }
    }

  }

  async logout() {
    this.auth.signOut();
    this.router.navigate(['login']);
  }

  async register(email: string, password: string) {
    try {
      await this.auth.createUserWithEmailAndPassword(email, password);
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

  get isVerifiedUser(): Promise<boolean> {
    return (async () => {
      console.log("isVerifiedUser");
      if (!await this.onAuth()) {
        console.log("isVerifiedUser false");
        return false;
      }
      //else
      return (await this.auth.currentUser).emailVerified !== false;
    })();
  }

  get isLoggedIn(): Promise<boolean> { //TODO1 replace by isUser in roles.service
    return (async () => {
      const user = await this.auth.currentUser;
      return (user !== null && user.emailVerified !== false) ? true : false;
    })();
  }

  async emailToVerify(): Promise<string> {
    return (await this.auth.currentUser).email;
  }

  get uid(): Promise<string> {
    return (async () => {
      const user = await this.auth.currentUser;
      return user && user.uid || "";
    })();
  }

  async onAuth(): Promise<boolean> {
    if (this.authed !== null) {
      return this.authed;
    }
    console.log("whenAuthed: registering");
    return new Promise<boolean>(resolve => {
      this.onChange.subscribe((authed) => {
        console.log("whenAuthed: resolved");
        resolve(authed);
      });
    });
  }

}
