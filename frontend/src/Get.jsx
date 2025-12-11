import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function Get() {
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const [editandoId, setEditandoId] = useState(null);
  const [editNome, setEditNome] = useState('');
  const [editCpf, setEditCpf] = useState('');
  const [editTelefone, setEditTelefone] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const carregarClientes = async () => {
    setCarregando(true);
    setErro('');

    try {
      const resposta = await fetch('http://localhost:3001/api/clientes');

      if (!resposta.ok) {
        throw new Error('Erro ao buscar clientes');
      }

      const dados = await resposta.json();
      setClientes(dados);
    } catch (err) {
      console.error(err);
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const excluirCliente = async (id) => {
    const confirmar = window.confirm('Tem certeza que deseja excluir este cliente?');
    if (!confirmar) return;

    try {
      const resposta = await fetch(`http://localhost:3001/api/clientes/${id}`, {
        method: 'DELETE',
      });

      if (!resposta.ok && resposta.status !== 204) {
        throw new Error('Erro ao excluir cliente');
      }

      setClientes((listaAtual) => listaAtual.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      setErro(err.message);
    }
  };

  const iniciarEdicao = (cliente) => {
    setEditandoId(cliente.id);
    setEditNome(cliente.nome);
    setEditCpf(cliente.cpf);
    setEditTelefone(cliente.telefone || '');
    setEditEmail(cliente.email || '');
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setEditNome('');
    setEditCpf('');
    setEditTelefone('');
    setEditEmail('');
  };

  const salvarEdicao = async () => {
    try {
      const resposta = await fetch(`http://localhost:3001/api/clientes/${editandoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: editNome,
          cpf: editCpf,
          telefone: editTelefone,
          email: editEmail,
        }),
      });

      if (!resposta.ok) {
        const data = await resposta.json();
        throw new Error(data.error || 'Erro ao atualizar cliente');
      }

      const atualizado = await resposta.json();

      setClientes((listaAtual) =>
        listaAtual.map((c) => (c.id === atualizado.id ? atualizado : c))
      );

      cancelarEdicao();
    } catch (err) {
      console.error(err);
      setErro(err.message);
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h6">Lista de Clientes</Typography>
        <Button
          variant="outlined"
          onClick={carregarClientes}
          disabled={carregando}
        >
          {carregando ? 'Atualizando...' : 'Recarregar lista'}
        </Button>
      </Box>

      {erro && (
        <Typography color="error" sx={{ mb: 2 }}>
          Erro: {erro}
        </Typography>
      )}

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>CPF</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.length === 0 && !carregando && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Nenhum cliente cadastrado.
                </TableCell>
              </TableRow>
            )}

            {clientes.map((cliente) => {
              const estaEditando = editandoId === cliente.id;

              return (
                <TableRow key={cliente.id}>
                  <TableCell>{cliente.id}</TableCell>

                  <TableCell>
                    {estaEditando ? (
                      <TextField
                        size="small"
                        value={editNome}
                        onChange={(e) => setEditNome(e.target.value)}
                      />
                    ) : (
                      cliente.nome
                    )}
                  </TableCell>

                  <TableCell>
                    {estaEditando ? (
                      <TextField
                        size="small"
                        value={editCpf}
                        inputProps={{ maxLength: 11 }}
                        onChange={(e) => setEditCpf(e.target.value)}
                      />
                    ) : (
                      cliente.cpf
                    )}
                  </TableCell>

                  <TableCell>
                    {estaEditando ? (
                      <TextField
                        size="small"
                        value={editTelefone}
                        onChange={(e) => setEditTelefone(e.target.value)}
                      />
                    ) : (
                      cliente.telefone
                    )}
                  </TableCell>

                  <TableCell>
                    {estaEditando ? (
                      <TextField
                        size="small"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                      />
                    ) : (
                      cliente.email
                    )}
                  </TableCell>

                  <TableCell align="right">
                    {estaEditando ? (
                      <>
                        <Button
                          size="small"
                          variant="contained"
                          sx={{ mr: 1 }}
                          onClick={salvarEdicao}
                        >
                          Salvar
                        </Button>
                        <Button
                          size="small"
                          variant="text"
                          onClick={cancelarEdicao}
                        >
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <>
                        <IconButton
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={() => iniciarEdicao(cliente)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => excluirCliente(cliente.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Get;
