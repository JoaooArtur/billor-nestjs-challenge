export class Email {
    private readonly email: string;
  
    constructor(email: string) {
      if (!this.validate(email)) {
        throw new Error('Invalid email format');
      }
      this.email = email;
    }
  
    private validate(email: string): boolean {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  
    toString(): string {
      return this.email;
    }
  }
  