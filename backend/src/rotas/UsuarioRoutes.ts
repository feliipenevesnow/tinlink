import { UsuarioController } from '../controllers/UsuarioController';
import {AuthenticationService}from '../middleware/authentication';
import express from 'express';
const router = express.Router();
const usuarioController = new UsuarioController()
const authentication = new AuthenticationService()

// Defina as rotas para usuario neste arquivo
router.get('/findMany/:idLogado', authentication.validate, usuarioController.getUsuarios);
router.get('/findByType', authentication.validate, usuarioController.getUsuariosByType);
router.put('/update/:id', authentication.validate, usuarioController.updateUsuario);
router.post('/create', authentication.validate, usuarioController.createUsuario);
router.post('/import/professores', authentication.validate, usuarioController.importProfessor);
router.delete('/delete/:id', authentication.validate, usuarioController.deleteUsuario);
router.get('/:id', authentication.validate, usuarioController.findUsuarioById);
router.get('/prontuario/:prontuario', authentication.validate, usuarioController.findUsuarioByProntuario);
router.post('/login', usuarioController.login);
router.put('/recoveryPassword', usuarioController.changePasswordByEmail);
router.get('/validate/valid', authentication.validate);
router.get('/verifyIsCoordenador/:idUsuario', authentication.validate, usuarioController.isCoordenadorStill);

module.exports = router;
export default router;