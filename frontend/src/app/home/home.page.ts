import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { StorageService } from '../utils/storage.service';
import { SocketService } from '../utils/socket.service';
import { AuthenticationService } from '../utils/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit{
  data: Date;
  dia: number;
  mes: string;
  ano: number;
  usuarioLogado: any = null;

  constructor(private router: Router,
     private storageService: StorageService,
     private socketService: SocketService,
     private authenticationService: AuthenticationService,
     )  {
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




  cadastrarColaborador(){
    this.router.navigate(['/cadastro-colaborador']);
  }

  cadastrarEmpregador(){
    this.router.navigate(['/cadastro-empregador']);
  }

  logar(){
    this.router.navigate(['/login']);
  }

  logout() {
    this.authenticationService.logout()
    this.usuarioLogado = null;
    this.socketService.disconnecting()
  }

}

export class HomePageModule {}
