import { Socket } from 'socket.io';

const connectedUsers: { [userId: number]: Socket } = {};

function handleUserConnected(socket: Socket, idUser: any) {
      const userId = idUser;
      // Associar o socket ao usuário no objeto connectedUsers
      connectedUsers[userId] = socket;
}

function handleUserDisconnected(socket: Socket) {
  // Encontrar o userId associado a este socket e removê-lo do objeto connectedUsers
  const userId: any = Object.keys(connectedUsers).find((key: any) => connectedUsers[key] === socket);
  if (userId) {
    delete connectedUsers[userId];
  }
}

function emitNewNotificationsToUsers(userIds: number[]) {
  userIds.forEach((userId) => {
    const socketUser = connectedUsers[userId];
    if (socketUser) {
      socketUser.emit('newNotifications');
    }
  });
}
export { handleUserDisconnected, handleUserConnected, connectedUsers, emitNewNotificationsToUsers}
