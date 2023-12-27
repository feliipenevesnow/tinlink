import { getStatusResponseError } from '../utils/errorsHandlingUtils';
import { Request, Response } from 'express';
import { UsuarioService } from '../services/UsuarioService';
const usuarioService = new UsuarioService();
const jwt = require("jsonwebtoken");

export class UsuarioController {
    
    async getUsuarios(req: Request, res: Response) {
        const { search, page, perPage, orderBy } = req.query;
        const response = await usuarioService.findMany(String(search), Number(page),
            Number(perPage), String(orderBy), Number(req.params.idLogado));

        if (response.ok)
            return res.status(200).send(response.data)
        else {
            const status = getStatusResponseError(response)
            return res.status(status).send(response)
        }

    }

    async getUsuariosByType(req: Request, res: Response) {
        const { type, orderBy } = req.query;
        const response = await usuarioService.findByType(String(type), String(orderBy));

        if (response.ok)
            return res.status(200).send(response.data)
        else {
            const status = getStatusResponseError(response)
            return res.status(status).send(response)
        }

    }

    async createUsuario(req: Request, res: Response) {
        const response = await usuarioService.create(req.body);
        if (response.ok)
            return res.status(200).send(response)
        else {
            const status = getStatusResponseError(response)
            return res.status(status).send(response)
        }
    }

    async importProfessor(req: Request, res: Response) {
        const response = await usuarioService.importProfessores(req.body);
        if (response.ok)
            return res.status(200).send(response)
        else {
            const status = getStatusResponseError(response)
            return res.status(status).send(response)
        }
    }

    async updateUsuario(req: Request, res: Response) {
        const response = await usuarioService.update(req.body, Number(req.params.id));
        if (response.ok)
            return res.status(200).send(response)
        else {
            const status = getStatusResponseError(response)
            return res.status(status).send(response)
        }
    }

    async isCoordenadorStill(req: Request, res: Response) {
        const response = await usuarioService.verifyIfCoordenadorStill(Number(req.params.idUsuario));
        if (response.ok)
            return res.status(200).send(response)
        else {
            const status = getStatusResponseError(response)
            return res.status(status).send(response)
        }
    }

    async deleteUsuario(req: Request, res: Response) {
        const response = await usuarioService.delete(Number(req.params.id));
        if (response.ok)
            return res.status(200).send(response)
        else {
            const status = getStatusResponseError(response)
            return res.status(status).send(response)
        }
    }

    async findUsuarioById(req: Request, res: Response) {
        const response = await usuarioService.findById(Number(req.params.id));
        if (response.ok)
            return res.status(200).send(response.data)
        else {
            const status = getStatusResponseError(response)
            return res.status(status).send(response)
        }
    }

    async findUsuarioByProntuario(req: Request, res: Response) {
        const response = await usuarioService.findByProntuario(req.params.prontuario);
        if (response.ok)
            return res.status(200).send(response.data)
        else {
            const status = getStatusResponseError(response)
            return res.status(status).send(response)
        }
    }

    async changePasswordByEmail(req: Request, res: Response) {
        const {email, new_password} = req.body;
        const response = await usuarioService.changePasswordByEmail(email, new_password);
        if (response.ok)
            return res.status(200).send(response.data)
        else {
            const status = getStatusResponseError(response)
            return res.status(status).send(response)
        }
    }

    async login(req: Request, res: Response) {
        //desestruturacao
        const { prontuario, senha } = req.body;
        const response = await usuarioService.findToLogin(prontuario, senha);
        if (response.ok) {
            const payload = {
                userProntuario: prontuario,
                expiresIn: 10800, // expires in 3h
            }
          const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET); 
          return res.status(200).json({
            token: token,
            data: response.data
          });
        }
        const status = getStatusResponseError(response)
        return res.status(status).json({ message: "Login failed!" });
      }
}
