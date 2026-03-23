import React, { useState, useEffect } from 'react'; 
import '../styles.css'; 

export default function Clientes() {
  const [clientes, setClientes] = useState(() => {
    const dadosSalvos = localStorage.getItem('@lumie:clientes');
    return dadosSalvos ? JSON.parse(dadosSalvos) : [];
  });

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState(''); 
  const [editandoId, setEditandoId] = useState(null);
  const [erros, setErros] = useState({});
  const [busca, setBusca] = useState(''); 

  const [modalConfig, setModalConfig] = useState({ 
    visivel: false, 
    tipo: '', 
    titulo: '', 
    mensagem: '',
    acaoConfirmar: null 
  });

  const dominiosPermitidos = ['@gmail.com', '@outlook.com', '@hotmail.com', '@yahoo.com', '@icloud.com', '@uol.com.br'];

  useEffect(() => {
    localStorage.setItem('@lumie:clientes', JSON.stringify(clientes));
  }, [clientes]);

  // Lógica de filtragem
  const clientesFiltrados = clientes.filter(cliente => 
    cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
    cliente.cpf.includes(busca) ||
    cliente.email.toLowerCase().includes(busca.toLowerCase())
  );

  // FUNÇÃO PARA GRIFAR O TEXTO PESQUISADO
  const destacarTexto = (texto, termo) => {
    if (!termo.trim()) return texto;
    const partes = texto.split(new RegExp(`(${termo})`, 'gi'));
    return partes.map((parte, index) => 
      parte.toLowerCase() === termo.toLowerCase() 
        ? <mark key={index}>{parte}</mark> 
        : parte
    );
  };

  const aplicarMascaraTelefone = (valor) => {
    return valor.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{4})\d+?$/, '$1');
  };

  const aplicarMascaraCpf = (valor) => {
    return valor.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1');
  };

  const fecharModal = () => setModalConfig({ ...modalConfig, visivel: false });

  const abrirModal = (tipo, titulo, mensagem, acao = null) => {
    setModalConfig({ visivel: true, tipo, titulo, mensagem, acaoConfirmar: acao });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let novosErros = {};

    const regexLetras = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
    if (!nome.trim()) novosErros.nome = "O nome é obrigatório.";
    else if (!regexLetras.test(nome)) novosErros.nome = "O nome deve conter apenas letras.";

    const emailBaixo = email.toLowerCase();
    if (!email.trim()) novosErros.email = "O e-mail é obrigatório.";
    else if (!dominiosPermitidos.some(d => emailBaixo.endsWith(d))) novosErros.email = "Use um e-mail válido (ex: @gmail.com).";
    
    const cpfNumeros = cpf.replace(/\D/g, '');
    if (cpfNumeros.length !== 11) novosErros.cpf = "O CPF deve ter 11 dígitos.";
    
    const telNumeros = telefone.replace(/\D/g, '');
    if (telNumeros.length < 10) novosErros.telefone = "Telefone incompleto.";

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    if (editandoId) {
      setClientes(clientes.map(c => c.id === editandoId ? { ...c, nome, email, telefone, cpf } : c));
      setEditandoId(null);
      abrirModal('sucesso', 'Sucesso!', 'Os dados do cliente foram atualizados.');
    } else {
      const novoCliente = { id: Date.now(), nome, email, telefone, cpf };
      setClientes([novoCliente, ...clientes]);
      abrirModal('sucesso', 'Cliente Adicionado!', `${nome} foi cadastrado com sucesso.`);
    }

    setNome(''); setEmail(''); setTelefone(''); setCpf(''); setErros({});
  };

  const deletarCliente = (id) => {
    abrirModal(
      'confirmar_exclusao', 
      'Excluir Cliente', 
      'Tem certeza que deseja remover este registro? Esta ação não pode ser desfeita.',
      () => {
        setClientes(clientes.filter(c => c.id !== id));
        fecharModal();
      }
    );
  };

  const prepararEdicao = (cliente) => {
    setEditandoId(cliente.id);
    setNome(cliente.nome);
    setEmail(cliente.email);
    setTelefone(aplicarMascaraTelefone(cliente.telefone));
    setCpf(aplicarMascaraCpf(cliente.cpf));
    setErros({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container-lumie">
      {modalConfig.visivel && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="title-serif" style={{ fontSize: '1.5rem', marginBottom: '15px' }}>{modalConfig.titulo}</h3>
            <p style={{ color: '#666', marginBottom: '25px' }}>{modalConfig.mensagem}</p>
            
            <div className="modal-actions">
              {modalConfig.tipo === 'confirmar_exclusao' ? (
                <>
                  <button className="btn-cancel" onClick={fecharModal} style={{ margin: 0, width: '120px' }}>Voltar</button>
                  <button className="btn-primary" onClick={modalConfig.acaoConfirmar} style={{ margin: 0, width: '120px' }}>Excluir</button>
                </>
              ) : (
                <button className="btn-primary" onClick={fecharModal} style={{ margin: '0 auto', width: '150px' }}>Ok</button>
              )}
            </div>
          </div>
        </div>
      )}

      <h1 className="title-serif">Gestão de Clientes</h1>
      <div className="divider-gold"></div>

      <form onSubmit={handleSubmit} className="crud-form" noValidate>
        <div className={`input-group ${erros.nome ? 'error-state' : ''}`}>
          <label>Nome Completo <span className="asterisk">*</span></label>
          <input type="text" value={nome} onChange={(e) => { setNome(e.target.value); if(erros.nome) setErros({...erros, nome: null}) }} placeholder="Ex: Maria Silva" />
          {erros.nome && <span className="error-msg">{erros.nome}</span>}
        </div>

        <div className={`input-group ${erros.cpf ? 'error-state' : ''}`}>
          <label>CPF <span className="asterisk">*</span></label>
          <input type="text" value={cpf} onChange={(e) => { setCpf(aplicarMascaraCpf(e.target.value)); if(erros.cpf) setErros({...erros, cpf: null}) }} placeholder="000.000.000-00" />
          {erros.cpf && <span className="error-msg">{erros.cpf}</span>}
        </div>

        <div className={`input-group ${erros.email ? 'error-state' : ''}`}>
          <label>E-mail <span className="asterisk">*</span></label>
          <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); if(erros.email) setErros({...erros, email: null}) }} placeholder="usuario@gmail.com" />
          {erros.email && <span className="error-msg">{erros.email}</span>}
        </div>

        <div className={`input-group ${erros.telefone ? 'error-state' : ''}`}>
          <label>Telefone <span className="asterisk">*</span></label>
          <input type="text" value={telefone} onChange={(e) => { setTelefone(aplicarMascaraTelefone(e.target.value)); if(erros.telefone) setErros({...erros, telefone: null}) }} placeholder="(11) 99999-8888" />
          {erros.telefone && <span className="error-msg">{erros.telefone}</span>}
        </div>

        <button type="submit" className="btn-primary">
          {editandoId ? "Salvar Alterações" : "Adicionar Cliente"}
        </button>
        
        {editandoId && (
          <button type="button" className="btn-cancel" onClick={() => {setEditandoId(null); setNome(''); setEmail(''); setTelefone(''); setCpf(''); setErros({});}}>
            Cancelar Edição
          </button>
        )}
      </form>

      <div className="list-section">
        <h2 className="title-serif" style={{ fontSize: '1.8rem' }}>Clientes Registrados</h2>
        
        <div className="search-container">
          <div className="search-icon"></div>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Pesquisar por nome, CPF ou e-mail..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <div className="clients-grid">
          {clientesFiltrados.length > 0 ? (
            clientesFiltrados.map((cliente) => (
              <div key={cliente.id} className="client-item-card">
                <div className="client-info">
                  <span className="client-name">
                    {destacarTexto(cliente.nome, busca)}
                  </span>
                  <span className="client-details">
                    CPF: {destacarTexto(cliente.cpf, busca)} <br/> 
                    {destacarTexto(cliente.email, busca)} • {cliente.telefone}
                  </span>
                </div>
                <div className="client-actions">
                  <button className="btn-action edit" onClick={() => prepararEdicao(cliente)}>Editar</button>
                  <button className="btn-action delete" onClick={() => deletarCliente(cliente.id)}>Excluir</button>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-msg">Nenhum cliente encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}