import { getStatusResponseError } from '../utils/errorsHandlingUtils';
import { Request, Response } from 'express';
import { UsuarioService } from '../services/UsuarioService';
const usuarioService = new UsuarioService();
const jwt = require("jsonwebtoken");

export class UsuarioController {
    
    async findMany(req: Request, res: Response) {

        const response = await usuarioService.findMany();

        if (response.ok)
            return res.status(200).send(response.data)
        else {
            const status = getStatusResponseError(response)
            return res.status(status).send(response)
        }

    }



    async create(req: Request, res: Response) {
        const response = await usuarioService.create(req.body);
        if (response.ok)
            return res.status(200).send(response)
        else {
            const status = getStatusResponseError(response)
            return res.status(status).send(response)
        }
    }

 
    async update(req: Request, res: Response) {
        const response = await usuarioService.update(req.body, Number(req.params.codigo));
        if (response.ok)
            return res.status(200).send(response)
        else {
            const status = getStatusResponseError(response)
            return res.status(status).send(response)
        }
    }

 

    async delete(req: Request, res: Response) {
        const response = await usuarioService.delete(Number(req.params.id));
        if (response.ok)
            return res.status(200).send(response)
        else {
            const status = getStatusResponseError(response)
            return res.status(status).send(response)
        }
    }

    async findById(req: Request, res: Response) {
        const response = await usuarioService.findById(Number(req.params.id));
        if (response.ok)
            return res.status(200).send(response.data)
        else {
            const status = getStatusResponseError(response)
            return res.status(status).send(response)
        }
    }

 
    async login(req: Request, res: Response) {
 
        const { cpf, senha } = req.body;
        const response = await usuarioService.findToLogin(cpf, senha);
        if (response.ok) {
            const payload = {
                userCPF: cpf,
                expiresIn: 10800, 
            }
          const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET); 
          return res.status(200).json({
            token: token,
            data: response.data
          });
        }
        const status = getStatusResponseError(response)
        return res.status(status).json({ message: "CPF ou SENHA incorreto(s)." });
      }
}
