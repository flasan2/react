import { useEffect, useState } from 'react';


function Get() {
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  // estados para edição
  const [editandoId, setEditandoId] = useState(null);
  const [editNome, setEditNome] = useState('');
  const [editCpf, setEditCpf] = useState('');
  const [editTelefone, setEditTelefone] = useState('');
  const [editEmail, setEditEmail] = useState('');

  // ---------- CARREGAR CLIENTES ----------

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

  // ---------- EXCLUIR ----------
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

      // remove da lista no front
      setClientes((listaAtual) => listaAtual.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      setErro(err.message);
    }
  };

  // ---------- EDITAR ----------
  const iniciarEdicao = (cliente) => {
    setEditandoId(cliente.id);
    setEditNome(cliente.nome);
    setEditCpf(cliente.cpf);
    setEditTelefone(cliente.telefone);
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

      // Atualiza na lista local
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
    <div>
      <h2>Lista de Clientes</h2>

      <button onClick={carregarClientes} disabled={carregando}>
        {carregando ? 'Atualizando...' : 'Recarregar lista'}
      </button>

      {erro && <p style={{ color: 'red', marginTop: '10px' }}>Erro: {erro}</p>}

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '20px',
        }}
      >
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>ID</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Nome</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>CPF</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Telefone</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>E-mail</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Ações</th>

          </tr>
        </thead>
        <tbody>
          {clientes.length === 0 && !carregando && (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '10px' }}>
                Nenhum cliente cadastrado.
              </td>
            </tr>
          )}

          {clientes.map((cliente) => {
            const estaEditando = editandoId === cliente.id;

            return (
              <tr key={cliente.id}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{cliente.id}</td>

                {/* COLUNA NOME */}
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {estaEditando ? (
                    <input
                      type="text"
                      value={editNome}
                      onChange={(e) => setEditNome(e.target.value)}
                    />
                  ) : (
                    cliente.nome
                  )}
                </td>

                {/* COLUNA CPF */}
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {estaEditando ? (
                    <input
                      type="text"
                      value={editCpf}
                      maxLength={11}
                      onChange={(e) => setEditCpf(e.target.value)}
                    />
                  ) : (
                    cliente.cpf
                  )}
                </td>

                {/* COLUNA TELEFONE */}
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {estaEditando ? (
                    <input
                      type="text"
                      value={editTelefone}
                      onChange={(e) => setEditTelefone(e.target.value)}
                    />
                  ) : (
                    cliente.telefone
                  )}
                </td>

                {/* COLUNA EMAIL */}
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {estaEditando ? (
                    <input
                      type="text"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                    />
                  ) : (
                    cliente.email
                  )}
                </td>

                {/* COLUNA EMAIL */}
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {estaEditando ? (
                    <>
                      <button onClick={salvarEdicao} style={{ marginRight: '8px' }}>
                        Salvar
                      </button>
                      <button onClick={cancelarEdicao}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => iniciarEdicao(cliente)}
                        style={{ marginRight: '8px' }}
                      >
                        Editar
                      </button>
                      <button onClick={() => excluirCliente(cliente.id)}>Excluir</button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Get;
