import { EmpresaController } from '../controllers/EmpresaController';
import {AuthenticationService}from '../middleware/authentication';
import express from 'express';
const router = express.Router();
const empresaController = new EmpresaController()
const authentication = new AuthenticationService()


router.get('/findMany', authentication.validate, empresaController.findMany);
router.post('/create',  empresaController.create);
router.get('/validate/valid', authentication.validate);
router.post('/login', empresaController.login);

module.exports = router;
export default router;