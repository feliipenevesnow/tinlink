import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, NavController } from '@ionic/angular';
import { EmpresaService } from '../service/empresa.service';
import { AuthenticationService } from '../utils/authentication.service';
import { SocketService } from '../utils/socket.service';
import { logado } from '../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  cadastroForm: FormGroup;
  cep: string = "";
  isUsuario: boolean = true;
  logging: boolean = true;
  usuarioLogado: any;

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private authentication: AuthenticationService,
    private router: Router,
    public socketService: SocketService,
    private navCtrl: NavController,
    private authenticationService:AuthenticationService
  ) {
    this.cadastroForm = this.formBuilder.group({
      cnpj: [''],
      cpf: [''],
      senha: ['']
    });

  }

  ngOnInit(): void {

  }

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



  async efetuarLogin() {
    let cpf = this.cadastroForm.get('cpf')?.value;
    let cnpj = this.cadastroForm.get('cnpj')?.value;
    let senha = this.cadastroForm.get('senha')?.value;

    if (this.isUsuario) {
      this.logging = await this.authentication.loginColaborador({ cpf: cpf, senha: senha });
    } else {
      this.logging = await this.authentication.loginEmpresa({ cnpj: cnpj, senha: senha });
    }


    if (this.logging) {
      this.router.navigate(['']);
      this.socketService.init();

      logado.logado = await this.authentication.getLogUser();

      this.authenticationService.usuarioLogado$.subscribe((usuarioLogado) => {
        if (usuarioLogado.id !== 0) {
          logado.logado = usuarioLogado
        } else {
          this.usuarioLogado = null;
        }
      });


      await this.socketService.sendUserLogBackend();
    }
    else {
      this.presentToast('bottom', 'Credencias Inválidas!', 'danger');
    }

  }


  async buscarCidade() {
    let cepControl = this.cadastroForm.get('cep');
    let cidadeControl = this.cadastroForm.get('cidade');
    if (cepControl && cidadeControl) {
      cidadeControl.setValue("");

      let cep: string = cepControl.value;
      let url: string = `https://brasilapi.com.br/api/cep/v1/${cep}`;

      try {
        let response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();

        cidadeControl.setValue(data.city);

      } catch (error) {
        console.log('Houve um problema com a solicitação fetch: ' + error);
      }
    } else {
      console.log('Controle cep não encontrado');
    }
  }

  cadastrarColaborador() {
    this.router.navigate(['/cadastro-colaborador']);
  }

  cadastrarEmpregador() {
    this.router.navigate(['/cadastro-empregador']);
  }


  goBack() {
    this.navCtrl.back();
  }

  logar() {
    this.router.navigate(['/login']);
  }

  inicio() {
    this.router.navigate(['/home']);
  }

  trocarLogin() {
    this.isUsuario = !this.isUsuario;
  }

  digitaCPF(): void {
    let cpf = this.cadastroForm.get('cpf')?.value;
    cpf = this.aplicaMascaraCPF(cpf);
    this.cadastroForm.get('cpf')?.setValue(cpf);
  }

  aplicaMascaraCPF(valor: string): string {
    valor = valor.replace(/\D/g, '');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    if (valor.length > 14) {
      valor = valor.substring(0, 14);
    }


    return valor;
  }

  digitaCNPJ(): void {
    let cnpj = this.cadastroForm.get('cnpj')?.value;
    cnpj = this.aplicaMascaraCNPJ(cnpj);
    this.cadastroForm.get('cnpj')?.setValue(cnpj);
  }

  aplicaMascaraCNPJ(valor: string): string {
    valor = valor.replace(/\D/g, '');
    valor = valor.replace(/^(\d{2})(\d)/, '$1.$2');
    valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    valor = valor.replace(/\.(\d{3})(\d)/, '.$1/$2');
    valor = valor.replace(/(\d{4})(\d)/, '$1-$2');

    if (valor.length > 18) {
      valor = valor.substring(0, 18);
    }

    return valor;
  }


}
