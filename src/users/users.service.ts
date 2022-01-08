import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly users: Map<string, string> = new Map();

  constructor() {
    this.addUser('test', 'test');
  }

  validateUser(username: string, password: string): boolean {
    const pass = this.users.get(username);
    return (pass && pass === password) || null;
  }

  hasUser(username: string): boolean {
    return this.users.has(username);
  }

  addUser(username: string, password: string): void {
    this.users.set(username, password);
  }
}
