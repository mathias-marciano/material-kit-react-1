import Head from 'next/head';
import { useRouter } from 'next/router';
import { Box, Container, Stack, Typography, Button, SvgIcon } from '@mui/material';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProjetsTable from 'src/sections/projets/projets-table';
import { useAuth } from 'src/hooks/use-auth';

const Page = () => {
  const [projets, setProjets] = useState([]);
  const auth = useAuth();
  console.log(auth.user.id)
  useEffect(() => {
    const fetchProjets = async () => {
      try {
        const userId = auth.user.id; // Récupérez l'userId de l'utilisateur connecté
        const response = await axios.get('/api/projects', {
          params: { userId } // Transmettez userId en tant que paramètre de requête
        });
        setProjets(response.data);
      } catch (err) {
        console.error('Erreur lors de la récupération des projets', err);
      }
    };

    fetchProjets();
  }, [auth.user]); 

  const router = useRouter(); // Utilisation du hook useRouter

  const handleAddProject = () => {
    router.push('/new_project'); // Redirection vers la page 'new_project'
  };

  return (
    <>
      <Head>
        <title>Mes Projets | Elyas Conseil</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h4">
                Mes Projets
              </Typography>
              <Button
                startIcon={<SvgIcon fontSize="small"><PlusIcon /></SvgIcon>}
                variant="contained"
                onClick={handleAddProject} // Ajoutez l'événement onClick ici
              >
                Ajouter
              </Button>
            </Stack>
            <ProjetsTable projets={projets} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
