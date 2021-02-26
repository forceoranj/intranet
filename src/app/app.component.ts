import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Tour of Heroes';
  
  ngOnInit() {
    // firebase.auth().onAuthStateChanged(function(user) {
    // if (user) {
    //   // User is signed in.
    // } else {
    //   // No user is signed in.
    // }
  }
}
