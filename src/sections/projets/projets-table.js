import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Box, TextField, Checkbox } from '@mui/material';
import Link from 'next/link';

const ProjetsTable = ({ projets }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjets, setSelectedProjets] = useState([]);

  const filteredProjets = useMemo(() => {
    return projets.filter((projet) =>
      projet.nomProjet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      projet.client.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, projets]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelectedProjets = filteredProjets.map((projet) => projet.id);
      setSelectedProjets(newSelectedProjets);
      return;
    }
    setSelectedProjets([]);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedProjets.indexOf(id);
    let newSelectedProjets = [];

    if (selectedIndex === -1) {
      newSelectedProjets = newSelectedProjets.concat(selectedProjets, id);
    } else if (selectedIndex === 0) {
      newSelectedProjets = newSelectedProjets.concat(selectedProjets.slice(1));
    } else if (selectedIndex === selectedProjets.length - 1) {
      newSelectedProjets = newSelectedProjets.concat(selectedProjets.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedProjets = newSelectedProjets.concat(
        selectedProjets.slice(0, selectedIndex),
        selectedProjets.slice(selectedIndex + 1)
      );
    }

    setSelectedProjets(newSelectedProjets);
  };

  const isSelected = (id) => selectedProjets.indexOf(id) !== -1;

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un projet"
          variant="outlined"
        />
      </Box>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedProjets.length > 0 && selectedProjets.length < filteredProjets.length}
                  checked={filteredProjets.length > 0 && selectedProjets.length === filteredProjets.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Nom du projet</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Créé le</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProjets.map((projet) => (
              <TableRow
                key={projet.id}
                selected={isSelected(projet.id)}
                hover
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected(projet.id)}
                    onChange={(event) => handleSelectOne(event, projet.id)}
                  />
                </TableCell>
                <TableCell>
                  <Link href={`/projects/${projet.id}`}>
                      {projet.nomProjet}
                  </Link>
                </TableCell>
                <TableCell>{projet.client}</TableCell>
                <TableCell>{new Date(projet.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default ProjetsTable;
