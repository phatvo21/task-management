import { BaseAbstractRepository } from "repositories/base/base.abstract.repository";
import { getRepository } from "typeorm";
import { Service } from "typedi";
import { Users } from "databases/entities/Users";
import { IUserRepository } from "components/user/interfaces/IUserRepository";

@Service("user-repository.factory")
export class UserRepository extends BaseAbstractRepository<Users> implements IUserRepository {
   constructor() {
      super(getRepository(Users));
   }
}
