require("dotenv").config();
const morgan = require('morgan');

import UsuarioRoutes from './rotas/UsuarioRoutes';
import ArquivoRoutes from './rotas/ArquivoRoutes';
import VagaRoutes from './rotas/VagaRoutes';
import EmpresaRoutes from './rotas/EmpresaRoutes';

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Socket } from "socket.io";
import { Server } from "socket.io";
import { handleUserConnected, handleUserDisconnected } from './utils/SocketController';
const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
const PORT = process.env.BACKEND_PORT || 3333;
const SOCKET_PORT = process.env.SOCKET_PORT || 4444;
const app = express();
export const io = new Server({ cors: corsOptions });
io.on('connection', (socket: Socket) => {
    socket.on('userConnected', (data: any) => handleUserConnected(socket, data.userId))
    socket.on('disconnecting', () => handleUserDisconnected(socket) );
});

//configurations
app.use(cors(corsOptions));
app.use(bodyParser.json());

process.env.NODE_ENV === 'production' ? app.use(morgan('combined')) : ''


app.use('/usuario', UsuarioRoutes);
app.use('/arquivos', ArquivoRoutes)
app.use('/vaga', VagaRoutes);
app.use('/empresa', EmpresaRoutes);


app.listen(PORT as number, () => console.log(`Listening on all interfaces:${PORT}`));
io.listen(SOCKET_PORT as number);
console.log(`Socket listening on ${SOCKET_PORT}`)
