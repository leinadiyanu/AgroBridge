export class AuthRepository {
  constructor(private db: any) {}

  async createUser(user: any) {
    // TODO: implement DB insert
    return user;
  }

  async findByEmail(email: string) {
    // TODO: implement DB query
    return null;
  }
}
