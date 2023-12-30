import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {

  @Input() modalTitle: string = "";
  @Input() imagemURL: string = "";
  @Input() mensagem: string = "";

  constructor(private modalController: ModalController) {}

  fecharModal() {
    this.modalController.dismiss();
  }
}
