import { Roles } from "src/modules/auth/domain/enumerations/roles.enum";

export class CreateUserCommand {
    constructor(public readonly name: string, public readonly email: string, public readonly password: string, public readonly role: Roles) {}
  }