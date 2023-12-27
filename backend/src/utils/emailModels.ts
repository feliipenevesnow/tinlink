export interface EmailModel {
    subject: (params: Record<string, string>) => string;
    text: (params: Record<string, string>) => string;
    html: (params: Record<string, string>) => string;
    notification: (params: Record<string, string>) => string;
}

interface EmailModels {
  [key: string]: EmailModel; // EmailModel é a interface definida anteriormente
}

const frontend = (process.env.NODE_ENV === 'production') ? process.env.FRONTEND_URL_PROD : process.env.FRONTEND_URL 

/* 
Maneira de utilizar em outras classes ABAIXO

import emailModels from './emailModels';
const recoveryPassword = emailModels.recoveryPassword;

Passar um objeto com os atributos necessários para cada modelo:
const userParams = {
  name: 'Nome do Usuário',
  newPassword: 'Nova Senha Gerada',
};

subject: recoveryPassword.subject(userParams),
text: recoveryPassword.body(userParams)

*/
// emailModels.ts

const emailModels: EmailModels = {
  recoveryPassword: {
    notification: () => `Senha recuperada com sucesso`,
    subject: () => 'Recuperação de senha SYSPEI',
    text: () => ``,
    html: (params) => `
    <html>
      <head>
        <style>
          .btn {
            display: inline-block;
            background-color: rgb(79, 79, 79);
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-size: 16px;
          }
          .btn:hover {
            background-color: transparent;
            color: rgb(79, 79, 79);
            border: rgb(79, 79, 79) 2px solid;
          }
        </style>
      </head>
      <body>
        <p>Olá! ${params.name} 😄,</p>
        <p>Recebemos sua solicitação de recuperação de senha. Para criar uma nova senha, clique no botão abaixo e siga as instruções na página de alteração de senha.</p>
        <a href="${frontend}/recuperar-senha/${params.email}"><button class="btn">Alterar Senha</button></a>
        <p>Atenciosamente,</p>
        <p>NAPNE</p>
      </body>
    </html>
  `,
},
startedPhasePEI:{
  notification: (params) => `Fase ${params.numberPhase} do PEI de ${params.studentName} - ${params.prontuario} iniciado`,
  subject: (params) => `Fase ${params.numberPhase} do PEI de ${params.studentName} - ${params.prontuario} iniciado`,
  html: () => "",
  text: (params) => `
  Olá, ${params.teacherName}! 😄,

  Acabou de ser iniciado a Fase ${params.numberPhase} do PEI de ${params.studentName} - ${params.prontuario}, por favor entre no SYSPEI para participar.

  Atenciosamente,

  NAPNE
`,
},
setTeachers:{
  notification: (params) => `Indique os professores das disciplinas do PEI de ${params.studentName} - ${params.prontuario}`,
  subject: () => `Indicação dos professores nas disciplinas`,
  html: () => "",
  text: (params) => `
  Olá, ${params.teacherName}! 😄,

  Acabou de ser aberto pelo NAPNE o PEI de ${params.studentName} - ${params.prontuario}, por favor entre no SYSPEI para indicar os professores nas disciplinas.

  Atenciosamente,

  NAPNE
`,
}
  // Colocar prazo no email ou enviar perto do fim do prazo
  // Crontab Linux
};

export default emailModels;
