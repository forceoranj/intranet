import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { AuthService } from "../auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(
    public authService: AuthService
  ) { }

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(6)]);
  hide = true;

  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Il faut entrer un email';
    }

    return this.email.hasError('email') ? 'Ce n\'est pas un email valide' : '';
  }

  getPasswordErrorMessage() {
    if (this.password.hasError('required')) {
      return 'Il faut entrer un mot de passe';
    }

    return this.password.hasError('minlength') ? 'Il faut un mot de passe plus long' : '';
  }
  ngOnInit() { }

}
