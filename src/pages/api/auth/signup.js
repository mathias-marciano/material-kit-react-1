// pages/api/auth/signup.js

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, name, password } = req.body;

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // Créer un nouvel utilisateur dans la base de données
      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
        },
      });

      return res.status(200).json({ message: 'User created successfully', user });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: 'Something went wrong', error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
