import { Component, OnInit, Output, Input, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { ResumoGeralService } from './service/resumo-geral.service';
import { ResumoGeral } from './model/resumo-geral';
import {Subscription} from 'rxjs/Subscription';

@Component({
    moduleId: module.id,
    selector: 'visao-geral-vendas-agrupadas',
    templateUrl: 'visao-geral-vendas-agrupadas.component.html'
})
export class VisaoGeralVendasAgrupadasComponent {
    @Output() isLoading: boolean = false;
    @Output() dataLoaded = new EventEmitter();
    @Input("dateFilter") dateFilter: any;

    valores: ResumoGeral[];
    busy: Subscription;

    constructor(private resumoService: ResumoGeralService) {
    }

    ngOnChanges(changes: SimpleChange) {
        this.ChangeFilter();
    }

    GetLabel(): string {
        return this.dateFilter.path;
    }

    private ChangeFilter() {
        this.isLoading = true;
        this.valores = [];
        this.busy = this.resumoService
            .GetResumo(this.dateFilter.path)
            .map((valores) => this.OnResumoLoaded(valores))
            .subscribe();
    }

    private OnResumoLoaded(valores: ResumoGeral[]) {
        this.valores = valores.filter(valor => valor.tipo != ResumoGeral.Saida);
        this.isLoading = false;
        this.dataLoaded.emit(valores);
    }
}
