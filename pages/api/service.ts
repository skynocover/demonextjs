import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../database/db';
import { Resp, Tresp } from '../../resp/resp';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      return await postSerivce();
    case 'DELETE':
      return await deleteService();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function postSerivce() {
    try {
      const { name, serviceType, host, username, privateKey } = req.body;
      await prisma.service.create({
        data: {
          name,
          serviceType,
          host,
          username,
          privateKey,
        },
      });
      res.json(Resp.success);
    } catch (error) {
      console.log(error.message);
      res.json({ error: error.message, ...Resp.sqlExecFail });
    }
  }

  async function deleteService() {
    try {
      const id = +req.query.id;
      if (isNaN(id)) {
        res.json(Resp.paramInputFormateError);
        return;
      }

      await prisma.serviceDB.deleteMany({ where: { service: { id } } });
      await prisma.service.delete({ where: { id } });
      res.json(Resp.success);
    } catch (error) {
      console.log(error.message);
      res.json({ error: error.message, ...Resp.sqlExecFail });
    }
  }
};
