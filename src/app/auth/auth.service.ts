import { Injectable } from '@angular/core';
import { Router } from  "@angular/router";
import * as _ from 'lodash-es';
import { User } from  "../classes/user";
import { AngularFireAuth } from  "@angular/fire/auth";
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: User;
  onChangeSubscribers: Subscriber<boolean>[] = [];
  onChange: Observable<boolean> = new Observable<boolean>(subscriber => {
    this.onChangeSubscribers.push(subscriber);
  });  //True if authed
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
      this.onChangeSubscribers.forEach(subscriber => subscriber.next(this.currentUser));
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
      localStorage.setItem("user", JSON.stringify(currentUser));
      JSON.parse(localStorage.getItem("user"));
    }
    else {
      console.log("deauthed");
      this.authed = false;
      localStorage.setItem("user", null);
      JSON.parse(localStorage.getItem("user"));
    }

    return this.authed;
  }


  async login(email: string, password: string): Promise<void> {
    try {
      console.log("login called");
      // const result = await this.auth.setPersistence('local')
      // .then(() => {
      //   return this.auth.signInWithEmailAndPassword(email, password);
      // })
      // .catch((error) => {
      //   this.toastr.error(`Erreur de persistence #${error.code}: ${error.message}`);
      // });
      const result = await this.auth.signInWithEmailAndPassword(email, password);
      console.log("result", result);
      if (!result) {
        return;
      }
      if (!result.user.emailVerified) {
        this.toastr.info("Un email vous a été envoyé. Il faut cliquer sur son lien pour finir l'inscription.");
        return;
      }
      //else
      this.updateAuthStatus(await this.auth.currentUser);
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
    localStorage.setItem("user", null);
    await this.auth.signOut();
    setTimeout(() => this.router.navigate(['/login']));
  }

  async register(email: string, password: string) {
    try {
      await this.auth.createUserWithEmailAndPassword(email, password);
      await this.sendEmailVerification();
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
    this.toastr.success('Email de verification envoyé !');
  }

  async sendPasswordResetEmail(passwordResetEmail: string) {
    await this.auth.sendPasswordResetEmail(passwordResetEmail);
    this.toastr.success('Email de réinitialisation de mot de passe envoyé !');
  }

  get isVerifiedUser(): Promise<boolean> {

    // const user = JSON.parse(localStorage.getItem('user'));
    // return (user !== null && user.emailVerified !== false) ? true : false;
    //return new Promise<boolean>(resolve => resolve(true));

    return (async () => {
      console.log("isVerifiedUser");
      if (!await this.onAuth()) {
        console.log("isVerifiedUser false");
        return false;
      }
      //else
      const currentUser = await this.auth.currentUser;
      console.log("currentUser in isVerifiedUser", currentUser);
      return currentUser?.emailVerified !== false;
    })();
  }

  async emailToVerify(): Promise<string> {
    return (await this.auth.currentUser)?.email || "";
  }

  get uid(): Promise<string> {
    return (async () => {
      const user = await this.auth.currentUser;
      return user && user.uid || "";
    })();
  }

  async onAuth(): Promise<boolean> {
    if (this.authed !== null) {
      console.log("this.authed onAuth", this.authed);
      return this.authed;
    }
    console.log("onAuth: registering");
    return new Promise<boolean>(resolve => {
      this.onChange.subscribe((authed) => {
        console.log("onAuth: resolved", authed);
        resolve(authed);
      });
    });
  }

  async waitForValidAuth(): Promise<boolean> {
    if (this.authed) {
      return this.authed;
    }
    console.log("onValidAuth: registering");
    return new Promise<boolean>(resolve => {
      this.onChange.subscribe((authed) => {
        console.log("onValidAuth: resolved", authed);
        if (authed) {
          resolve(true);
        }
      });
    });
  }

}
