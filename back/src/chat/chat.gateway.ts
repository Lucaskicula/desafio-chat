import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { PrismaService } from '../../prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})

export class ChatGateway
implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private prisma: PrismaService
  ) {}

  @WebSocketServer()
  server!: Server;

  async handleConnection(client: Socket) {

    console.log(`Usuário entrou: ${client.id}`);

    // busca histórico no banco
    const history =
      await this.prisma.message.findMany({
        orderBy: {
          createdAt: 'asc'
        }
      });

    // envia histórico apenas para quem conectou
    client.emit(
      'chatHistory',
      history
    );

    // avisa todos
    this.server.emit('presence', {
      message: 'Usuário entrou'
    });

  }

  handleDisconnect(client: Socket) {

    console.log(`Usuário saiu: ${client.id}`);

    this.server.emit('presence', {
      message: 'Usuário saiu'
    });

  }

  @SubscribeMessage('msgToServer')
  async handleMessage(
    @MessageBody()
    data: {
      sender: string;
      message: string;
    }
  ) {

    console.log('Recebeu:', data);

    // salva no banco
    const savedMessage =
      await this.prisma.message.create({
        data: {
          sender: data.sender,
          message: data.message
        }
      });

    // envia para todos conectados
    this.server.emit(
      'msgToClient',
      savedMessage
    );

  }

}