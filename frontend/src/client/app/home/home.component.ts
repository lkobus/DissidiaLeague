import { Component, OnInit } from '@angular/core';
import { CaixaService } from '../_services/caixa.service';
import { CaixaStatus } from '../_model/index';
import { PuxadaService } from '../puxada/services/puxada.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})
export class HomeComponent implements OnInit {
  private _showNavBar: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
    public showNavBarEmitter: Observable<boolean> = this._showNavBar.asObservable();
  statusCaixa: CaixaStatus;
  constructor(private caixaService: CaixaService,
    private puxadaService: PuxadaService)
  { }

  ngOnInit() {
    this._showNavBar.next(true);
    this.caixaService
      .GetStatusCaixaDiario()
      .map((status) => this.OnStatusCaixaLoaded(status))
      .subscribe();
  }

  private OnStatusCaixaLoaded(statusCaixa: CaixaStatus) {
    this.statusCaixa = statusCaixa;
  }

  private solicitarPuxada(): void {
    this.puxadaService.solicitarPuxada();
  }
}
