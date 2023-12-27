import { usuario } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { TypeErrorsEnum } from '../enum/TypeErrorEnum';
import { compare } from "bcrypt";
import { hash } from "bcrypt";

export class UsuarioService {

    async findMany(search: string, page: number,
        perPage: number, orderBy: string, idLogado: number) {
        try {
            let skip: number = (Number(page) - 1) * Number(perPage)

            const [usuarios, length] = await Promise.all([
                prisma.usuario.findMany({
                    where: {
                        nome_completo: {
                            contains: String(search),
                        },
                        id: {
                            not: idLogado
                        }
                    },
                    take: Number(perPage),
                    skip: skip,
                    // @ts-ignore
                    orderBy: {
                        nome_completo: orderBy,
                    },
                }),
                prisma.usuario.count({
                    where: {
                        nome_completo: {
                            contains: String(search),
                        },
                    },
                }),
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

    async findByType(type: string, orderBy: string) {

        try {
            const usuarios = await prisma.usuario.findMany({
                where: {
                    OR:[{
                        tipo: type
                        },
                        {
                            tipo: 'COORDENADOR'
                        }
                    ]
                },
                // @ts-ignore
                orderBy: {
                    nome_completo: String(orderBy),
                },
            })

            return { ok: true, message: "Found successfully!", data: usuarios };
        } catch (error) {
            console.log(error);
            return { ok: false, message: "Internal error!", data: TypeErrorsEnum.Internal };
        }
    }

    async create(usuario: usuario) {
        try {
            usuario.senha = await hash(usuario.senha, 8);
            usuario.ultima_atualizacao = new Date();
            const createdUsuario = await prisma.usuario.create({ data: usuario })
            return { ok: true, message: "Created successfully!", data: createdUsuario };
        } catch (error: any) {
            if (error.meta.target.includes("prontuario"))
                return { ok: false, message: "Prontuário já existe", data: TypeErrorsEnum.AlreadyExists };
            else if (error.meta.target.includes("email"))
                return { ok: false, message: "Email já existe", data: TypeErrorsEnum.AlreadyExists };
            return { ok: false, message: "Internal error!", data: TypeErrorsEnum.Internal };
        }
    }

    async importProfessores(professores: usuario[]){
        try {
            for (const professor of professores) {
                professor.senha = await hash(professor.senha, 8); // Aguarde a criptografia da senha
              }
            const numberCreated = await prisma.usuario.createMany(
                {data: professores, skipDuplicates: true}
            )
            return { ok: true, message: "Created successfully!", data: numberCreated };
        } catch (error: any) {
            return { ok: false, message: "Internal error!", data: TypeErrorsEnum.Internal };
        }
    }

    async update(usuario: any, id: number) {
        try {
            if(usuario.senha)
                 usuario.senha = await hash(usuario.senha, 8);
            usuario.ultima_atualizacao = new Date();
            const updatedUsuario = await prisma.usuario.update({
                where: {
                    id: +id,
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
                    id: +id,
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
                    id: +id,
                },
            })
            if(usuario != null)
                return { ok: true, message: "Found successfully!", data: usuario };
            else
                return { ok: false, message: "Not Found!", data: TypeErrorsEnum.NotFound};
        } catch (error) {
            console.log(error);
            return { ok: false, message: "Internal error!", data: TypeErrorsEnum.Internal };
        }
    }

    async findByProntuario(prontuario: string) {
        try {
            const usuario = await prisma.usuario.findMany({
                 // @ts-ignore
                where: {
                    prontuario: prontuario,
                },
            })
            return { ok: true, message: "Found successfully!", data: usuario };
        } catch (error) {
            console.log(error);
            return { ok: false, message: "Internal error!", data: TypeErrorsEnum.Internal };
        }
    }

    async changePasswordByEmail(email: string, newPassword: string) {
        try {
            newPassword = await hash(newPassword, 8);
            const updatedUsuario = await prisma.usuario.update({
                where: {
                    email: email,
                },
                data: {
                    senha: newPassword
                },
            })
            return { ok: true, message: "Updated successfully!", data: updatedUsuario };
        } catch (error) {
            console.log(error);
            return { ok: false, message: "Internal error!", data: TypeErrorsEnum.Internal };
        }
    }

    async findToLogin(prontuario: string, senha: string) {
        try {
            const usuario = await prisma.usuario.findUnique({
                where: {
                    prontuario: prontuario
                },
            })
            if(usuario && await compare(senha, usuario.senha) || usuario && usuario.senha == 'admin' && senha == 'admin')
                return  { ok: true, message: "Login Succesfully!", data: usuario };
            return { ok: false, message: "Login Failed!", data: TypeErrorsEnum.NotFound};          
        } catch (error) {
            console.log(error);
            return { ok: false, message: "Internal error!", data: TypeErrorsEnum.Internal };
        }
    }

    async verifyIfCoordenadorStill(idUsuario: any){
        let response;
        try {
            const usuario = await prisma.usuario.findUnique({
                where: {
                    id: idUsuario
                },
                include: {
                    coordenador_no_curso: true
                }
            });
            if (usuario?.coordenador_no_curso.length === 0){
                response = await this.update({tipo: 'PROFESSOR'}, idUsuario)
                if (response.ok) return { ok: true, message: "Changed Acess Level!", data: usuario};
            }
            return { ok: true, message: "Still Coordenador!", data: usuario};          
        } catch (error) {
            console.log(error);
            return { ok: false, message: "Internal error!", data: TypeErrorsEnum.Internal };
        }
    }

}