import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { StorageService } from '../utils/storage.service';
import { SocketService } from '../utils/socket.service';
import { AuthenticationService } from '../utils/authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from '../modais/modal/modal.component';
import { ConfirmacaoComponent } from '../modais/confirmacao/confirmacao.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  data: Date;
  dia: number;
  mes: string;
  ano: number;
  usuarioLogado: any = null;

  constructor(private router: Router,
    private storageService: StorageService,
    private socketService: SocketService,
    private authenticationService: AuthenticationService,
    private modalController: ModalController,
    private http: HttpClient
  ) {
    this.data = new Date();
    this.dia = this.data.getDate();

    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    this.mes = meses[this.data.getMonth()];

    this.ano = this.data.getFullYear();
    this.router.events.subscribe(async (event) => {
      if (event instanceof NavigationEnd) {
        if (this.router.url === '/home') {
          this.usuarioLogado = JSON.parse(await this.storageService.get('user'));
          console.log(this.usuarioLogado);
        }
      }
    });
  }


  ngOnInit(): void {



  }




  cadastrarColaborador() {
    this.router.navigate(['/cadastro-colaborador']);
  }

  cadastrarEmpregador() {
    this.router.navigate(['/cadastro-empregador']);
  }

  logar() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authenticationService.logout()
    this.usuarioLogado = null;
    this.socketService.disconnecting()
  }

  enviarSMS() {

  }


  async abrirPrimeiroModal() {
    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: {
        modalTitle: 'Código - Passo 1',
        mensagem: 'Por favor, verifique sua caixa de e-mail, inclusive a pasta de SPAM. Você encontrará um código necessário para a confirmação da sua conta. 😎​',
        imagemURL: '../../../assets/img/span.png'
      }
    });
    return await modal.present();
  }

  async abrirConfirmacao() { 
    const modal = await this.modalController.create({
      component: ConfirmacaoComponent,
      componentProps: {
        usuario: this.usuarioLogado
      }
    });
    this.abrirSegundoModal();
    return await modal.present();
  }

async abrirSegundoModal() {
  const modal = await this.modalController.create({
    component: ModalComponent,
    componentProps: {
      modalTitle: 'Código - Passo 2',
      mensagem: 'Clique na pasta SPAM e procure pelo primeiro e-mail. Você encontrará um código neste e-mail. Depois de anotar o código, retorne aqui, acesse o site e confirme utilizando o código que você recebeu.​',
      imagemURL: '../../../assets/img/emailSpan.png'
    }
  });
  this.abrirPrimeiroModal();
  
  return await modal.present();
}

}

export class HomePageModule { }
