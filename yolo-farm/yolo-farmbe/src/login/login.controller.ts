import { Controller, Post, Query, Body } from '@nestjs/common';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {

    constructor(private readonly loginService: LoginService) { }

    @Post()
    async login(
        @Body() credentials: any
    ) {
        console.log("Body: ", credentials)
        const login_res = await this.loginService.login(credentials['username'], credentials['password']);
        if (login_res) {
            return {
                message: 'Login successful',
                userid: login_res['userid'],
                username: login_res['username'],
                role: login_res['role']
            }
        } else {
            return { message: 'Invalid credentials' }
        }
    }
}
