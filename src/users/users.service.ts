import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

const path = 'users.json';

@Injectable()
export class UsersService {
  private users: Record<string, string> = {};

  constructor() {
    const users = fs.readFileSync(path, {
      encoding: 'utf-8',
      flag: 'a+',
    });
    const obj: Record<string, string> = JSON.parse(users) || {};

    if (Object.keys(obj).length) {
      this.users = obj;
    } else {
      this.addUser('test', 'test');
    }

    console.log({ users: this.users });
  }

  validateUser(username: string, password: string): boolean {
    const pass = this.users[username];
    return (pass && pass === password) || null;
  }

  hasUser(username: string): boolean {
    return username in this.users;
  }

  addUser(username: string, password: string): void {
    this.users[username] = password;
    fs.writeFileSync(path, JSON.stringify(this.users), {
      encoding: 'utf-8',
    });
  }
}
