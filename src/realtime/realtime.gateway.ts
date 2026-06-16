import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RealtimeGateway {
  @WebSocketServer()
  server!: Server;

  private connectedUsers = new Map<number, string>();

  @SubscribeMessage('join')
  handleJoin(
    @MessageBody() userId: number,
    @ConnectedSocket() client: Socket,
  ) {
    this.connectedUsers.set(
      userId,
      client.id,
    );

    console.log(
      `Usuario ${userId} conectado al chat`,
    );
  }

  sendMessageToUser(
    userId: number,
    message: any,
  ) {
    const socketId =
      this.connectedUsers.get(userId);

    if (socketId) {
      this.server
        .to(socketId)
        .emit('newMessage', message);

      console.log(
        `Mensaje enviado en tiempo real a usuario ${userId}`,
      );
    }
  }
}