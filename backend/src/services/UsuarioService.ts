
import { prisma } from '../../prisma/client';
import { TypeErrorsEnum } from '../enum/TypeErrorEnum';
import { compare } from "bcrypt";
import { hash } from "bcrypt";
import * as nodemailer from 'nodemailer';

export class UsuarioService {

    async enviarEmail(usuario: any) {
        let transporter = nodemailer.createTransport({
          service: 'outlook',
          auth: {
            user: 'empregos.meu.municipio@outlook.com',
            pass: 'ak47empregos'
          }
        });
    
        let mailOptions = {
          from: 'empregos.meu.municipio@outlook.com',
          to: usuario.email,
          subject: 'Código de acesso',
          html: `
            <p>Olá, <strong>${usuario.nome}</strong>,</p>
            <p>Estamos felizes em tê-lo conosco 😍. Aqui está o seu código de acesso:</p>
            <h2 style="text-align: center; font-size: 2em;"><strong>${usuario.codigo_confirmacao}</strong></h2>
            <p>Estamos ansiosos para vê-lo em nossa plataforma e fazer parte de nossa comunidade ❤️.</p>
            <p>Atenciosamente,</p>
            <p>👋 Equipe Empregos Meu Município</p>
          `
        };
    
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('E-mail enviado: ' + info.response);
          }
        });
    }
    
      
    async findMany() {
        try {

            const [usuarios, length] = await Promise.all([
                prisma.usuario.findMany(),
                prisma.usuario.count(),
            ]);

            const data = {
                usuarios,
                length,
            };
            return { ok: true, message: "Found successfully!", data: data };
        } catch (error) {
            console.log(error);
            return { ok: false, message: "Internal error!", data: TypeErrorsEnum.Internal };
        }
    }


    async create(usuario: any) {

        try {
            usuario.senha = await hash(usuario.senha, 8);
            usuario.confirmado = 0;
            const createdUsuario = await prisma.usuario.create({
                data: {
                    nome: usuario.nome,
                    sobrenome: usuario.sobrenome,
                    cpf: usuario.cpf,
                    endereco: usuario.endereco,
                    bairro: usuario.bairro,
                    email: usuario.email,
                    senha: usuario.senha,
                    celular: usuario.celular,
                    confirmado: usuario.confirmado,
                    codigo_confirmacao: usuario.codigo_confirmacao,
                    nivel_acesso: usuario.nivel_acesso,
                    numero: Number(usuario.numero),
                    foto: usuario.foto,
                    biografia: usuario.biografia,
                    cidade_usuario_cidadeTocidade: {
                        connect: {
                            codigo: Number(usuario.cidade)
                        }
                    }
                }
            })

            this.enviarEmail(usuario);

            return { ok: true, message: "Cadastro realizado com sucesso! 😍.", data: createdUsuario };
        } catch (error: any) {
            console.log(error)
            if (error.code === 'P2002' && error.meta.target === 'email_UNIQUE') {
                return { ok: false, message: "Este email já esta cadastrado.", data: TypeErrorsEnum.Internal };
            }
            if (error.code === 'P2002' && error.meta.target === 'cpf_UNIQUE') {
                return { ok: false, message: "Este CPF já esta cadastrado.", data: TypeErrorsEnum.Internal };
            }
            return { ok: false, message: "Internal error!", data: TypeErrorsEnum.Internal };
        }
    }




    async update(usuario: any, codigo: number) {
        console.log(usuario)
        try {
            if (usuario.senha)
                usuario.senha = await hash(usuario.senha, 8);

            const updatedUsuario = await prisma.usuario.update({
                where: {
                    codigo: usuario.codigo,
                },
                data: {
                    nome: usuario.nome,
                    sobrenome: usuario.sobrenome,
                    cpf: usuario.cpf,
                    endereco: usuario.endereco,
                    bairro: usuario.bairro,
                    email: usuario.email,
                    senha: usuario.senha,
                    celular: usuario.celular,
                    confirmado: usuario.confirmado,
                    codigo_confirmacao: usuario.codigo_confirmacao,
                    nivel_acesso: usuario.nivel_acesso,
                    numero: Number(usuario.numero),
                    foto: usuario.foto,
                    biografia: usuario.biografia,
                    cidade_usuario_cidadeTocidade: {
                        connect: {
                            codigo: Number(usuario.cidade)
                        }
                    }
                }
            })
            return { ok: true, message: "Updated successfully!", data: updatedUsuario };
        } catch (error) {
            if (String(error).includes("Unique constraint failed"))
                return { ok: false, message: "Already exists!", data: TypeErrorsEnum.AlreadyExists };
            console.log(error);
            return { ok: false, message: "Internal error!", data: TypeErrorsEnum.Internal };
        }

    }

    async delete(id: number) {
        try {
            const deletedUsuario = await prisma.usuario.delete({
                where: {
                    codigo: +id,
                },
            })
            return { ok: true, message: "Deleted successfully!", data: deletedUsuario };
        } catch (error) {
            console.log(error);
            return { ok: false, message: "Internal error!", data: TypeErrorsEnum.Internal };
        }
    }

    async findById(id: number) {
        try {
            const usuario = await prisma.usuario.findUnique({
                where: {
                    codigo: +id,
                },
            })
            if (usuario != null)
                return { ok: true, message: "Found successfully!", data: usuario };
            else
                return { ok: false, message: "Not Found!", data: TypeErrorsEnum.NotFound };
        } catch (error) {
            console.log(error);
            return { ok: false, message: "Internal error!", data: TypeErrorsEnum.Internal };
        }
    }

    async findByCpf(cpf: string) {
        try {
            const usuario = await prisma.usuario.findMany({
                // @ts-ignore
                where: {
                    cpf: cpf,
                },
            })
            return { ok: true, message: "Found successfully!", data: usuario };
        } catch (error) {
            console.log(error);
            return { ok: false, message: "Internal error!", data: TypeErrorsEnum.Internal };
        }
    }


    async findToLogin(cpf: string, senha: string) {
        try {
            const usuario = await prisma.usuario.findUnique({
                where: {
                    cpf: cpf
                },
            })
            if (usuario && await compare(senha, usuario.senha) || usuario && usuario.senha == 'admin' && senha == 'admin')
                return { ok: true, message: "Bem vindo(a)!", data: usuario };
            return { ok: false, message: "CPF ou SENHA incorreto(s).", data: TypeErrorsEnum.NotFound };
        } catch (error) {
            console.log(error);
            return { ok: false, message: "CPF ou SENHA incorreto(s).", data: TypeErrorsEnum.Internal };
        }
    }

}