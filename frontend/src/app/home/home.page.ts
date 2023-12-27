import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  data: Date;
  dia: number;
  mes: string;
  ano: number;

  constructor() {
    this.data = new Date();
    this.dia = this.data.getDate();

    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    this.mes = meses[this.data.getMonth()];

    this.ano = this.data.getFullYear();
  }

}

export class HomePageModule {}
