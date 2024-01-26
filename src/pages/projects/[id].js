import { format } from 'date-fns';
import { Box, Button, Card, CardContent, Container, Stack, SvgIcon, Typography } from '@mui/material';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import Head from 'next/head';
import axios from 'axios';
import { useRouter } from 'next/router';

const Page = ({ projet }) => {
  const formattedDate = format(new Date(projet.createdAt), 'dd/MM/yyyy');
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Head>
        <title>{projet.nomProjet} | Détails du Projet</title>
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
                {projet.nomProjet}
              </Typography>
              <Button
                startIcon={<SvgIcon fontSize="small"><PlusIcon /></SvgIcon>}
                variant="contained"
                onClick={() => router.push(`/generate/${id}`)} // Redirige vers la page de génération
              >
                Générer l'état de l'art
              </Button>
            </Stack>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    alignItems: 'left',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Typography color="text.secondary" variant="body1">
                    Client: {projet.client}
                  </Typography>
                  <Typography color="text.secondary" variant="body1">
                    Description: {projet.description}
                  </Typography>
                  <Typography color="text.secondary" variant="body1">
                    État de l'art: {projet.etatDeLArt}
                  </Typography>
                  <Typography color="text.secondary" variant="body1">
                    Date de création: {formattedDate}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
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

export async function getServerSideProps(context) {
  const { id } = context.params;
  const response = await axios.get(`http://localhost:3000/api/projects/${id}`); // Ajustez l'URL selon votre configuration
  return {
    props: {
      projet: response.data
    }
  };
}

export default Page;
