import { VagaController } from '../controllers/VagaController';
import {AuthenticationService}from '../middleware/authentication';
import express from 'express';
const router = express.Router();
const vagaController = new VagaController()
const authentication = new AuthenticationService()

// Defina as rotas para usuario neste arquivo
router.get('/findMany', authentication.validate, vagaController.findMany);


module.exports = router;
export default router;