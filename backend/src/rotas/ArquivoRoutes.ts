import { AuthenticationService } from '../middleware/authentication';
import express from 'express';
const router = express.Router();
import { storage } from '../utils/multerConfig';
import multer from 'multer';
const authentication = new AuthenticationService()

const upload = multer({storage: storage})

router.use("/", express.static("uploads"));
router.post("/upload", authentication.validate, upload.array("file"), (req, res)=>{
    //@ts-ignore
    const filenames = req.files.map(file => ({nome: file.originalname, caminho: file.filename}));
    return res.json(filenames);
});

module.exports = router;
export default router;