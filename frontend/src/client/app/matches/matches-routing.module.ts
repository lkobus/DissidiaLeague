import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatchesComponent } from './matches.component';
import { MatchesDetailComponent } from './detail/matches-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'matches', component: MatchesComponent },      
      { path: 'matchDetail/:id', component: MatchesDetailComponent }
    ])
  ],
  exports: [RouterModule]
})
export class MatchesRoutingModule { }
