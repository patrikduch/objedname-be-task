export class LoginCommandRequest {
    constructor(
        public readonly email: string,
        public readonly password: string,
    ) {}
}