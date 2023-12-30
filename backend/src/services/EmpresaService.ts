import { empresa } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { TypeErrorsEnum } from '../enum/TypeErrorEnum';
import { compare } from "bcrypt";
import { hash } from "bcrypt";

export class EmpresaService {

    async findMany() {
        try {

            const [empresas, length] = await Promise.all([
                prisma.empresa.findMany(),
                prisma.empresa.count(),
            ]);

            const data = {
                empresas,
                length,
            };
            return { ok: true, message: "Found successfully!", data: data };
        } catch (error) {
            console.log(error);
            
            return { ok: false, message: "Internal error!", data: TypeErrorsEnum.Internal };
        }
    }


    async create(empresa: any) {

        try {
            empresa.senha = await hash(empresa.senha, 8);
            empresa.confirmado = 0;
            const createdEmpresa = await prisma.empresa.create({
                data: {
                    nome: empresa.nome,
                    cnpj: empresa.cnpj,
                    endereco: empresa.endereco,
                    bairro: empresa.bairro,
                    email: empresa.email,
                    senha: empresa.senha,
                    celular: empresa.celular,
                    confirmado: empresa.confirmado,
                    numero: Number(empresa.numero),
                    codigo_confirmacao: empresa.codigo_confirmacao,
                    foto: empresa.foto,
                    cidade_empresa_cidadeTocidade: {
                        connect: {
                            codigo: Number(empresa.cidade)
                        }
                    }
                }
            })
            return { ok: true, message: "Cadastro realizado com sucesso! 😍.", data: createdEmpresa };
        } catch (error: any) {
            console.log(error);
            if (error.code === 'P2002' && error.meta.target === 'email_UNIQUE') {
                return { ok: false, message: "Este email já esta cadastrado.", data: TypeErrorsEnum.Internal };
            }
            if (error.code === 'P2002' && error.meta.target === 'cnpj_UNIQUE') {
                return { ok: false, message: "Este CNPJ já esta cadastrado.", data: TypeErrorsEnum.Internal };
            }
            return { ok: false, message: "Internal error!", data: TypeErrorsEnum.Internal };
        }
    }

    async findToLogin(cnpj: string, senha: string) {
        try {
            const empresa = await prisma.empresa.findUnique({
                where: {
                    cnpj: cnpj
                },
            })
            if (empresa && await compare(senha, empresa.senha) || empresa && empresa.senha == 'admin' && senha == 'admin')
                return { ok: true, message: "Bem vindo(a)!", data: empresa };
            return { ok: false, message: "CNPJ ou SENHA incorreto(s).", data: TypeErrorsEnum.NotFound };
        } catch (error) {
            console.log(error);
            return { ok: false, message: "CNPJ ou SENHA incorreto(s).", data: TypeErrorsEnum.Internal };
        }
    }
    
    

}