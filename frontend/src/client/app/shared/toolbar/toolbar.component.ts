import { Component, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthenticationService } from '../../_services/authentication.service';
import { Empresa } from '../../_model/index';
import { AppComponent } from '../../app.component';
import { EnvConfiguration } from '../../shared/config/env.config';
import { NotificacaoService } from '../../notificacao/shared/notificacao.service';
import { StatusService } from '../../status/shared/status.service';
import { Notificacao } from '../../notificacao/model/notificacao';
import { NomeFantasiaEmpresa } from '../../_model/nome-fantasia';
import { Modulo } from '../../_model/modulo';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { EmpresaService } from '../../_services/empresa.service';
import { Modal } from 'ngx-modal';

@Component({
  moduleId: module.id,
  selector: 'sd-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  @ViewChild('modalSobra') modalSobra: Modal;
  fileHolder: any;
  downloadNewVersion: string;
  numeroCaixa: number;
  franquia: Empresa;
  downloadPercent: number = 0;
  userLogged: string;
  modulosDisponiveis: boolean = false;
  nomeFranquia: string;
  msg: string = "Atualizando o sistema. Aguarde : 0%";
  ultimaVersao: string;
    templateLoading: string =
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
        '</div>';
    busy: any;

  currentVersion: string;
  notificacaoService: NotificacaoService;
  statusService: StatusService;
  public lang: string;

  private subscription: Subscription;

  constructor(
    private authenticationService: AuthenticationService,
    private app: AppComponent,
    private empresaService: EmpresaService,
    notificacaoService: NotificacaoService,
    statusService: StatusService) {
    this.franquia = app.getFranquia();
    this.numeroCaixa = EnvConfiguration.CAIXA;
    this.subscription = this.authenticationService.loggedUserEmitter.subscribe(name => this.userLogged = name);
    this.authenticationService.showModulosEmitter.subscribe((mode) => this.modulosDisponiveis = mode);
    this.notificacaoService = notificacaoService;
    this.statusService = statusService;

    try {
      this.lang = localStorage.getItem('lang') || 'en';
    } catch (e) {
      // Handle any errors (e.g. "SecurityError: The operation is insecure." if client blocks cookies.)
      this.lang = 'pt-br';
    }
  }
  
  imageUploaded(event: any): void {
    this.fileHolder = event;
  }

  ngOnInit() {
    this.getEmpresaNomeFantasia();
    this.loadNotificacoes();    
  }

  getEmpresaNomeFantasia() {
    this.empresaService.getNomeFantasia()
        .subscribe(response => {
          this.nomeFranquia = response.NomeFantasia;
        });
  }
  uploadMatch() {
    debugger;
    if (this.fileHolder !== undefined) {
      debugger;
      this.empresaService.uploadImagem(this.fileHolder);
      this.modalSobra.close();
      alert("Imagem subida com sucesso");
    }
  }

  loadNotificacoes() {
   /* IntervalObservable.create(2000)
    .takeWhile(() => true)
    .subscribe(() => {
      this.notificacaoService.requestNotificacoesNaoLidas();
    });*/    
  }

  marcarComoLida(event: any, notificacao: Notificacao): void {
    if (event) event.stopPropagation();
    this.notificacaoService.marcarNotificacaoComoLida(notificacao);
  }

  getUrlImagemNotificacao(imagemUri: string): string {
    return this.notificacaoService.getUrlImagemNotificacao(imagemUri);
  }

  logout() {
    this.authenticationService.logout();
  }  

  public selectLanguage = (lang: string) => {
    try {
      localStorage.setItem('lang', lang);
    } catch (e) {
      // Handle any errors (e.g. "SecurityError: The operation is insecure." if client blocks cookies.)
    }
    window.location.href = '/home';
  }
}

