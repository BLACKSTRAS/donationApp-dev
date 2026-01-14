import { Request, Response } from "express";
import { UsersModel } from "./usersModel";

export const UsersController = {

  async getUsers(req: Request, res: Response) {
    const { search = "", page = "1", limit = "10" } = req.query;

    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const users = await UsersModel.getAll(String(search), take, skip);

    res.json({
      success: true,
      data: users,
    });
  },


  async getUserDetail(req: Request, res: Response) {
    const { id } = req.params;
    const user = await UsersModel.getById(Number(id));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      data: user,
    });
  },

  async changeRole(req: Request, res: Response) {
    const { id } = req.params;
    const { role } = req.body;

    await UsersModel.updateRole(Number(id), role);

    res.json({ success: true });
  },

  async changeStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    await UsersModel.updateStatus(Number(id), status);

    res.json({ success: true });
  },
};
