import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
} from '@mui/material';

function FormCliente() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [setor, setSetor] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('');

    try {
      const response = await fetch('http://localhost:3001/api/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, cpf, telefone, email, setor }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao enviar formulário');
      }

      const data = await response.json();
      setMensagem(`Cliente cadastrado com sucesso! ID: ${data.id}`);

      setNome('');
      setCpf('');
      setTelefone('');
      setEmail('');
      setSetor('');
    } catch (err) {
      console.error(err);
      setMensagem(`Erro: ${err.message}`);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Nome"
          fullWidth
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          label="CPF"
          fullWidth
          required
          inputProps={{ maxLength: 11 }}
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          label="Telefone"
          fullWidth
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          label="E-mail"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Box>

            <Box sx={{ mb: 2 }}>
        <TextField
          label="Setor"
          type="setor"
          fullWidth
          value={setor}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Box>

      <Button type="submit" variant="contained">
        Enviar
      </Button>

      {mensagem && (
        <Typography sx={{ mt: 2 }}>
          {mensagem}
        </Typography>
      )}
    </Box>
  );
}

export default FormCliente;
