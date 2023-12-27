import { NextFunction, Request, Response } from "express";
import fs from 'fs';
import path from 'path';
import { AlunoService } from "../services/AlunoService";
import { arquivo, curso } from "@prisma/client";
import { getStatusResponseError } from "../utils/errorsHandlingUtils";
const alunoService = new AlunoService();

interface AlunoDatabase {
    cursos: curso[];
    arquivos: arquivo[];
}

const middleware = async (req: Request, res: Response, next: NextFunction) => {
    const method = req.method;
    let response: any;
    let alunoDatabase: AlunoDatabase = { cursos: [], arquivos: [] }

    if (method === 'DELETE') {
        let fromController = res.locals.controller
        responde(fromController, res)
        if (fromController.ok) {
            let alunoDeleted = fromController.data
            if (alunoDeleted.cursos.length == 0) {
                response = await deleteFromServer(alunoDeleted.arquivos)
            }
        }
    } else if (method === 'PUT') {
        let alunoBody = req.body
        //@ts-ignore
        alunoDatabase = await (await alunoService.findByCpf(req.params.cpf)).data
        // Obtendo os IDs dos arquivos do corpo da requisição
        const idsArquivosBody = alunoBody.arquivos.map((arquivo: arquivo) => arquivo.id);
        // Filtrando os arquivos do banco de dados que não estão presentes no corpo da requisição
        const idFilesToDelete = alunoDatabase.arquivos
            .filter((fileDB) => !idsArquivosBody.includes(fileDB.id))
            .map((fileToDelete) => ({ id: fileToDelete.id, caminho: fileToDelete.caminho }));
        response = await deleteFromServer(idFilesToDelete)
        if (response)
            req.body = { ...req.body, idFilesToDelete };
        next();
    }

};

const deleteFromServer = async (files: any) => {
    try {
        const deletePromises = files.map(async (file: arquivo) => {
            const filePath = path.join('./uploads/', file.caminho);
            await fs.promises.unlink(filePath);
        });
        await Promise.all(deletePromises);
        return true;
    } catch (error) {
        console.error(error);
        return false; // Retorna false para indicar falha na exclusão do servidor.
    }
}

const responde = async (resposta: any, res: Response) => {
    if (resposta.ok)
        res.status(200).send(resposta)
    else {
        const status = getStatusResponseError(resposta)
        res.status(status).send(resposta)
    }
}

export default {
    middleware,
    deleteFromServer,
    responde
};
