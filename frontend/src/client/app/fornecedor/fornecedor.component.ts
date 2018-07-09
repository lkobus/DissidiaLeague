import { CommonModule } from '@angular/common';
import { Modal } from 'ngx-modal';
import { FormsModule, NgModel, NG_VALIDATORS, Validator, Validators, AbstractControl, Form, ValidatorFn } from '@angular/forms';
import { AppComponent } from '../app.component';
import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { FornecedorService } from './service/fornecedor.service';
import { ToastService } from '../_services/toast.service';
import { Fornecedor } from './model/fornecedor';


import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  moduleId: module.id,
  selector: 'sd-fornecedor',
  templateUrl: 'fornecedor.component.html',
})
export class FornecedorComponent implements OnInit {

  restError: any;
  restSuccess: any;
  isLoading: boolean;
  submitted = false;

  newFornecedor: Fornecedor[] = [];
  removeFornecedor: Fornecedor[] = [];
  cnpjRepetido: any[] = [];

  constructor(
    private router: Router,
    private _toastService: ToastService,
    private fornecedor: FornecedorService
  ) { }

  getConfiguracoes(): void {
    this.newFornecedor = [];
    this.removeFornecedor = [];
    this.isLoading = true;
    this.fornecedor.getFornecedores()
      .subscribe((fornecedor) => {
        this.newFornecedor = fornecedor;
        this.isLoading = false;
      }, err => {
        this._toastService.errorNotification('Erro', 'Algo inesperado ocorreu buscar os Fornecedores.');
        console.log(err);
      });
  }

  ngOnInit() {
    this.getConfiguracoes();
  }

  save(): void {
    var contemNull = false;
    var contemCnpjRepetido = false;
    var validaCnpj = false;

    this.newFornecedor.forEach(p => {
      if (p.RazaoSocial == null || p.RazaoSocial == "") {
        contemNull = true;
      }

      this.cnpjRepetido = this.newFornecedor.filter(f => f.CNPJ == p.CNPJ);
      if (!contemCnpjRepetido) {
        contemCnpjRepetido = this.cnpjRepetido.length > 1;
      }
    });

    if (this.validaCnpj(this.newFornecedor)) {
      validaCnpj = true;
    }

    if (contemNull) {
      this.cnpjRepetido = [];
      this._toastService.errorNotification('', 'Razão Social obrigátorio.');
    } else if (contemCnpjRepetido) {
      this.cnpjRepetido = [];
      this._toastService.errorNotification('', 'CNPJ não podem ser repetidos.');
    } else if (!validaCnpj) {
      this.cnpjRepetido = [];
      this._toastService.errorNotification('', 'CNPJ Inválido.');
    } else {
      this.restError = null;
      this.restSuccess = null;

      this.fornecedor.salvarFornecedor(this.newFornecedor, this.removeFornecedor)
        .subscribe(data => {
          console.log(data);
          this._toastService.sucessNotification('', 'Fornecedor salvo com Sucesso.');
          this.cnpjRepetido = [];
        }, err => {
          console.log(err);
          this._toastService.errorNotification('', 'Ocorreu algum erro ao salvar.');
        });
    }
  }

  validaCnpj(fornecedor: Fornecedor[]): boolean {
    var retorno;
    fornecedor.forEach(fornecedor => {
      var cnpj = fornecedor.CNPJ;
      if (this.regexValidCnpj(cnpj)) {
        retorno = true;
      } else {
        retorno = false;
      }
    });
    return retorno;
  }

  regexValidCnpj(cnpj: any) {
    if(cnpj != null){
       cnpj = cnpj.replace(/[^\d]+/g, '');
      
          if (cnpj == '') return true;
      
          if (cnpj.length != 14)
            return false;
      
        // Elimina CNPJs invalidos conhecidos
        if (cnpj == "00000000000000" ||
            cnpj == "11111111111111" ||
            cnpj == "22222222222222" ||
            cnpj == "33333333333333" ||
            cnpj == "44444444444444" ||
            cnpj == "55555555555555" ||
            cnpj == "66666666666666" ||
            cnpj == "77777777777777" ||
            cnpj == "88888888888888" ||
            cnpj == "99999999999999")
            return false;
      
          // Valida DVs
          var tamanho = cnpj.length - 2;
          var numeros = cnpj.substring(0, tamanho);
          var digitos = cnpj.substring(tamanho);
          var soma = 0;
          var pos = tamanho - 7;
      
          for (var i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
              pos = 9;
          }
          var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
          if (resultado != digitos.charAt(0))
            return false;
      
          tamanho = tamanho + 1;
          numeros = cnpj.substring(0, tamanho);
          soma = 0;
          pos = tamanho - 7;
      
          for (i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
              pos = 9;
          }
      
          resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
      
          if (resultado != digitos.charAt(1))
            return false;
      
          return true;
    }
    return true;
  }

  removerFornecedor(index: number): void {
    this.removeFornecedor.push(this.newFornecedor[index]);
    this.newFornecedor.splice(this.newFornecedor.indexOf(this.newFornecedor[index]), 1);
  }

  adicionarFornecedor(): void {
    this.newFornecedor.push(new Fornecedor(null, null, null));
  }
}