import { Component, OnInit, OnDestroy} from '@angular/core';
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
      // console.log(this.userDetails);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  addFunds(form: NgForm) {
    if(form.invalid) {
      return;
    }
    const data = {
      id: this.userId,
      amount: form.value.funds
    };
    this.http.post<{message: string}>(BACKEND_URL + 'addFunds', data).subscribe(response => {
      console.log(response);
    });
  }

  async googleLogin() {
    this.authService.googleLogin();
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
