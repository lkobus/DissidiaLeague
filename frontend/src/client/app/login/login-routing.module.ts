import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthGuard } from '../_guards/index';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: LoginComponent, canActivate: [AuthGuard] },
      { path: 'login', component: LoginComponent },
    // otherwise redirect to home
      { path: '**', redirectTo: '' }
    ])
  ],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
