// pages/generate/[id].js
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Container, Divider, Grid, Stack, TextField, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import Head from 'next/head';

const GenerateStateOfArtPage = ({ projet }) => {
    const [file, setFile] = useState(null);
    const [etatDeLArt, setEtatDeLArt] = useState('');
    const router = useRouter();
    const { id } = router.query;
  
    const handleFileChange = (event) => {
        setFile(event.target.files); // Notez que nous définissons ici un tableau de fichiers
      };

    const handleGenerate = async () => {
        try {
          const formData = new FormData();
          // Ajouter chaque fichier à FormData
          Array.from(file).forEach((file) => {
            formData.append('files', file);
          });
        
          const response = await axios.post(`http://localhost:3000/api/generate/${id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log(response.data);
        } catch (error) {
          console.error('Erreur lors de la génération de l\'état de l\'art', error);
        }
      };

  return (
    <>
      <Head>
        <title>Générer l'état de l'art | {projet.nomProjet}</title>
      </Head>
      <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={6}>
          <div>
            <Typography variant="h4">
              Générer l'état de l'art
            </Typography>
          </div>
          <div>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
                lg={4}
              >
                <Card>
                    <CardContent>
                    <Box
                        sx={{
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column'
                        }}
                    >
                        <input type="file" name="files" onChange={handleFileChange} multiple />
                    </Box>
                    </CardContent>
                    <Divider />
                    <CardActions>
                    <Button
                        fullWidth
                        variant="text"
                        onClick={handleGenerate}
                    >
                        Générer
                    </Button>
                    </CardActions>
                    </Card>
              </Grid>
              <Grid
                xs={12}
                md={6}
                lg={8}
              >
                <Card>
                    <CardHeader subheader="Modifier pour valider" title="Etat de l'art généré" />
                    <CardContent sx={{ pt: 0 }}>
                    <Box sx={{ m: -1.5 }}>
                        <TextField
                        fullWidth
                        label="Etat de l'art du projet"
                        margin="normal"
                        multiline
                        name="etatDeLArt"
                        value={etatDeLArt}
                        onChange={(e) => setEtatDeLArt(e.target.value)}
                        required
                        rows={10}
                        />
                    </Box>
                    </CardContent>
                    <Divider />
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button color="primary" variant="contained" type="submit">
                        Valider
                    </Button>
                    </CardActions>
                </Card>
              </Grid>
            </Grid>
          </div>
        </Stack>
      </Container>
    </Box>
    </>
  );
};

GenerateStateOfArtPage.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export async function getServerSideProps(context) {
  const { id } = context.params;
  const response = await axios.get(`http://localhost:3000/api/projects/${id}`);
  return {
    props: {
      projet: response.data
    }
  };
}

export default GenerateStateOfArtPage;
