import { vaga } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { TypeErrorsEnum } from '../enum/TypeErrorEnum';

export class VagaService {

    async findMany() {
        try {
    
            const [vagas, length] = await Promise.all([
                prisma.vaga.findMany(),
                prisma.vaga.count(),
            ]);

            const data = {
                vagas,
                length,
            };
            return { ok: true, message: "Found successfully!", data: data };
        } catch (error) {
            console.log(error);
            return { ok: false, message: "Internal error!", data: TypeErrorsEnum.Internal };
        }
    }

}