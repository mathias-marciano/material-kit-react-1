import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { projectName, client, description, userId } = req.body;
    try {
      const projet = await prisma.projets.create({
        data: {
          id_user: userId,
          nomProjet: projectName,
          client: client,
          description: description,
          etatDeLArt: '',
        }
      });

      return res.status(200).json({ projet });
    } catch (error) {
      console.error("Erreur lors de la création du projet:", error);
      return res.status(500).json({ message: 'Erreur lors de la création du projet', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
