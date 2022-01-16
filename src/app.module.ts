import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { jwtConstants } from './auth/constants';
import { JwtStrategy } from './auth/jwt.strategy';
import { LocalStrategy } from './auth/local.strategy';
import { BoardController } from './board/board.controller';
import { ColumnsController } from './columns/columns.controller';
import { ColumnsService } from './columns/columns.service';
import { TasksController } from './tasks/tasks.controller';
import { TasksService } from './tasks/tasks.service';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [
    AuthController,
    BoardController,
    ColumnsController,
    TasksController,
  ],
  providers: [
    UsersService,
    LocalStrategy,
    AuthService,
    JwtStrategy,
    ColumnsService,
    TasksService,
  ],
})
export class AppModule {}
