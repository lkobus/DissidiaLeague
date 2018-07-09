import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StatusComponent } from './status.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'status', component: StatusComponent }
      
    ])
  ],
  exports: [RouterModule]
})
export class StatusRoutingModule { }
