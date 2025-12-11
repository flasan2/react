import { useState } from 'react';
import Get from './Get.jsx';
import Dashboard from './dashboard.jsx';    
import FormCliente from './post.jsx';

import {
  Container,
  Tab,
  Tabs,
  Typography,
  Paper,
} from '@mui/material';

function App() {
  const [abaAtiva, setAbaAtiva] = useState('form'); // 'form', 'lista', 'dashboard'

  const handleChangeAba = (event, novaAba) => {
    setAbaAtiva(novaAba);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: '10px', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Cadastro de Cliente
        </Typography>

        <Tabs
          value={abaAtiva}
          onChange={handleChangeAba}
          textColor="primary"
          indicatorColor="secondary"
          sx={{ mb: 3 }}
        >
          <Tab label="Formulário" value="form" />
          <Tab label="Lista de clientes" value="lista" />
          <Tab label="Dashboard" value="dashboard" />
        </Tabs>

        {abaAtiva === 'form' && <FormCliente />}
        {abaAtiva === 'lista' && <Get />}
        {abaAtiva === 'dashboard' && <Dashboard />}
      </Paper>
    </Container>
  );
}

export default App;
