import Head from 'next/head';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { NewProjectForm } from 'src/sections/new_project/new_project-form';
import axios from 'axios';
import { useAuth } from 'src/hooks/use-auth';

const Page = () => {  
  const auth = useAuth();
  console.log(auth.user)
  return (
    <>
      <Head>
        <title>
          Nouveau projet | Elyas Conseil
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">
                Nouveau projet
              </Typography>
            </div>
            <div>
              <Grid>
                <NewProjectForm />
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  // DashboardLayout doit également être un composant React valide
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;

