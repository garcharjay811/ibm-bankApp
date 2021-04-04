import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// import { AngularMaterialModule } from '../angular-material.module';
import { AuthRoutingModule } from './auth-routing.module';
import { OAuthComponent } from './oauth/oauth.component';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [OAuthComponent],
  imports: [CommonModule, FormsModule, AuthRoutingModule],
  providers: [ CookieService ]
})
export class AuthModule {}
