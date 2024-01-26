import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    try {
      // Trouver l'utilisateur par email
      const user = await prisma.user.findUnique({
        where: {
          email
        }
      });
      // Si l'utilisateur n'existe pas ou le mot de passe ne correspond pas
      if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      // Ici, vous devriez créer une session ou un token JWT pour l'utilisateur
      // Pour l'instant, nous allons simplement retourner un succès
      // Vous devez implémenter la logique de session ou de JWT icidemo@devias.iotest
      return res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
  } else {
    // Si la méthode n'est pas POST
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
