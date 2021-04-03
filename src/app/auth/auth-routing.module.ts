import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OAuthComponent } from './oauth/oauth.component';

const routes: Routes = [
  { path: 'oauth', component: OAuthComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
