import { validate } from "class-validator";
import { LoginDto } from "./login.dto";

describe("LoginDto", () => {
  it("should pass validation with valid email and password", async () => {
    const dto = new LoginDto();
    dto.email = "test@example.com";
    dto.password = "password123";

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it("should fail validation with invalid email", async () => {
    const dto = new LoginDto();
    dto.email = "invalid_email";
    dto.password = "password123";

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty("isEmail", "Invalid Email");
  });

  it("should fail validation with password less than 8 characters", async () => {
    const dto = new LoginDto();
    dto.email = "test@example.com";
    dto.password = "short";

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty(
      "minLength",
      "Password must have at least 8 characters"
    );
  });

  it("should fail validation with non-string password", async () => {
    const dto = new LoginDto();
    dto.email = "test@example.com";
    // wrong password type
    dto.password = 123 as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty(
      "isString",
      "Password must be a string"
    );
  });
});
