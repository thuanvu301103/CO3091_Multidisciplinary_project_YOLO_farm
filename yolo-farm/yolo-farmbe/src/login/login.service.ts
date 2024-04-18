import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Nguoi_dung } from '../schemas/nguoi_dung.schema';

@Injectable()
export class LoginService {

    constructor(@InjectModel('Nguoi_dung') private readonly Nguoi_dungModel: Model<Nguoi_dung>){}

    public async login(username, password) {
        const user = await this.Nguoi_dungModel.findOne({ username: username }).exec();
        //console.log("Input username: ", username);
        //console.log("Input password: ", password);
        //console.log("Result: ", user);
        if (!user) {
            // User not found
            return null;
        }

        // Validate password (you may use bcrypt or other password hashing libraries)
        const isPasswordValid = user.password === password;

        if (!isPasswordValid) {
            // Incorrect password
            return null;
        }

        // Password is valid, return the user object
        return {
            userid: user['_id'],
            username: user['username'],
            role: user['role']
        };
    }

}
