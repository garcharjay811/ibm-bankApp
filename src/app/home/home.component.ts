import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // isLoading = false;
  // private authStatusSub: Subscription;

  // constructor(public authService: AuthService) {}

  ngOnInit() {
    // this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
    //   authStatus => {
    //     this.isLoading = false;
    //   }
    // );
    console.log("Hi");
  }

  googleLogin() {
    // this.authService.googleLogin();
  }

  // ngOnDestroy() {
    // this.authStatusSub.unsubscribe();
  // }
}
