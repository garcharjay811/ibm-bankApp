import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog } from "@angular/material/dialog";

import { AuthService } from './auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

const BACKEND_URL = environment.apiUrl + '/user/';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  userIsAuthenticated = false;
  userId: string;
  userDetails: any;
  check: boolean;

  addBalance: FormGroup;
  balanceControl = new FormControl(0, Validators.min(0));

  constructor(public authService: AuthService, private _snackBar: MatSnackBar, private http: HttpClient, private router: Router) {
    // this.addBalance = fb.group({
    //   balanceChange: this.balanceControl,
    // });
  }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    if (this.authService.autoAuthUser()) {
      this.userIsAuthenticated = true;
      console.log(this.authService.getUserId())
      this.userId = this.authService.getUserId();
      this.authService.getUserDetails(this.userId).subscribe(data => {
        this.userDetails = data;
      });
    }
    else {
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authStatusSub = this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
          this.userId = this.authService.getUserId();
          this.authService.getUserDetails(this.userId).subscribe(data => {
            this.userDetails = data;
          });
        });
    }
    this.addBalance = new FormGroup({
      funds: new FormControl(null, {
        validators: [Validators.required, Validators.min(0)]
      })
    });

    // console.log(this.userDetails);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  addFunds(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log(form)
    const data = {
      id: this.userId,
      amount: parseInt(form.value.funds)
    };
    console.log(data.amount)
    this.http.post<{ message: string }>(BACKEND_URL + 'addFunds', data).subscribe(response => {
      window.location.reload()
    });
  }

  async googleLogin() {
    this.authService.googleLogin();
  }

  logout() {
    this.authService.logout();
    window.location.reload()
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
