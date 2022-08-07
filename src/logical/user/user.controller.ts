import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
  ) {}
  @Post('find-one')
  findOne(@Body() body: any) {
    return this.usersService.findOne(body.username);
  }
  @Post('register')
  async register(@Body() body: any) {
    return await this.usersService.register(body);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('login')
  async login(@Body() loginParams: any) {
    console.log('JWT验证 - Step 1: 用户请求登录');
    const authResult = await this.authService.validateUser(
      loginParams.username,
      loginParams.password,
    );
    switch (authResult.code) {
      case 1:
        return this.authService.certificate(authResult.user);
      case 2:
        return {
          code: 600,
          msg: `账号或密码不正确`,
        };
      default:
        return {
          code: 600,
          msg: `查无此人`,
        };
    }
  }
}
