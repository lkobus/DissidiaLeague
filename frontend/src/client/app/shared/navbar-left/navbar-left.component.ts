import { Component } from '@angular/core';
import { Modulo } from '../../_model/modulo';
import { AppComponent } from '../../app.component';
import { CaixaService } from '../../_services/caixa.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { CaixaStatus } from '../../_model/caixa-status';

@Component({
  moduleId: module.id,
  selector: 'sd-navbar-left',
  templateUrl: 'navbar-left.component.html',
  styleUrls: ['navbar-left.component.css'],
})
export class NavbarLeftComponent {
  showModulos: boolean = false;
  statusCaixa: CaixaStatus;
  version:string;
  constructor(private app: AppComponent, private caixaService: CaixaService, private authenticationService: AuthenticationService) {
    this.authenticationService.showModulosEmitter.subscribe((mode) =>
    {
      debugger;
      this.showModulos = mode;
    });
    this.caixaService.statusCaixaEmitter.subscribe((status: CaixaStatus) => this.statusCaixa = status);
    this.authenticationService.getCurrentVersion()
    .subscribe(r => this.version = r.json());
  }

}
