import {
    Component, OnInit, EventEmitter, Output, ViewChild, ElementRef
} from '@angular/core';
import { Router } from '@angular/router';
import { Caminhao } from './model/caminhao';
import { ModalModule, Modal } from 'ngx-modal';
import { Subject } from 'rxjs/Subject';
import { CaminhaoService } from './shared/caminhao.service';
import { ToastService } from '../_services/toast.service';
import { ModalConfirmacaoComponent } from '../_directives/modal-confirmacao/modal-confirmacao.component';

@Component({
    moduleId: module.id,
    selector: 'sd-caminhao',
    templateUrl: 'caminhao.component.html'
})
export class CaminhaoComponent implements OnInit {

    @ViewChild('modalConfirmar')
    modalConfirmacao: ModalConfirmacaoComponent;

    @Output()
    searchChangeEmitter: EventEmitter<any> = new EventEmitter<any>();

    isLoading: boolean;
    selectedRow: Caminhao;
    dados: Caminhao[];

    private caminhoes: Caminhao[];
    private searchUpdated: Subject<string> = new Subject<string>();

    constructor(private _toastService: ToastService, private caminhaoService: CaminhaoService) {
        this.searchChangeEmitter = <any>this.searchUpdated.asObservable()
            .debounceTime(500)
            .distinctUntilChanged()
            .subscribe(item => this.filter(item, this.caminhoes));
    }

    ngOnInit() {
        this.LoadValues();
    }

    LoadValues(): void {
        this.isLoading = true;
        this.caminhaoService.getCaminhoes()
            .toPromise()
            .then(caminhao => { this.caminhoes = caminhao; this.dados = caminhao; })
            .then(caminhoes => this.isLoading = false);
    }

    onSelect(item: Caminhao): void {
        this.selectedRow = item;
    }

    abrirConfirmacaoExclusao(caminhao: Caminhao) {
        this.modalConfirmacao.openModal('Deseja realmente o caminhão com placa "' + caminhao.Placa + '"?', caminhao);
    }

    excluirCaminhao(caminhao: Caminhao): void {
        this.caminhaoService.deleteCaminhao(caminhao).subscribe(() => {
            this.dados.splice(this.dados.indexOf(caminhao), 1);
            this._toastService.sucessNotification('', 'Caminhão removido com sucesso.');
        });
    }

    formatarPlaca(placa: string): string {
        if (!placa) {
            return '';
        }
        let regex = /^([a-zA-Z]+)(\d+)$/g;
        let matchs = regex.exec(placa.toLocaleUpperCase());
        if (matchs && matchs.length == 3) {
            placa = matchs[1] + '-' + matchs[2];
        }
        return placa;
    }

    private onSearchType(value: string) {
        this.searchUpdated.next(value);
    }

    filter(searchText, list: Caminhao[]) {
        var textoBusca = '';
        if (searchText) {
            textoBusca = searchText.toLowerCase();
        }

        this.dados = list.filter(function (caminhao) {
            var find = false;
            var matchFilter = false;
            if (caminhao.Placa.toLowerCase().indexOf(textoBusca) > -1) {
                find = true;
            }
            return find;
        });
    }
}