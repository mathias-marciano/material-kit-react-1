import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField
} from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { parse } from 'path';
import { useRouter } from 'next/router';

export const NewProjectForm = () => {
  const auth = useAuth();
  const userId = auth.user.id; 
  const router = useRouter();
  
  const formik = useFormik({
    initialValues: {
      projectName: '',
      client: '',
      description: ''
    },
    validationSchema: Yup.object({
      projectName: Yup.string().required('Le nom du projet est requis'),
      client: Yup.string().required('Le client est requis'),
      description: Yup.string().required('La description est requise')
    }),
    onSubmit: async (values, helpers) => {
      try {
        const dataToSend = {
          ...values,
          userId: userId
        };
    
        const response = await axios.post('/api/projects/create', dataToSend);
        console.log(response.data);
        router.push('/my_projects');
      } catch (error) {
        console.error('Erreur lors de la création du projet:', error);
        helpers.setErrors({ submit: error.response.data.message });
      }
      helpers.setSubmitting(false);
    }    
  });

  return (
    <form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
      <Card>
        <CardHeader subheader="Compléter le formulaire" title="Créer un nouveau projet" />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <TextField
              fullWidth
              label="Nom du projet"
              margin="normal"
              name="projectName"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.projectName}
              error={formik.touched.projectName && Boolean(formik.errors.projectName)}
              helperText={formik.touched.projectName && formik.errors.projectName}
              required
            />
            <TextField
              fullWidth
              label="Client"
              margin="normal"
              name="client"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.client}
              error={formik.touched.client && Boolean(formik.errors.client)}
              helperText={formik.touched.client && formik.errors.client}
              required
            />
            <TextField
              fullWidth
              label="Contexte du projet"
              margin="normal"
              multiline
              name="description"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              required
              rows={4}
            />
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button color="primary" variant="contained" type="submit" disabled={formik.isSubmitting}>
            Soumettre
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
