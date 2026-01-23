import type { UserRecord } from "src/types/UserRecord";

export class UserRepository {
  async create(data: UserRecord) { }
  async update(data: UserRecord) { }
  async findOne(id: string) { }
  async delete(id: string) { }
}