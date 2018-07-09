import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Modal, ModalHeader, ModalContent, ModalFooter } from 'ngx-modal';


@Component({
  moduleId: module.id,
  selector: 'modal-confirmacao',
  templateUrl: './modal-confirmacao.component.html',
  styleUrls: ['./modal-confirmacao.component.css']
})
export class ModalConfirmacaoComponent {


  @ViewChild('modal') modal: Modal;

  @Input() title: string = 'Atenção';
  @Input() message: string = '';

  @Input() closeOutSide: boolean = false;
  @Input() isLoading: boolean = false;
  @Input() hiddenCancelar: boolean = false;
  @Input() hiddenConfirmar: boolean = false;

  @Output() onConfirmar: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancelar: EventEmitter<any> = new EventEmitter<any>();

  private object: any;

  openModal(message: string, object?: any) {
    this.message = message;
    if (object) this.object = object;

    this.modal.open();
  }

  closeModal() {
    this.modal.close();
  }

  getModal(): Modal {
    return this.modal;
  }

  clickConfirmar() {
    this.onConfirmar.emit(this.object ? this.object : null);
    this.modal.close();
  }

  clickCancelar() {
    this.onCancelar.emit(this.object ? this.object : null);
    this.modal.close();
  }

}
