import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RankingDetailComponent } from './detail/ranking-detail.component';
import { RankingComponent } from './ranking.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'ranking', component: RankingComponent },      
      { path: 'rankingDetail/:id', component: RankingDetailComponent }
    ])
  ],
  exports: [RouterModule]
})
export class RankingRoutingModule { }
