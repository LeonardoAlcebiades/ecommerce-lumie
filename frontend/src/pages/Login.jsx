import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(false);
  const [errors, setErrors] = useState({}); // Estado para capturar campos vazios
  const [welcomeToast, setWelcomeToast] = useState(''); // Estado para o card de boas-vindas
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    senha: '',
    termos: false
  });

  // Pega a página de onde o usuário veio, ou assume a home como padrão
  const from = location.state?.from?.pathname || "/";

  // Efeito para limpar o toast automaticamente após alguns segundos
  useEffect(() => {
    if (welcomeToast) {
      const timer = setTimeout(() => {
        setWelcomeToast('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [welcomeToast]);

  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
      setFormData({ ...formData, cpf: value });
      if (errors.cpf) setErrors({ ...errors, cpf: '' }); // Limpa erro ao digitar
    }
  };

  const handleTelefoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
      value = value.replace(/(\d{5})(\d)/, "$1-$2");
      setFormData({ ...formData, telefone: value });
      if (errors.telefone) setErrors({ ...errors, telefone: '' });
    }
  };

  const handleNomeChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
    setFormData({ ...formData, nome: value });
    if (errors.nome) setErrors({ ...errors, nome: '' });
  };

  const validateFields = () => {
    let newErrors = {};
    
    if (isLogin) {
      if (!formData.cpf) newErrors.cpf = "Campo obrigatório";
      if (!formData.senha) newErrors.senha = "Campo obrigatório";
    } else {
      if (!formData.nome) newErrors.nome = "Campo obrigatório";
      if (!formData.email) newErrors.email = "Campo obrigatório";
      if (!formData.telefone) newErrors.telefone = "Campo obrigatório";
      if (!formData.cpf) newErrors.cpf = "Campo obrigatório";
      if (!formData.senha) newErrors.senha = "Campo obrigatório";
      if (!formData.termos) newErrors.termos = "Você deve aceitar os termos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateFields()) return; // Para a execução se houver erros

    const usuariosSalvos = JSON.parse(localStorage.getItem('usuarios_lumie') || '[]');

    if (isLogin) {
      const usuarioValido = usuariosSalvos.find(
        (u) => u.cpf === formData.cpf && u.senha === formData.senha
      );

      if (usuarioValido) {
        localStorage.setItem('usuario_logado', JSON.stringify(usuarioValido));
        
        // Extrai o primeiro nome para o toast
        const primeiroNome = usuarioValido.nome.trim().split(' ')[0];
        setWelcomeToast(`Bem vindo, ${primeiroNome}.`);
        
        // Executa o login e redireciona para a página anterior
        setTimeout(() => {
          onLogin();
          navigate(from, { replace: true });
        }, 800);
      } else {
        alert("CPF ou senha incorretos.");
      }
    } else {
      const usuarioExiste = usuariosSalvos.find((u) => u.cpf === formData.cpf);
      if (usuarioExiste) {
        alert("Este CPF já está cadastrado.");
        return;
      }

      const novosUsuarios = [...usuariosSalvos, formData];
      localStorage.setItem('usuarios_lumie', JSON.stringify(novosUsuarios));
      
      alert("Conta criada com sucesso!");
      setIsLogin(true);
    }
  };

  return (
    <div className="login-page-container">
      {/* Toast de Boas-vindas seguindo estilo da Lumie */}
      {welcomeToast && (
        <div className="toast-welcome">
          <span className="toast-welcome-text">{welcomeToast}</span>
        </div>
      )}

      <div className="login-card">
        <h2 className="title-serif">{isLogin ? 'Acesse sua Conta' : 'Crie sua Conta'}</h2>
        <p className="login-subtitle">
          {isLogin ? 'Preencha seus dados de acesso' : 'Preencha os campos abaixo'}
        </p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Nome Completo</label>
                <input type="text" className={errors.nome ? 'input-error' : ''} value={formData.nome} onChange={handleNomeChange} placeholder="Seu nome" />
                {errors.nome && <span className="error-message">{errors.nome}</span>}
              </div>
              
              <div className="form-group">
                <label>E-mail</label>
                <input type="email" className={errors.email ? 'input-error' : ''} value={formData.email} onChange={(e) => {setFormData({ ...formData, email: e.target.value }); setErrors({...errors, email: ''})}} placeholder="exemplo@email.com" />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Telefone</label>
                <input type="text" className={errors.telefone ? 'input-error' : ''} value={formData.telefone} onChange={handleTelefoneChange} placeholder="(00) 00000-0000" />
                {errors.telefone && <span className="error-message">{errors.telefone}</span>}
              </div>
            </>
          )}

          <div className="form-group">
            <label>CPF</label>
            <input type="text" className={errors.cpf ? 'input-error' : ''} value={formData.cpf} onChange={handleCpfChange} placeholder="000.000.000-00" />
            {errors.cpf && <span className="error-message">{errors.cpf}</span>}
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input type="password" className={errors.senha ? 'input-error' : ''} placeholder="********" onChange={(e) => {setFormData({ ...formData, senha: e.target.value }); setErrors({...errors, senha: ''})}} />
            {errors.senha && <span className="error-message">{errors.senha}</span>}
          </div>

          {!isLogin && (
            <div className="terms-wrapper" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <label className="custom-checkbox-container">
                <input 
                  type="checkbox" 
                  checked={formData.termos}
                  onChange={(e) => {setFormData({ ...formData, termos: e.target.checked }); setErrors({...errors, termos: ''})}}
                />
                <span className={`checkmark ${errors.termos ? 'checkmark-error' : ''}`}></span>
                <span className="terms-text">
                  Ao criar uma conta, você concorda com nossos 
                  <span className="highlight-link"> Termos de Uso</span> e 
                  <span className="highlight-link"> Política de Privacidade</span>.
                </span>
              </label>
              {errors.termos && <span className="error-message" style={{ marginTop: '5px' }}>{errors.termos}</span>}
            </div>
          )}

          <button type="submit" className="btn-primary-gold">
            {isLogin ? 'Entrar' : 'Criar Conta'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isLogin ? "Ainda não tem conta? " : "Já possui uma conta? "}
            <span onClick={() => {setIsLogin(!isLogin); setErrors({});}}>
              {isLogin ? 'Faça seu Cadastro' : 'Faça Login'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;