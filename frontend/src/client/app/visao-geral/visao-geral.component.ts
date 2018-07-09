import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ResumoGeralService } from './service/resumo-geral.service';
import { EstoqueService } from '../estoque/services/estoque.service';
import { FinanceiroService } from '../financas/services/financas.service';
import { ResumoGeral } from './model/resumo-geral';
import { Estoque } from '../estoque/model/estoque';
import { ExtratoFinanceiro, Status, Titulo, Categoria, TipoTitulo, FinalidadeCategoriaEnum, FormaPagamento, Remessas } from '../financas/model/financas';

@Component({
  moduleId: module.id,
  selector: 'visao-geral',
  templateUrl: 'visao-geral.component.html',
  styleUrls: ['visao-geral.component.css']
})
export class VisaoGeralComponent {

  optionFilter: any;
  dateFilter: string;
  filterOptions: any[];
  entradasAtual: number = 0;
  entradasAnterior: number = 0;
  saidasAtual: number = 0;
  saidasAnterior: number = 0;
  estoqueExterno: Estoque[];
  estoqueBalcao: Estoque[];
  valores: ResumoGeral[];

  constructor(private financasService: FinanceiroService,
    private resumoService: ResumoGeralService,
    private estoqueService: EstoqueService) {

    this.filterOptions = [{
      "key": "1",
      "value": "Esta Semana",
      "path": "semana",
      "label": "Semana"
    }, {
      "key": "2",
      "value": "Este Mês",
      "path": "mes",
      "label": "Mês"
    }, {
      "key": "3",
      "value": "Últimos três meses",
      "path": "trimestre",
      "label": "Trimestre ano"
    }, {
      "key": "4",
      "value": "Este ano",
      "path": "ano",
      "label": "Ano"
    }];
  }

  ngOnInit() {
    this.dateFilter = this.filterOptions[0].path;
    this.optionFilter = this.filterOptions.find(p => p.path === this.dateFilter);
    this.GetEstoqueBalcao();
    this.GetEstoqueExterno();
  }

  GetLabel(): string {
    return this.optionFilter.label;
  }

  OnFilterChanged(path: string) {
    this.dateFilter = path;
    this.optionFilter = this.filterOptions.find(p => p.path === path);
  }

  OnDataLoaded(valores: ResumoGeral[]) {
    this.entradasAtual = 0;
    this.entradasAnterior = 0;
    this.saidasAtual = 0;
    this.saidasAnterior = 0;
    valores.forEach(element => {
      if (element.tipo == ResumoGeral.Saida) {
        this.saidasAtual += element.valorAtual;
        this.saidasAnterior += element.valorAnterior;
      } else {
        this.entradasAtual += element.valorAtual;
        this.entradasAnterior += element.valorAnterior;
      }
    });
  }

  GetEstoqueBalcao() {
    this.estoqueBalcao = [];
    this.estoqueService.getEstoqueBalcaoTodos()
      .subscribe((data) => {
        this.estoqueBalcao = this.SortList(data);
      });
  }

  GetEstoqueExterno() {
    this.estoqueExterno = [];
    this.estoqueService.getEstoqueExternoTodos()
      .subscribe((data) => {
        this.estoqueExterno = this.SortList(data);
      });
  }

  IsEstoqueBaixo(estoque: Estoque): boolean {
    return estoque.Quantidade <= estoque.EstoqueMinimo;
  }

  private SortList(list: Estoque[]): Estoque[] {
    return list.sort((a, b) => a.Quantidade < b.Quantidade ? -1 : 1);
  }

  
  public sortingDesc: boolean = false;
  sortList(list: any[], property: string) {
      this.sortingDesc = !this.sortingDesc;
      let direction = this.sortingDesc ? 1 : -1;
      let temp = property.split('.');
      let first = temp[0];
      let second = temp.length > 1 ? temp[1] : '';
      list = list.sort((a, b) => {
          if (this.GetProperty(a, first, second) < this.GetProperty(b, first, second)) {
              return -1 * direction;
          } else if (this.GetProperty(a, first, second) > this.GetProperty(b, first, second)) {
              return 1 * direction;
          }
          return 0;
      });
  }

  GetProperty(value: any, first: string, second: string): any {
      
      var temp = value[first];
      if (second != '') {
          temp = value[first][second];
      }

      if(typeof temp === 'number') {
          return Number(temp);
      }
      return temp;
  }
}
