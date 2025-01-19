export class UserUpdatedEvent {
    constructor(
      public readonly id: number,
      public readonly name: string,
      public readonly email: string,
      public readonly password: string,
      public readonly role: string,
      public readonly UpdatedAt: Date,
    ) {}
  }