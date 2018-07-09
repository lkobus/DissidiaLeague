import { CommonModule } from '@angular/common';
import { Modal } from 'ngx-modal';
import { FormsModule, NgModel } from '@angular/forms';
import { AppComponent } from '../app.component';
import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { ConfiguracoesFinanceirasService } from './shared/configuracoes-financeiras.service';
import { BancoService } from './shared/banco.service';
import { ToastService } from '../_services/toast.service';
import { ConfiguracoesFinanceiras } from './model/configuracoes-financeiras';
import { Banco } from './model/banco';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  moduleId: module.id,
  selector: 'sd-configuracoes-financeiras',
  templateUrl: 'configuracoes-financeiras.component.html',
})
export class ConfiguracoesFinanceirasComponent implements OnInit {

  data: Banco[] = [];
  configuracaoBanco: ConfiguracoesFinanceiras;
  bancoId: string;
  dadosConfiguracoes: ConfiguracoesFinanceiras[] = [];

  constructor(private configService: ConfiguracoesFinanceirasService,
    private bancoService: BancoService,
    private _toastService: ToastService) { }

  ngOnInit() {
    this.configuracaoBanco = this.criarInstancia(null);
    this.loadValues();
  }

  getBancoEscolhido(): void {
    this.configService.getConfiguracoesFinanceirasById(this.bancoId)
      .subscribe(dados => {
        this.configuracaoBanco = dados == null ? this.criarInstancia(this.bancoId) : dados;
      }, err => {
        console.log(err);
        this._toastService.errorNotification('', 'Ocorreu um erro ao buscar o bando selecionado');
      });
  }

  save(): void {
    this.configService.salvarConfiguracoesFinanceiras(this.configuracaoBanco)
      .subscribe(data => {
        console.log(data);
        this._toastService.sucessNotification('', 'Configurações salvas com Sucesso.');
      }, err => {
        console.log(err);
        this._toastService.errorNotification('', 'Ocorreu algum erro ao salvar.');
      });
  }

  changeBancoSelecionado(bancoId: string) {
    this.bancoId = bancoId;
    this.getBancoEscolhido();
  }

  private loadValues(): void {
    this.bancoService.getBancos()
      .toPromise()
      .then(response => {
        this.data = response;
        this.setBanco(response);
      });
  }

  private setBanco(response: Banco[]) {
    if (response.length > 0) {
      this.bancoId = response[0].DocumentId;
      this.getBancoEscolhido();
    }
  }

  private criarInstancia(bancoId: string): ConfiguracoesFinanceiras {
    return new ConfiguracoesFinanceiras(bancoId, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
  }
}