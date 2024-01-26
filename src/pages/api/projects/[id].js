import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { id } = req.query; // Récupérez l'ID du projet à partir de la requête
      const projetId = parseInt(id, 10);

      // Vérifiez si l'ID est un nombre valide
      if (isNaN(projetId)) {
        return res.status(400).json({ message: "ID de projet invalide" });
      }

      const projet = await prisma.projets.findUnique({
        where: { id: projetId },
        // Spécifiez les champs que vous voulez inclure dans la réponse
        select: {
          id: true,
          nomProjet: true,
          client: true,
          description: true,
          etatDeLArt: true,
          createdAt: true
        }
      });

      // Vérifiez si le projet existe
      if (!projet) {
        return res.status(404).json({ message: "Projet non trouvé" });
      }

      res.status(200).json(projet);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
