import { userRepository } from "../../repositories/user.repository";
import { iLogin } from "../../interfaces/login.interface";
import { sign } from "jsonwebtoken";
import { hash } from "bcrypt";

const loginService = async (user: iLogin): Promise<{ token: string }> => {
  const findUser = await userRepository.findOneBy({ email: user.email });

  if (!findUser) {
    throw new Error("Invalid credentials");
  }

  const passwordMatch = await hash(user.password, findUser.password);

  if (!passwordMatch) {
    throw new Error("Invalid credentials");
  }

  const token = sign(
    { email: findUser.email },
    process.env.SECRET_KET as string,
    { subject: findUser.id }
  );

  return { token };
};

export { loginService };
