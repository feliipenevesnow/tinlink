import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {  ToastController } from '@ionic/angular';
import { UsuarioService } from 'src/app/service/usuario.service';
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
    private usuarioService: UsuarioService,
    private router: Router,
    private navCtrl: NavController
  ) {
    this.cadastroForm = this.formBuilder.group({
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
      cpf: ['', Validators.required],
      endereco: ['', Validators.required],
      bairro: ['', Validators.required],
      email: ['', Validators.required],
      senha: ['', Validators.required],
      confirmaSenha: ['', Validators.required],
      celular: ['', Validators.required],
      numero: [''],
      foto: [''],
      biografia: [''],
      cidade: ['1'],
      confirmado: ['0'],
      codigo_confirmacao: [],
      nivel_acesso: ['COLABORADOR']
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

  async cadastrarColaborador() {
    let campos = ['nome', 'sobrenome', 'cpf', 'endereco', 'bairro', 'email', 'senha', 'confirmaSenha', 'celular', 'numero', 'foto', 'biografia'];
    for (let campo of campos) {
      if (this.cadastroForm.controls[campo].invalid) {
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

    if(!this.verificaCPF()){
      this.presentToast('bottom', 'O CPF informado é inválido.', 'danger');
      return;
    }
    
    if(!this.verificaCelular()){
      this.presentToast('bottom', 'O número de celular informado é inválido.', 'danger');
      return;
    }

    this.cadastroForm.get('codigo_confirmacao')?.setValue(this.gerarCodigoConfirmacao());

    let usuario = this.cadastroForm.value;

    const response = await this.usuarioService.create(usuario);

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
  

  verificaCelular(): boolean {
    const celular = this.cadastroForm.get('celular')?.value;
    const regexCelular = /^\(\d{2}\)\s\d{5}-\d{4}$/;
  
    return regexCelular.test(celular || '');
  }
  


  verificaCPF(): boolean {
    let cpf = this.cadastroForm.get('cpf')?.value;

    cpf = cpf.replace(/[^\d]+/g,'');
  
    if(cpf.length !== 11) {
      return false;
    }
  
    if (/^(\d)\1+$/.test(cpf)) {
      return false;
    }
  

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) {
      resto = 0;
    }
    if (resto !== parseInt(cpf.charAt(9))) {
      return false;
    }
  

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) {
      resto = 0;
    }
    if (resto !== parseInt(cpf.charAt(10))) {
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
