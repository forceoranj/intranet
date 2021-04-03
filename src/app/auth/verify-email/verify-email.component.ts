import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth.service";

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  emailToVerify: string;

  constructor(
    public authService: AuthService
  ) {
    authService.emailToVerify()
    .then(emailToVerify => this.emailToVerify = emailToVerify);
  }

  ngOnInit(): void {
  }

}
