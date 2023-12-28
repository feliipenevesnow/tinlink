import { getStatusResponseError } from '../utils/errorsHandlingUtils';
import { Request, Response } from 'express';
import { EmpresaService } from '../services/EmpresaService';
const empresaService = new EmpresaService();
const jwt = require("jsonwebtoken");

export class EmpresaController {
    
    async findMany(req: Request, res: Response) {

        const response = await empresaService.findMany();

        if (response.ok)
            return res.status(200).send(response.data)
        else {
            const status = getStatusResponseError(response)
            return res.status(status).send(response)
        }

    }



    async create(req: Request, res: Response) {
        const response = await empresaService.create(req.body);
        if (response.ok)
            return res.status(200).send(response)
        else {
            const status = getStatusResponseError(response)
            return res.status(status).send(response)
        }
    }

    async login(req: Request, res: Response) {
 
        const { cnpj, senha } = req.body;
        const response = await empresaService.findToLogin(cnpj, senha);
        if (response.ok) {
            const payload = {
                userCNPJ: cnpj,
                expiresIn: 10800, 
            }
          const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET); 
          return res.status(200).json({
            token: token,
            data: response.data
          });
        }
        const status = getStatusResponseError(response)
        return res.status(status).json({ message: "CNPJ ou SENHA incorreto(s)." });
      }

 
}
