import {
  Req,
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuth } from 'src/middleware/guards/jwt-auth.guard';
import { Request, Response } from 'express';
import { UserInfoDto } from './dto/user-info-dto';
import { StatusDto } from './dto/status-dto';
import { RequestFriendDto } from './dto/request-friend-dto';
import { EventsService } from '../event/event.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly eventsService: EventsService,
  ) {}

  @UseGuards(JwtAuth)
  @Post('auth')
  async info(@Req() req: Request) {
    return this.userService.info(req?.user?.email);
  }

  @UseGuards(JwtAuth)
  @Post('info')
  async changeUserInfo(@Body() userInfo: UserInfoDto, @Req() req: Request) {
    return this.userService.changeUserInfo(req?.user?.email, userInfo);
  }

  @UseGuards(JwtAuth)
  @Post('status')
  async changeStatus(@Body() statusDto: StatusDto, @Req() req: Request) {
    return this.userService.changeStatus(req?.user?.email, statusDto);
  }

  @UseGuards(JwtAuth)
  @Get('all')
  async users(@Req() req: Request) {
    return this.userService.users(
      req?.user?.id,
      req.query.search as string,
      Number(req.query.page),
    );
  }

  @UseGuards(JwtAuth)
  @Post('request-friend')
  async requestFriend(
    @Req() req: Request,
    @Body() requestInfo: RequestFriendDto,
  ) {
    return this.userService.requestFriend(req?.user?.id, requestInfo.friendId);
  }

  @UseGuards(JwtAuth)
  @Post('decline-friend')
  async declineFriend(
    @Req() req: Request,
    @Body() requestInfo: RequestFriendDto,
  ) {
    return this.userService.declineFriend(req?.user?.id, requestInfo.friendId);
  }

  @UseGuards(JwtAuth)
  @Post('accept-friend')
  async acceptFriend(
    @Req() req: Request,
    @Body() requestInfo: RequestFriendDto,
  ) {
    return this.userService.acceptFriend(req?.user?.id, requestInfo.friendId);
  }

  @UseGuards(JwtAuth)
  @Post('decline-my-request')
  async declineMyRequest(
    @Req() req: Request,
    @Body() requestInfo: RequestFriendDto,
  ) {
    return this.userService.declineMyFriendRequest(
      req?.user?.id,
      requestInfo.friendId,
    );
  }

  @UseGuards(JwtAuth)
  @Post('delete-friend')
  async deleteFriend(
    @Req() req: Request,
    @Body() requestInfo: RequestFriendDto,
  ) {
    return this.userService.deleteFriend(req?.user?.id, requestInfo.friendId);
  }

  @UseGuards(JwtAuth)
  @Get('subscribe')
  longPolling(@Req() req: Request, @Res() res: Response) {
    this.eventsService.subscribe(req?.user?.id, (data: any) => {
      res.json(data);
    });
  }
}
