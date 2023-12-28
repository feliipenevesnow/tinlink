import { getStatusResponseError } from '../utils/errorsHandlingUtils';
import { Request, Response } from 'express';
import { VagaService } from '../services/VagaService';
const vagaService = new VagaService();
const jwt = require("jsonwebtoken");

export class VagaController {
    
    async findMany(req: Request, res: Response) {

        const response = await vagaService.findMany();

        if (response.ok)
            return res.status(200).send(response.data)
        else {
            const status = getStatusResponseError(response)
            return res.status(status).send(response)
        }

    }

}
