import { Component, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { UsuarioService } from 'src/app/service/usuario.service';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/utils/authentication.service';
import { SocketService } from 'src/app/utils/socket.service';

@Component({
  selector: 'app-confirmacao',
  templateUrl: './confirmacao.component.html',
  styleUrls: ['./confirmacao.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class ConfirmacaoComponent {

  @Input() usuario: any;

  um: number = 0;
  dois: number = 0;
  tres: number = 0;
  quatro: number = 0;
  cinco: number = 0;

  constructor(private modalController: ModalController,
    private usuarioService: UsuarioService, private toastController: ToastController,
    private authenticationService: AuthenticationService, private router: Router,
    private socketService: SocketService) { }

  async presentToast(position: 'top' | 'middle' | 'bottom', messagem: string, tipo: string) {
    const toast = await this.toastController.create({
      message: messagem,
      duration: 5000,
      position: position,
      color: tipo,
      buttons: [
        {
          text: 'Fechar',
          role: 'cancel'
        }
      ]
    });

    await toast.present();
  }

  async verificaCodigo() {
    const codigoDigitado = `${this.um}${this.dois}${this.tres}${this.quatro}${this.cinco}`;
    console.log(codigoDigitado)
    if (this.usuario.codigo_confirmacao == codigoDigitado) {

      this.usuario.confirmado = 1;
      this.usuario.foto = null;

      const result = await this.usuarioService.update(this.usuario);

      if(result.ok){
        this.presentToast('bottom', 'Conta verificada com sucesso! 😍🎉', 'success');
        this.fecharModal();
      }

    } else {
      this.presentToast('bottom', 'Código Inválido.', 'warning');
      this.fecharModal();
    }
  }

  logar() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authenticationService.logout()
    this.socketService.disconnecting()
  }

  fecharModal() {
    this.modalController.dismiss();
  }
}
