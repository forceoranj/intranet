import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FormControl, Validators} from '@angular/forms';
import { AuthService } from "../auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
   return = '';
   email = new FormControl('', [Validators.required, Validators.email]);
   password = new FormControl('', [Validators.required, Validators.minLength(6)]);
   hide = true;

  constructor(
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    authService.onAuth()
    .then(auth => {
      if (auth) {
        this.router.navigateByUrl(this.return);
      }
    });
  }


  ngOnInit() {
    this.route.queryParams
    .subscribe(params => this.return = params['return'] || '');
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Il faut remplir ce champs';
    }

    return this.email.hasError('email') ? 'Ce n\'est pas un email valide' : '';
  }

}
