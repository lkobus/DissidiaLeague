import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedMaskModule } from '../shared-mask/shared-mask.module';
import { Modal } from 'ngx-modal';
import { AppComponent } from '../app.component';
import { Observable } from 'rxjs';

import { CaixaStatus, FormaPagamento } from '../_model/caixa-status';
import { LoginResponse, Questionario, QuestionarioOpcoes, GenericResponse } from '../_model/index';

import { CaixaService } from '../_services/caixa.service';
import { AuthenticationService } from '../_services/authentication.service';
import { AlertService } from '../_services/alert.service';

@Component({
    moduleId: module.id,
    selector: 'venda-balcao-troca-operador',
    templateUrl: 'venda-balcao-troca-operador.component.html'
})
export class VendaBalcaoTrocaOperadorComponent implements OnInit {
    @ViewChild('passwordAtualModal') modalAtual: Modal;
    @ViewChild('passwordNovoModal') modalNovo: Modal;

    statusCaixa: CaixaStatus;
    senhaAntiga: string;
    novoUsuario: string;
    novaSenha: string;
    constructor(private router: Router,
        public alert: AlertService,
        public authenticationService: AuthenticationService,
        private caixaService: CaixaService, public app: AppComponent)
    { }

    ngOnInit() {
        this.caixaService.statusCaixaEmitter.subscribe((data) => this.statusCaixa = data);
    }

    SaldoDinheiroCheque() {
        return CaixaStatus.GetSaldoDinheiroCheque(this.statusCaixa);
    }

    SaldoCartao(): number {
        return CaixaStatus.SaldoCartao(this.statusCaixa);
    }

    TrocarOperador() {
        this.alert.remove();
        this.authenticationService.login(this.novoUsuario, this.novaSenha)
            .flatMap((respose)=> this.caixaService.TrocaOperador())
            .subscribe(
            (data) => { },
            (err) => this.handleError(err),
            () => this.TrocaSuccess());
    }

    private TrocaSuccess() {
        this.modalNovo.close();
        this.alert.success('Troca efetuada com sucesso!');
    }

    ValidateLoggedUser() {
        this.alert.remove();
        this.authenticationService.validate(this.senhaAntiga)
            .subscribe(
            (data: LoginResponse) => { },
            (err) => this.handleError(err),
            () => this.OpenModalNovo());
    }

    OpenModal() {
        this.modalAtual.open();
        this.modalNovo.close();
        this.alert.remove();
    }

    OpenModalNovo() {
        this.modalAtual.close();
        this.modalNovo.open();
    }

    private handleError(error: GenericResponse) {
        if (error.message) {
            this.alert.error(error.message);
        }

        window.scrollTo(0, 0);
    }

    private GoBack() {
        this.router.navigate(['venda-balcao']);
    }
}
