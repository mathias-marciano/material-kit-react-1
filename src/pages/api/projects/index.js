import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { userId } = req.query;
    const userIdInt = parseInt(userId, 10);
    try {
      const projets = await prisma.projets.findMany({
        where: {
          id_user: userIdInt,
        },
        select: {
          id: true,
          nomProjet: true,
          client: true,
          etatDeLArt: true,
          createdAt: true
        }
      });

      res.status(200).json(projets);
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Erreur lors de la récupération des projets', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
