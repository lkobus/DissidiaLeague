import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { VendaBalcaoComponent } from './venda-balcao.component';
import { VendaBalcaoRetirarDinheiroComponent } from './venda-balcao-retirar-dinheiro.component';
import { VendaBalcaoSuprimentoComponent } from './venda-balcao-suprimento.component';
import { VendaBalcaoProdutosComponent } from './venda-balcao-produtos.component';
import { VendaBalcaoTrocaOperadorComponent } from './venda-balcao-troca-operador.component';
import { VendaBalcaoHistoricoComponent } from './venda-balcao-historico.component';
import { VendaBalcaoCancelarComponent } from './venda-balcao-cancelar.component';
import { VendaBalcaoRoutingModule } from './venda-balcao-routing.module';
import { CaixaService } from '../_services/caixa.service';
import { FileSaverService } from 'ngx-filesaver';
import { ToastService } from '../_services/toast.service';
import { VendaBalcaoService } from './services/venda-balcao.service';
import { SharedMaskModule } from '../shared-mask/shared-mask.module';
import { VendaBalcaoAberturaModule } from '../caixa/caixa.module';
import { SharedModule } from '../shared/shared.module';
import { AlertService } from '../_services/alert.service';
import { AuthenticationService } from '../_services/authentication.service';
import { ModalModule } from 'ngx-modal';
import { BusyModule, BusyConfig } from 'angular2-busy';
import { NgxPaginationModule } from 'ngx-pagination';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { VendaBalcaoMenuComponent } from './venda-balcao-menu.component';

@NgModule({
  imports: [
    CommonModule,
    ModalModule,
    VendaBalcaoRoutingModule,
    SharedMaskModule,
    SharedModule,
    VendaBalcaoAberturaModule,
    NgxPaginationModule,
    CurrencyMaskModule,
    BusyModule.forRoot(
      new BusyConfig({
        message: 'Aguarde...',
        backdrop: true,
        template:
          '<div class="loading-overlay">' +
          '<img src="assets/logo-promax-blue.png" alt="logo Promax" width="123" height="15" class="img-loader" />' +
          '<div class="spinner">' +
          '<div class="bounce1"></div>' +
          '<div class="bounce2"></div>' +
          '<div class="bounce3"></div>' +
          '</div>' +
          '<h1 class="loading-venda">' +
          '{{message}}' +
          '</h1>' +
          '</div>',
        delay: 0,
        minDuration: 1000,
        wrapperClass: 'ng-busy'
      })
    )
  ],
  declarations: [
    VendaBalcaoComponent,
    VendaBalcaoTrocaOperadorComponent,
    VendaBalcaoRetirarDinheiroComponent,
    VendaBalcaoProdutosComponent,
    VendaBalcaoSuprimentoComponent,
    VendaBalcaoHistoricoComponent,
    VendaBalcaoMenuComponent,
    VendaBalcaoCancelarComponent
  ],
  exports: [
    VendaBalcaoComponent,
    VendaBalcaoTrocaOperadorComponent,
    VendaBalcaoRetirarDinheiroComponent,
    VendaBalcaoProdutosComponent,
    VendaBalcaoSuprimentoComponent,
    VendaBalcaoHistoricoComponent,
    VendaBalcaoMenuComponent,
    VendaBalcaoCancelarComponent
  ],
  providers: [
    VendaBalcaoService,
    FileSaverService,
    ToastService,
    DecimalPipe
  ]
})
export class VendaBalcaoModule { }
