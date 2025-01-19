export class WalletResponseDto {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly userId: number,
        public readonly balance: number,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
      ){}
}