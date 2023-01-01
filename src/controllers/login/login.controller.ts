import { Request, Response } from "express";
import { iLogin } from "../../interfaces/login.interface";
import { loginService } from "../../services/login/login.service";

const loginController = async (req: Request, res: Response) => {

  const data: iLogin = req.body

  const token = await loginService(data)

  return res.json(token)
}

export { loginController }