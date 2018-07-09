import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisaoGeralComponent } from './visao-geral.component';
import { VisaoGeralProdutosMaisVendidosComponent } from './visao-geral-mais-vendidos.component';
import { VisaoGeralHistoricoVendasComponent } from './visao-geral-historico-vendas.component';
import { VisaoGeralVendasAgrupadasComponent } from './visao-geral-vendas-agrupadas.component';
import { VisaoGeralRoutingModule } from './visao-geral-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ResumoGeralService } from './service/resumo-geral.service';
import { BusyModule, BusyConfig } from 'angular2-busy';
import { AngularEchartsModule } from 'ngx-echarts';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule, VisaoGeralRoutingModule, SharedModule,
    BusyModule,
    NgxPaginationModule,
    AngularEchartsModule
  ],
  declarations: [
    VisaoGeralComponent,
    VisaoGeralVendasAgrupadasComponent,
    VisaoGeralHistoricoVendasComponent,
    VisaoGeralProdutosMaisVendidosComponent
  ],
  exports: [
    VisaoGeralComponent,
    VisaoGeralHistoricoVendasComponent,
    VisaoGeralVendasAgrupadasComponent,
    VisaoGeralProdutosMaisVendidosComponent
  ],
  providers: [ResumoGeralService]
})
export class VisaoGeralModule { }
