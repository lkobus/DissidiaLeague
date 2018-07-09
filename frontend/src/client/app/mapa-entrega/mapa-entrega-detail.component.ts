import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { FileSaverService } from 'ngx-filesaver';
import { ToastService } from '../_services/toast.service';
import { MapaEntregaService } from './services/mapa-entrega.service';
import { Marker, NguiMapComponent, OptionBuilder } from '@ngui/map';
import { Subject } from 'rxjs/Subject'
import { Modal } from 'ngx-modal';

import { GenericResponse } from '../_model/index';
import { MapaEntrega, PedidoMapa, NotaMapaNew, ContaFisica, ContaFinanceira } from './model/mapa-entrega';
import { AccordionComponent } from '../shared/accordion/accordion.component';

@Component({
    moduleId: module.id,
    selector: 'mapaEntregaDetail',
    templateUrl: 'mapa-entrega-detail.component.html'
})
export class MapaEntregaDetailComponent implements OnInit {

    isLoading: boolean;
    submitted: boolean = false;

    contasFisicasEditadas: ContaFisica[] = [];
    mapaEntrega: MapaEntrega = new MapaEntrega;
    @ViewChild("tabDetalhes") tabDetalhes: AccordionComponent;
    @ViewChild("modalConfirmacao") modalConfirmacao: Modal;

    constructor(
        private mapaEntregaService: MapaEntregaService,
        private toastService: ToastService,
        private fileSaverService: FileSaverService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
    ) { }

    ngOnInit() {
        this.activatedRoute.paramMap
            .switchMap((params: ParamMap) => {
                let id = params.get('id');
                return this.loadSources(id);
            })
            .subscribe(() => { });
    }

    loadSources(mapaId: string): Promise<any> {
        this.isLoading = true;
        return this.mapaEntregaService.getMapa(mapaId)
            .then(data => {
                this.setMapa(data);
                this.isLoading = false;
            })
            .catch(error => {
                this.isLoading = false;
                this.handleServerError(error);
            })
    }

    setMapa(mapa: MapaEntrega): void {
        this.contasFisicasEditadas = [];
        this.mapaEntrega = mapa;
        this.checkNotaPedidos(this.mapaEntrega);
        this.checkContasFinanceiras(this.mapaEntrega);
        this.checkContasFisicas(this.mapaEntrega);
    }

    checkNotaPedidos(mapa: MapaEntrega): void {
        if (mapa.StatusCodigo == 3 || mapa.StatusCodigo == 4) {
            mapa.Pedidos.forEach(c => {
                if (!c.NotaFiscal.StatusCodigo) {
                    c.NotaFiscal.StatusCodigo = 1;
                }
            });
        }
    }

    checkContasFinanceiras(mapa: MapaEntrega): void {
        if (mapa.StatusCodigo == 4) {
            mapa.ContasFinanceiras.forEach(cf => {
                if (!cf.ValorReal) {
                    cf.ValorReal = cf.Valor;
                }
            })
        }
    }

    checkContasFisicas(mapa: MapaEntrega): void {
        if (mapa.StatusCodigo == 4) {
            mapa.ContasFisicas.forEach(cf => {
                if (!cf.QuantidadeReal) {
                    cf.QuantidadeReal = cf.Quantidade;
                }
                if (!cf.QuantidadeRetorno) {
                    cf.QuantidadeRetorno = cf.QuantidadeReal;
                }
            });
        }
    }

    imprimirMapa(mapa: MapaEntrega): void {
        this.isLoading = true;
        this.mapaEntregaService.imprimirMapa(mapa.Id)
            .then(data => {
                let result = new Blob([data.fileData], { type: "application/pdf;charset=utf-8" })
                this.fileSaverService.save(result, data.fileName);
                this.isLoading = false;
            })
            .catch(error => {
                this.isLoading = false;
                this.handleServerError(error);
            });
    }

    recalcularMapa(): void {
        let notasNaoEntregue: NotaMapaNew[] = [];
        this.mapaEntrega.Pedidos.forEach(p => {
            if (p.NotaFiscal.StatusCodigo == 2) {
                notasNaoEntregue.push(p.NotaFiscal);
            }
        });

        this.mapaEntregaService.recalcularMapa(this.mapaEntrega.Id, notasNaoEntregue)
            .then(data => {
                this.mapaEntrega = data;
                this.checkNotaPedidos(this.mapaEntrega);
                this.mapaEntrega.ContasFisicas.forEach(cf => {
                  let cfEditada = this.contasFisicasEditadas.find(cf2 => cf2.AtivoGiroId == cf.AtivoGiroId);
                  if (cfEditada) {
                    cf.QuantidadeRetorno = cfEditada.QuantidadeRetorno;
                  } else {
                    cf.QuantidadeRetorno = cf.QuantidadeReal;
                  }
                })
            })
            .catch(error => {
                this.handleServerError(error);
            })
    }

    existsNotasEntregue(): boolean {
        return this.mapaEntrega.Pedidos.find(p => p.NotaFiscal.StatusCodigo == 1) != null;
    }

    existsNotasNaoEntregue(): boolean {
        return this.mapaEntrega.Pedidos.find(p => p.NotaFiscal.StatusCodigo == 2) != null;
    }

    openModalConfirmacao(): void {
        if (!this.mapaEntrega.Pedidos.length) {
            this.toastService.errorNotification("Atenção", "Nenhum pedido vinculada ao mapa de entrega.");
            return;
        }

        this.submitted = true;
        if (this.mapaEntrega.ContasFisicas.find(c => c.QuantidadeRetorno != 0 && !c.QuantidadeRetorno)) {
            this.tabDetalhes.active = true;
            this.toastService.errorNotification("Atenção", "Verifique os dados dos retornos.");
            return;
        }
        if (this.mapaEntrega.Pedidos.find(p => p.NotaFiscal.StatusCodigo == 3)) {
            this.tabDetalhes.active = true;
            this.toastService.errorNotification("Atenção", "O mapa de entrega ainda possúi nota fical pendente de geração.");
            return;
        }
        if (this.mapaEntrega.Pedidos.find(p => p.NotaFiscal.StatusCodigo == 4)) {
            this.tabDetalhes.active = true;
            this.toastService.errorNotification("Atenção", "O mapa de entrega ainda possúi nota fical em processo de faturamento.");
            return;
        }
        if (this.mapaEntrega.Pedidos.find(p => p.NotaFiscal.StatusCodigo == 5)) {
            this.tabDetalhes.active = true;
            this.toastService.errorNotification("Atenção", "O mapa de entrega possúi nota fical rejeitada pela SEFAZ.");
            return;
        }

        this.modalConfirmacao.open();
    }

    closeModalConfirmacao(): void {
        this.modalConfirmacao.close();
    }

    fecharMapa(): void {
        this.closeModalConfirmacao();
        this.isLoading = true;
        this.mapaEntregaService.fecharMapa(this.mapaEntrega)
            .then(() => {
                this.loadSources(this.mapaEntrega.Id)
                    .then(() => {
                        this.toastService.sucessNotification("", "Mapa fechado com sucesso.");
                    });
            })
            .catch(error => {
                this.isLoading = false;
                this.handleServerError(error);
            });
    }

    faturarMapa(): void {
        this.isLoading = true;
        this.mapaEntregaService.faturarMapa(this.mapaEntrega)
            .then(() => {
                this.loadSources(this.mapaEntrega.Id)
                    .then(() => {
                        this.toastService.sucessNotification("", "Faturamento solicitado com sucesso.");
                    });
            })
            .catch(error => {
                this.isLoading = false;
                this.handleServerError(error);
            });
    }

    removerNotaRejeitada(notaFiscal: NotaMapaNew): void {
        this.isLoading = true;
        this.mapaEntregaService.removerNotaRejeitada(this.mapaEntrega.Id, notaFiscal.Id)
            .then(() => {
                this.loadSources(this.mapaEntrega.Id)
                    .then(() => {
                        this.toastService.sucessNotification("", "Nota fiscal removida com sucesso.");
                    });
            })
            .catch(error => {
                this.isLoading = false;
                this.handleServerError(error);
            });
    }

    existNotaRejeitada(): boolean {
        return this.mapaEntrega.Pedidos.filter(p => p.NotaFiscal.StatusCodigo == 5).length > 0;
    }

    goBack(): void {
        this.toastService.clearAllNotifications();
        this.router.navigate(['entrega/mapa/resumo']);
    }

    onChangeContaFisicaRetorno(contaFisica: ContaFisica): void {
        if (!this.contasFisicasEditadas.find(cf => cf.AtivoGiroId == contaFisica.AtivoGiroId)) {
          this.contasFisicasEditadas.push(contaFisica);
        }
        if (contaFisica.QuantidadeRetorno < 0) {
            contaFisica.QuantidadeRetorno = 0;
            this.toastService.errorNotification("Atenção", "Valor de retorno inválido.");
        }
    }

    formatarPlaca(placa: string): string {
        if(!placa) {
            return '';
        }
        let regex = /^([a-zA-Z]+)(\d+)$/g;
        let matchs = regex.exec(placa.toLocaleUpperCase());
        if (matchs && matchs.length == 3) {
            placa = matchs[1] + '-' + matchs[2];
        }
        return placa;
    }

    private handleServerError(error: GenericResponse): void {
        this.isLoading = false;
        if (error.message) {
            this.toastService.errorNotification('', error.message);
        } else {
            this.toastService.errorNotification('', 'Falha ocorrida.');
        }
    }
}
