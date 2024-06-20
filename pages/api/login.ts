import { Response } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  return res
    .status(200)
    .json({ success: true, code: 200, message: "Allison is so cute :3" });
}

export default handler;
