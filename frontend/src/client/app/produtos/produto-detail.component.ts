import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { FormsModule, NgModel, AbstractControl } from '@angular/forms';
import { Produto } from './model/produto';
import { ProdutosService } from './shared/produtos.service';
import { Tributacao } from '../_model/tributacao';
import { ToastService } from '../_services/toast.service';

@Component({
  moduleId: module.id,
  selector: 'produto-detail',
  templateUrl: 'produto-detail.component.html',
  styleUrls: ['produto-detail.component.css']
})

export class ProdutoDetailComponent implements OnInit {

  produto: Produto;
  produtoUploadURL: string;
  fileHolder: any;
  tributacao: Tributacao;
  submitted = false;
  labelCSOSNCST: string = 'CST';
  desabilitaBotao = false;

  constructor(
    private produtoService: ProdutosService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private _toastService: ToastService
  ) { }

  getTributacao(): void {
    this.produtoService.getTributacao().then(tributacao => {
      this.tributacao = tributacao;
      if (this.tributacao.CRT === 1) {
        this.labelCSOSNCST = 'CSOSN';
      } else {
        this.labelCSOSNCST = 'CST';
      }
      this.getProduto();
    });
  }

  getProduto(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => {
        var id = params.get('id');
        if (id) {
          this.produtoUploadURL = this.produtoService.getProdutoImageURL(id);
          return this.produtoService.getProductWithPrices(id);
        } else {
          return Promise.resolve().then(produto => new Produto());
        }
      })
      .subscribe(produto => {
        this.produto = produto;
        if (this.produto.cstNFCe === '' || this.produto.cstNFCe === null || this.produto.cstNFCe === undefined) {
          this.tributacao.CsosnCstNFCe.forEach(element => {
            if (element.IsDefault) {
              this.produto.cstNFCe = element.Codigo;
            }
          });
        }
        if (this.produto.cstNFe === '' || this.produto.cstNFe === null || this.produto.cstNFe === undefined) {
          this.tributacao.CsosnCstNFe.forEach(element => {
            if (element.IsDefault) {
              this.produto.cstNFe = element.Codigo;
            }
          });
        }
        if (this.produto.cfopNFCe === '' || this.produto.cfopNFCe === null || this.produto.cfopNFCe === undefined) {
          this.tributacao.CfopNFCe.forEach(element => {
            if (element.IsDefault) {
              this.produto.cfopNFCe = element.Codigo;
            }
          });
        }
        if (this.produto.cstPIS === '' || this.produto.cstPIS === null || this.produto.cstPIS === undefined) {
          this.tributacao.CstPIS.forEach(element => {
            if (element.IsDefault) {
              this.produto.cstPIS = element.Codigo;
            }
          });
        }
        if (this.produto.cstCOFINS === '' || this.produto.cstCOFINS === null || this.produto.cstCOFINS === undefined) {
          this.tributacao.CstCOFINS.forEach(element => {
            if (element.IsDefault) {
              this.produto.cstCOFINS = element.Codigo;
            }
          });
        }
      });
  }

  ngOnInit(): void {
    this.getTributacao();
  }

  save(form: AbstractControl): void {

    this.submitted = true;
    if (!form.valid) {
      this._toastService.errorNotification('', 'Por favor, verifique os campos informados');
      console.log('Form is invalid');
      this.desabilitaBotao = false;
      return;
    }

    this.produto.cstCOFINS = this.produto.cstPIS;
    if (this.produto.id) {
      this.produtoService.updateProduct(this.produto)
        .then(() => {
          if (this.fileHolder !== undefined) {
            this.produtoService.uploadImagem(this.fileHolder, this.produto);
          }
          this._toastService.sucessNotification('', 'Produto alterado com sucesso');
          this.goBack();
        });
    } else {
      this.produtoService.addProduct(this.produto)
        .then(produto => {
          if (this.fileHolder !== undefined) {
            this.produtoService.uploadImagem(this.fileHolder, produto);
          }
          this._toastService.sucessNotification('', 'Produto salvo com sucesso');
          this.goBack();
        });
    }
    this.desabilitaBotao = true;
  }

  goBack(): void {
    this.router.navigate(['pedidos']);
  }

  imageUploaded(event: any): void {
    this.fileHolder = event;
  }

  alteraCfop(): void {
    this.produtoService.getCfop(this.produto.procedenciaPropria, this.produto.cstNFCe)
      .then(cfop => { this.produto.cfopNFCe = cfop.Codigo; });
  }
}