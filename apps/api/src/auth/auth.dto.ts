import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(10)
  @MaxLength(128)
  // one lowercase, one uppercase, one digit — documented in SECURITY.md
  @Matches(/[a-z]/, { message: "password needs a lowercase letter" })
  @Matches(/[A-Z]/, { message: "password needs an uppercase letter" })
  @Matches(/\d/, { message: "password needs a digit" })
  password!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(64)
  displayName!: string;
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(1)
  password!: string;
}
