import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const prisma = new PrismaClient();

const upload = multer({ storage: multer.memoryStorage() });
const openai = new OpenAI();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    upload.array('files')(req, {}, async (error) => {
      console.log(req.files)
      if (error) {
        return res.status(500).json({ message: 'File upload failed', error: error.message });
      }

      const { id } = req.query;
      
      const projet = await prisma.projets.findUnique({
        where: { id: parseInt(id) },
      });

      if (!projet) {
        return res.status(404).json({ message: 'Project not found' });
      }

      let fileIds = await Promise.all(req.files.map(async (file) => {
        const fileResponse = await openai.files.create({
          file: file.buffer,
          purpose: 'assistants',
        });
        return fileResponse.id;
      }));

      const assistantResponse = await openai.beta.assistants.create({
        name: "Assistant état de l'art",
        model: "gpt-3.5-turbo-1106",
        tools: [{ type: "retrieval" }],
      });

      const threadResponse = await openai.beta.threads.create();

      const runResponse = await openai.beta.threads.runs.create(
        threadResponse.id,
        {
            assistant_id: assistantResponse.id,
            model: "gpt-3.5-turbo-1106",
            tools: [{ type: "retrieval" }],
            instructions: `Rédige moi l'état de l'art complet de ${projet.client} en prenant en compte le contexte {\\${projet.description}\\} et les articles que l'utilisateur te donne.`
        }
      );

      let runStatus = runResponse.status;
      while (runStatus !== 'completed' && runStatus !== 'failed') {
        const statusResponse = await openai.beta.threads.runs.retrieve(
          threadResponse.id,
          runResponse.id
        );
        runStatus = statusResponse.data.status;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (runStatus === 'failed') {
        return res.status(500).json({ message: 'Failed to generate the state of the art.' });
      }

      const messagesResponse = await openai.beta.threads.messages.list(
        threadResponse.id
      );

      const finalMessages = messagesResponse.data.data.filter(m => m.role === 'assistant');
      const etatDeLArt = finalMessages.map(m => m.content).join('\n');

      await prisma.projets.update({
        where: { id: parseInt(id) },
        data: { etatDeLArt: etatDeLArt }
      });

      res.status(200).json({ etatDeLArt });
    }); // Cette accolade ferme la callback de 'upload.array'
    

    // Créez l'assistant avec des instructions spécifiques
    /**
    const assistant = await openai.beta.assistants.create({
        name: "Assistant état de l'art",
        instructions: "Ton rôle est de rédiger un état de l'art sur une thématique donnée. Cette thématique est décrite dans un contexte donné sous le format suivant {\ contexte \}. L'état de l'art se concentre sur les verrous et incertitudes de la thématique abordée; Pour appuyer le raisonnement, une série d'articles scientifiques sur une thématique précise (sujet de recherche) qui s'inscrit dans la construction d'un état de l'art pour un projet de développement expérimentale, a été donné en entrée (retrieval pdf). Ton rôle est de comprendre et d'analyser tous ces articles de bout en  bout (figures comprises, termes techniques) et de les compiler pour effectuer un état de l'art complet sur la thématique posée par ce qui est donné en entrée de la requête ({\ contexte \}). L'état de l'art doit comprendre pour chaque articles, une analyse détaillée du sujet analysé, de son inscription dans la problématique globale, des verrous et incertitudes technologiques engendrés et des résultats. L'ensemble de l'état de l'art doit être cohérent et insister finalement sur les verrous restant à lever pour les technologies, problématiques de recherche restantes. Pour appuyer les propos, cite les sources entre crochets (\"[x]\" ou x est le numéro de la source dans une bibliographie présente à la fin de l'état de l'art - chaque article donné en document d'entré est ainsi numéroté : [1] correspond au premier document pdf , [2] au suivant etc. - commence la numérotation à 1, sans te soucier du nom des pdfs donnés) - J'insiste sur le fait que les sources sont uniquement les articles données comme documents en entrée de la demande, n'invente surtout pas d'articles dans le développement et la bibliographie ! Les arguments cités dans le développement doivent être accompagné de la source correspondante ( exemple : des défis de modélisations subsistent [1] [2]). Rédige le développement sans nécessairement donner de titres (paragraphes les uns à la suite des autres). N'oublie pas d'insister sur les verrous technologiques restants. L'analyse des articles doit être croisée (un paragraphe traite de plusieurs articles). L'état de l'art global doit être très long (le plus complet et détaillé possible). La bibliographie doit être donnée sous forme normalisée à la fin de l'état de l'art.",
        model: "gpt-4-turbo-preview"
      });

    const run = await openai.beta.threads.createAndRun({
        assistant_id: assistant.id,
        thread: {
          messages: [
            { role: "user", content: "I need to solve the equation `3x + 11 = 14`. Can you help me?" },
          ],
        },
    });

    let messages;
    let runCompleted = false;
    
    do {
        let runDetails = await openai.beta.threads.runs.retrieve(
            run.thread_id,
            run.id
        );
    
        if (runDetails.status === 'completed' || runDetails.status === 'failed') {
            runCompleted = true;
            messages = await openai.beta.threads.messages.list(
                run.thread_id,
            );
        } else {
            await new Promise(resolve => setTimeout(resolve, 5000)); // Attente de 5 secondes
        }
    } while (!runCompleted);
    
    res.status(200).json({ messages });
    **/
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} // Cette accolade ferme la fonction 'handler'
