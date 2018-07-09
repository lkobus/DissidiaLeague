import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import { VendaBalcaoAberturaModule } from '../caixa/caixa.module';

@NgModule({
  imports: [ HomeRoutingModule, SharedModule, VendaBalcaoAberturaModule ],
  declarations: [ HomeComponent ],
  exports: [ HomeComponent ]
})
export class HomeModule { }
