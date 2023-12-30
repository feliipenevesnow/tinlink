import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {  ToastController } from '@ionic/angular';
import { EmpresaService } from 'src/app/service/empresa.service';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {

  cadastroForm: FormGroup;
  cep: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private empresaService: EmpresaService,
    private router: Router,
    private navCtrl: NavController
  ) {
    this.cadastroForm = this.formBuilder.group({
      nome: ['', Validators.required],
      cnpj: ['', Validators.required],
      endereco: ['', Validators.required],
      bairro: ['', Validators.required],
      email: ['', Validators.required],
      senha: ['', Validators.required],
      confirmaSenha: ['', Validators.required],
      celular: ['', Validators.required],
      numero: [''],
      foto: [''],
      cidade: ['1'],
      codigo_confirmacao: [],
      confirmado: ['0'],
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

  gerarCodigoConfirmacao() {
    let codigo = Math.floor(10000 + Math.random() * 90000);
    return codigo;
  }

  async cadastrarEmpregador() {
    let campos = ['nome', 'cnpj', 'endereco', 'bairro', 'email', 'senha', 'confirmaSenha', 'celular', 'numero', 'foto'];
    for (let campo of campos) {
      console.log(campo);
      if (this.cadastroForm.controls[campo].invalid) {
        if(campo == "numero"){
          this.presentToast('bottom', 'O campo número está incompleto ou inválido.', 'warning');
          return;
        }
        this.presentToast('bottom', 'O campo ' + campo + ' está incompleto.', 'warning');
        return;
      }
    }

    let email = this.cadastroForm.get('email')?.value;

    if(!email.includes('@') || !email.includes('.')) {
      this.presentToast('bottom', 'Email inválido.', 'danger');
      return;
  }

    let senha = this.cadastroForm.get('senha')?.value;
    let confirmaSenha = this.cadastroForm.get('confirmaSenha')?.value;
    

    if (senha != confirmaSenha) {
      this.presentToast('bottom', 'As senham não são identicas.', 'danger');
      return;
    }

    if(!this.verificaCNPJ()){
      this.presentToast('bottom', 'O CNPJ informado é inválido.', 'danger');
      return;
    }
    
    if(!this.verificaCelular()){
      this.presentToast('bottom', 'O número de celular informado é inválido.', 'danger');
      return;
    }

    this.cadastroForm.get('codigo_confirmacao')?.setValue(this.gerarCodigoConfirmacao());

    let empresa = this.cadastroForm.value;
    

    const response = await this.empresaService.create(empresa);
    
    if(response.ok){
      this.presentToast('bottom', response.message, 'success');
      this.router.navigate(['/home']);   
    }else{
      this.presentToast('bottom', response.error.message, 'danger');
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

  

  verificaCelular(): boolean {
    const celular = this.cadastroForm.get('celular')?.value;
    const regexCelular = /^\(\d{2}\)\s\d{5}-\d{4}$/;
  
    return regexCelular.test(celular || '');
  }
  


  verificaCNPJ(): boolean {
    let cnpj = this.cadastroForm.get('cnpj')?.value;

    cnpj = cnpj.replace(/[^\d]+/g,'');

    if(cnpj.length !== 14) {
      return false;
    }

    if (/^(\d)\1+$/.test(cnpj)) {
      return false;
    }

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0,tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0)) {
      return false;
    }

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0,tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }

    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1)) {
      return false;
    }

    return true;
}



  digitarCelular(): void {
    let celular = this.cadastroForm.get('celular')?.value;
    celular = this.aplicaMascaraCelular(celular);
    this.cadastroForm.get('celular')?.setValue(celular);
  }

  aplicaMascaraCelular(valor: string): string {
    valor = valor.replace(/\D/g, ''); 
    valor = valor.replace(/(\d{2})(\d)/, '($1) $2'); 
    valor = valor.replace(/(\d{5})(\d)/, '$1-$2'); 
    valor = valor.replace(/(\d{4})(\d)/, '$1$2'); 
  

    if (valor.length > 15) {
      valor = valor.substring(0, 15);
    }
  
    return valor;
  }
  

  goBack() {
    this.navCtrl.back();
  }

  logar(){
    this.router.navigate(['/login']);
  }
  
  inicio(){
    this.router.navigate(['/home']);
  }
}
