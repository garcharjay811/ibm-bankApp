import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OAuthComponent } from "./auth/oauth/oauth.component";
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  // { path: 'auth',
  //   loadChildren: () =>
  //     import('./auth/auth.module').then(
  //       (m) => m.AuthModule
  //     )
  // }
  {
    path: 'auth', component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
