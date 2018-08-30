import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxPaginationModule } from 'ngx-pagination';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-modal';

import { AlertService } from './_services/alert.service';
import { ToastService } from './_services/toast.service';
import { AuthenticationService } from './_services/authentication.service';
import { CaixaService } from './_services/caixa.service';
import { CepService } from './_services/cep.service';

import { FrequenciaVisitaModule } from './frequencia-visita/frequencia-vista.module';
import { VendaBalcaoModule } from './venda-balcao/venda-balcao.module';
import { VendaExternaModule } from './venda-externa/venda-externa.module';
import { EstoqueModule } from './estoque/estoque.module';
import { RetornoModule } from './retorno/retorno.module';
import { MapaEntregaModule } from './mapa-entrega/mapa-entrega.module';
import { ProdutosModule } from './produtos/produtos.module';
import { PuxadaModule } from './puxada/puxada.module';
import { FinancasModule } from './financas/financas.module';
import { PainelPerformanceModule } from './painel-performance/painel-performance.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { ClientesModule } from './clientes/clientes.module';
import { CadastroModule } from './cadastro/cadastro.module';
import { VendaBalcaoAberturaModule } from './caixa/caixa.module';
import { VisaoGeralModule } from './visao-geral/visao-geral.module';
import { HomeModule } from './home/home.module';
import { LoginModule } from './login/login.module';
import { ConfiguracoesModule } from './configuracoes/configuracoes.module';
import { SharedModule } from './shared/shared.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ComodatosModule } from './comodatos/comodatos.module';
import { ImageUploadModule } from './angular2-image-upload/index';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ManuntencaoFrequenciaModule } from './manuntencaoFrequencia/manuntencao-frequencia.module';
import { NguiMapModule } from '@ngui/map';
import { DragulaModule } from 'ng2-dragula';
import { EntradaNotaModule } from './entrada-nota/entrada-nota.module';
import { NotaFiscalModule } from './notas-fiscais/nota-fiscal.module';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { NotificacaoModule } from './notificacao/notificacao.module';
import { StatusModule } from './status/status.module';
import { CaminhaoModule } from './caminhao/caminhao.module';
import { FornecedorModule } from './fornecedor/fornecedor.module';
import { ConfiguracoesFinanceirasModule } from './configuracoes-financeiras/configuracoes-financeiras.module';
import { IndicadorMetaModule } from './indicador-meta/indicador-meta.module';
import { SharedMaskModule } from './shared-mask/shared-mask.module'
import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';

import { AngularEchartsModule } from 'ngx-echarts';
import { ModalConfirmacaoModule } from './_directives/modal-confirmacao/modal-confirmacao.module';
import { RankingModule } from './ranking/ranking.module';
import { MatchesModule } from './matches/matches.module';
import { ProfileModule } from './profiles/profile.module';
import { ChartsModule } from 'ng4-charts';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    SharedMaskModule,
    ReactiveFormsModule,
    NguiAutoCompleteModule,
    FormsModule,
    NgxPaginationModule,
    IndicadorMetaModule,
    HttpModule,
    RouterModule,
    NguiMapModule.forRoot({ apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyA6WJdTagOlIHvsNbj9BC0mZFmMmtTT0Ls' }),
    Angulartics2Module.forRoot([Angulartics2GoogleAnalytics]),
    SharedModule.forRoot(),
    ImageUploadModule.forRoot(),
    ModalModule,
    AppRoutingModule,
    VendaBalcaoModule,
    EntradaNotaModule,
    NotaFiscalModule,
    VendaExternaModule,
    ConfiguracoesModule,
    CaminhaoModule,
    NotificacaoModule,
    StatusModule,
    FornecedorModule,
    ConfiguracoesFinanceirasModule,
    EstoqueModule,
    RetornoModule,
    MapaEntregaModule,
    ManuntencaoFrequenciaModule,
    ProdutosModule,
    HomeModule,
    PuxadaModule,
    DragulaModule,
    FinancasModule,
    PainelPerformanceModule,
    PedidosModule,
    ClientesModule,
    CadastroModule,
    VisaoGeralModule,
    UsuariosModule,
    ChartsModule,
    RankingModule,
    ProfileModule,
    MatchesModule,
    ComodatosModule,
    FrequenciaVisitaModule,
    LoginModule,
    AngularEchartsModule,
    VendaBalcaoAberturaModule,
    ModalConfirmacaoModule
  ],
  declarations: [AppComponent],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '<%= APP_BASE %>'
    },
    AlertService,
    CaixaService,
    ToastService,
    AuthenticationService,
    CepService, Angulartics2GoogleAnalytics
  ],
  bootstrap: [AppComponent]

})
export class AppModule { }
