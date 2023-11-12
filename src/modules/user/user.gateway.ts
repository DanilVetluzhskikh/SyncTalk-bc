import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { UserService } from './user.service';
import { Server } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtAuthSocket } from 'src/middleware/guards/jwt-auth-socket.guard';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:1337',
    methods: ['GET'],
    credentials: true,
  },
})
export class UsersGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthSocket)
  @SubscribeMessage('fetchUsers')
  async handleFetchUsers(
    @ConnectedSocket() client,
    @MessageBody() data: { search: string; page: number },
  ) {
    try {
      this.server.emit('usersResponseLoading');

      const usersData = await this.userService.users(
        client.handshake.headers.user.id,
        data.search,
        data.page,
      );

      this.server.emit('usersResponse', usersData);
    } catch (e) {
      this.server.emit(
        'usersResponseError',
        'Не удалось получить пользователей',
      );
    }
  }
}
