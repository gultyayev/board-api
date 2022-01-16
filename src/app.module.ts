import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { jwtConstants } from './auth/constants';
import { JwtStrategy } from './auth/jwt.strategy';
import { LocalStrategy } from './auth/local.strategy';
import { BoardController } from './board/board.controller';
import { UsersService } from './users/users.service';
import { ColumnsService } from './columns/columns.service';
import { TasksService } from './tasks/tasks.service';
import { ColumnsController } from './columns/columns.controller';
import { TasksController } from './tasks/tasks.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AppController, AuthController, BoardController, ColumnsController, TasksController],
  providers: [
    AppService,
    UsersService,
    LocalStrategy,
    AuthService,
    JwtStrategy,
    ColumnsService,
    TasksService,
  ],
})
export class AppModule {}
