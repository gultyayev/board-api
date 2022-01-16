import { Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs';

const path = 'users.json';

@Injectable()
export class UsersService {
  private users: Record<string, string> = {};

  constructor() {
    const users = readFileSync(path, {
      encoding: 'utf-8',
      flag: 'a+',
    });

    if (users) {
      const obj: Record<string, string> = JSON.parse(users);
      this.users = obj;
    } else {
      this.addUser('test', 'test');
    }
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
    writeFileSync(path, JSON.stringify(this.users), {
      encoding: 'utf-8',
    });
  }
}
