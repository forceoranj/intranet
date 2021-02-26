import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { AuthService } from "../auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    public authService: AuthService
  ) { }

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(6)]);
  hide = true;

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Il faut remplir ce champs';
    }

    return this.email.hasError('email') ? 'Ce n\'est pas un email valide' : '';
  }
  ngOnInit() { }

}
