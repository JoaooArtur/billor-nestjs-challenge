export abstract class DomainException extends Error {
    public readonly name: string;
  
    constructor(
      public readonly message: string,
      public readonly statusCode: number = 400
    ) {
      super(message);
      this.name = this.constructor.name;
      Error.captureStackTrace(this, this.constructor);
    }
  }