// pages/api/users.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Créer un nouvel utilisateur
    const { email, name } = req.body;
    try {
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
        },
      });
      return res.status(201).json(newUser);
    } catch (e) {
      return res.status(400).json({ message: "Something went wrong", error: e.message });
    }
  } else if (req.method === 'GET') {
    // Récupérer tous les utilisateurs
    try {
      const users = await prisma.user.findMany();
      return res.status(200).json(users);
    } catch (e) {
      return res.status(400).json({ message: "Something went wrong", error: e.message });
    }
  } else {
    // Méthode HTTP non prise en charge
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
