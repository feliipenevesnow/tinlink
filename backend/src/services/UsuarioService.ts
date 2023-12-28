import { usuario } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { TypeErrorsEnum } from '../enum/TypeErrorEnum';
import { compare } from "bcrypt";
import { hash } from "bcrypt";

export class UsuarioService {

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
                    nivel_acesso: usuario.nivel_acesso,
                    numero: Number(usuario.numero),
                    foto_perfil: usuario.foto_perfil,
                    biografia: usuario.biografia,
                    cidade_usuario_cidadeTocidade: {
                        connect: {
                            codigo: Number(usuario.cidade)
                        }
                    }
                }
            })
            return { ok: true, message: "Created successfully!", data: createdUsuario };
        } catch (error: any) {
            console.log(error);
            return { ok: false, message: "Internal error!", data: TypeErrorsEnum.Internal };
        }
    }
    
    


    async update(usuario: any, id: number) {
        try {
            if (usuario.senha)
                usuario.senha = await hash(usuario.senha, 8);
            usuario.ultima_atualizacao = new Date();
            const updatedUsuario = await prisma.usuario.update({
                where: {
                    codigo: +id,
                },
                data: usuario,
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


    async findToLogin(email: string, senha: string) {
        try {
            const usuario = await prisma.usuario.findUnique({
                where: {
                    email: email
                },
            })
            if (usuario && await compare(senha, usuario.senha) || usuario && usuario.senha == 'admin' && senha == 'admin')
                return { ok: true, message: "Login Succesfully!", data: usuario };
            return { ok: false, message: "Login Failed!", data: TypeErrorsEnum.NotFound };
        } catch (error) {
            console.log(error);
            return { ok: false, message: "Internal error!", data: TypeErrorsEnum.Internal };
        }
    }

}