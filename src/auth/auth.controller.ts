import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { TokenDto } from './dtos/token.dto';
import { User } from './dtos/user.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  @ApiBody({
    type: User,
  })
  @ApiResponse({
    type: TokenDto,
  })
  auth(@Req() request: Request) {
    return this.authService.login(request.user as string);
  }

  @Post('signup')
  addUser(@Body() user: CreateUserDto, @Res() res: Response) {
    if (this.usersService.hasUser(user.username)) {
      return res.status(406).send('User exists').end();
    }

    this.usersService.addUser(user.username, user.password);
    res.status(201).end();
  }
}
