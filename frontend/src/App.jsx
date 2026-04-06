import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Vitrine from './components/Vitrine';
import Categories from './components/Categories'; 
import VitrinePremium from './components/VitrinePremium'; 
import ExperienciaLumie from './components/ExperienciaLumie'; 
import Chatbot from './components/Chatbot/Chatbot';
import ColecoesAcesso from './components/ColecoesAcesso'; 
import TodasColecoes from './pages/TodasColecoes';
import Carrinho from './pages/Carrinho';
import Checkout from './pages/Checkout'; 
import Login from './pages/Login';

// --- ÍCONES SOCIAIS ---
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';

// --- ESTILOS ---
import './index.css';
import './App.css';
import './styles.css'; 

// --- COMPONENTE PARA FLUÍDEZ: SEMPRE VOLTAR AO TOPO NA TROCA DE ROTA ---
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Pesquisa() {
  return (
    <div className="section-padding">
      <h2 className="title-serif">O que você está procurando?</h2>
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <input 
          type="text" 
          className="input-group input" 
          placeholder="Busque por alianças, ouro, diamantes..." 
          style={{ maxWidth: '500px', margin: '0 auto' }}
        />
      </div>
    </div>
  );
}

function HeaderLumie({ isLogged, onLogout }) {
  const navigate = useNavigate();
  const [badgeCount, setBadgeCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Busca dados do usuário para o avatar
  const userData = isLogged ? JSON.parse(localStorage.getItem('usuario_logado') || '{}') : null;
  const firstName = userData?.nome ? userData.nome.split(' ')[0] : '';
  const initial = userData?.nome ? userData.nome.charAt(0).toUpperCase() : '';

  useEffect(() => {
    const atualizarContagem = () => {
      const itens = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const total = itens.reduce((acc, item) => acc + item.quantidade, 0);
      setBadgeCount(total);
    };

    window.addEventListener('storage', atualizarContagem);
    atualizarContagem();

    // Fechar dropdown ao clicar fora
    const handleClickFora = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickFora);

    return () => {
      window.removeEventListener('storage', atualizarContagem);
      document.removeEventListener('mousedown', handleClickFora);
    };
  }, []);

  return (
    <header className="lumie-header">
      <Link to="/" className="logo-text">Lumie</Link>
      <nav className="nav-links">
        <Link to="/">Início</Link>
        <a href="#vitrine">Alianças Femininas</a>
        <a href="#vitrine">Alianças Masculinas</a>
        <a href="#vitrine">Personalizadas</a>
        <a href="#contato">Contato</a>
      </nav>
      <div className="header-actions">
        <button className="icon-btn" onClick={() => navigate('/pesquisa')} title="Pesquisar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>

        {/* ÁREA DO PERFIL COM DROPDOWN E AVATAR DINÂMICO */}
        <div className="profile-menu-container" ref={dropdownRef}>
          {isLogged ? (
            <div className="logged-user-info" onClick={() => setShowDropdown(!showDropdown)}>
              <div className="user-avatar-gradient">
                {initial}
              </div>
              <span className="user-name-text">{firstName}</span>
              <svg className={`dropdown-arrow ${showDropdown ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6"></path>
              </svg>
            </div>
          ) : (
            <button 
              className="icon-btn" 
              onClick={() => navigate('/login')} 
              title="Minha Conta"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
          )}

          {isLogged && showDropdown && (
            <div className="profile-dropdown">
              <ul>
                <li onClick={() => {navigate('/perfil'); setShowDropdown(false);}}>Minha conta</li>
                <li onClick={() => {navigate('/pedidos'); setShowDropdown(false);}}>Meus pedidos</li>
                <li className="logout-option" onClick={() => {onLogout(); setShowDropdown(false);}}>Sair</li>
              </ul>
            </div>
          )}
        </div>
        
        <button className="icon-btn cart-btn-wrapper" onClick={() => navigate('/carrinho')} title="Carrinho">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          {badgeCount > 0 && (
            <span className="cart-badge">
              {badgeCount > 99 ? '99+' : badgeCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">Alianças que marcam histórias eternas.</h1>
        <p className="hero-subtitle">Design exclusivo, sofisticação e o brilho que o seu momento merece.</p>
      </div>
    </section>
  );
}

function App() {
  const [isLogged, setIsLogged] = useState(false);

  // Verifica se já existe usuário logado ao carregar o App
  useEffect(() => {
    const user = localStorage.getItem('usuario_logado');
    if (user) setIsLogged(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('usuario_logado');
    setIsLogged(false);
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="app-container">
        <HeaderLumie isLogged={isLogged} onLogout={handleLogout} />

        <Routes>
          <Route path="/" element={
            <div className="fade-in-page">
              <Hero />
              <Categories />
              <VitrinePremium />
              <div id="vitrine" className="section-padding" style={{ paddingBottom: '0px', marginBottom: '-20px' }}>
                <Vitrine />
              </div>
              <ColecoesAcesso />
              <ExperienciaLumie />
            </div>
          } />
          
          <Route path="/pesquisa" element={<div className="fade-in-page"><Pesquisa /></div>} />
          <Route path="/todas-as-colecoes" element={<div className="fade-in-page"><TodasColecoes /></div>} />
          <Route path="/carrinho" element={<div className="fade-in-page"><Carrinho /></div>} />
          <Route path="/login" element={<div className="fade-in-page"><Login onLogin={() => setIsLogged(true)} /></div>} />
          
          <Route 
            path="/checkout" 
            element={isLogged ? <div className="fade-in-page"><Checkout /></div> : <Navigate to="/login" replace />} 
          />
        </Routes>

        <footer id="contato" className="lumie-footer">
          <div className="footer-container">
            <div className="footer-column">
              <h3 className="logo-text" style={{ fontSize: '2.2rem', marginBottom: '20px' }}>Lumie</h3>
              <p className="footer-description">
                Especialistas em eternizar momentos através de joias exclusivas e metais nobres.
              </p>
              <div className="social-icons" style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <a href="#" className="social-btn"><FontAwesomeIcon icon={faFacebookF} /></a>
                <a href="#" className="social-btn"><FontAwesomeIcon icon={faInstagram} /></a>
                <a href="#" className="social-btn"><FontAwesomeIcon icon={faTwitter} /></a>
              </div>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">Links Rápidos</h4>
              <ul className="footer-links">
                <li><a href="#">Sobre Nós</a></li>
                <li><a href="#">Nossas Coleções</a></li>
                <li><a href="#">Guia de Tamanhos</a></li>
                <li><a href="#">Como Cuidar</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">Atendimento</h4>
              <ul className="footer-links">
                <li><a href="#">Política de Privacidade</a></li>
                <li><a href="#">Termos de Uso</a></li>
                <li><a href="#">Trocas e Devoluções</a></li>
                <li><a href="#">Entregas</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">Contato</h4>
              <ul className="footer-links contact-info">
                <li><span className="icon">📞</span> (11) 98765-4321</li>
                <li><span className="icon">✉️</span> contato@lumie.com.br</li>
                <li><span className="icon">📍</span> Av. Paulista, 1000<br/>São Paulo - SP</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Lumie Joias. Todos os direitos reservados.</p>
          </div>
        </footer>

        <Chatbot />
      </div>
    </Router>
  );
}

export default App;