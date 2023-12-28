import { UsuarioController } from '../controllers/UsuarioController';
import {AuthenticationService}from '../middleware/authentication';
import express from 'express';
const router = express.Router();
const usuarioController = new UsuarioController()
const authentication = new AuthenticationService()

// Defina as rotas para usuario neste arquivo
router.get('/findMany', authentication.validate, usuarioController.findMany);
router.get('/:id', authentication.validate, usuarioController.findById);
router.put('/update/:id', authentication.validate, usuarioController.update);
router.post('/create',  usuarioController.create);
router.delete('/delete/:id', authentication.validate, usuarioController.delete);
router.post('/login', usuarioController.login);
router.get('/validate/valid', authentication.validate);

module.exports = router;
export default router;