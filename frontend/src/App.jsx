import { useState } from 'react';
import Get from './Get.jsx';

function App() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [abaAtiva, setAbaAtiva] = useState('form'); // 'form' ou 'lista'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('');

    try {
      const response = await fetch('http://localhost:3001/api/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, cpf, telefone, email })
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
    } catch (err) {
      console.error(err);
      setMensagem(`Erro: ${err.message}`);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Cadastro de Cliente</h1>

      {/* Abas */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setAbaAtiva('form')}
          style={{
            marginRight: '10px',
            padding: '8px 16px',
            fontWeight: abaAtiva === 'form' ? 'bold' : 'normal'
          }}
        >
          Formulário
        </button>

        <button
          onClick={() => setAbaAtiva('lista')}
          style={{
            padding: '8px 16px',
            fontWeight: abaAtiva === 'lista' ? 'bold' : 'normal'
          }}
        >
          Lista de clientes
        </button>
      </div>

      {/* Conteúdo da aba ativa */}
      {abaAtiva === 'form' && (
        <div>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '10px' }}>
              <label>Nome:</label><br />
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label>CPF:</label><br />
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
                maxLength={11}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label>Telefone:</label><br />
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>


            <div style={{ marginBottom: '10px' }}>
              <label>E-mail:</label><br />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <button type="submit">Enviar</button>
          </form>

          {mensagem && (
            <p style={{ marginTop: '20px' }}>{mensagem}</p>
          )}
        </div>
      )}

      {abaAtiva === 'lista' && (
        <Get />
      )}
    </div>
  );
}

export default App;
