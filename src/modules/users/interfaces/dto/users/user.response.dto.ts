export class UserResponseDto {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly email: string,
        public readonly role: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
      ){}
}