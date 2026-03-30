import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Vitrine from './components/Vitrine';
import Categories from './components/Categories'; 
import Chatbot from './components/Chatbot/Chatbot';

// --- NOVOS IMPORTS PARA OS ÍCONES SOCIAIS ---
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';

// --- SEUS IMPORTS ORIGINAIS (MANTIDOS) ---
import './index.css';
import './App.css';
import './styles.css'; 

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

function HeaderLumie() {
  const navigate = useNavigate();
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
        {/* --- LUPA ELEGANTE --- */}
        <button className="icon-btn" onClick={() => navigate('/pesquisa')} title="Pesquisar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
        
        {/* --- PERFIL ELEGANTE --- */}
        <button className="icon-btn" title="Minha Conta">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>
        
        {/* --- CARRINHO ELEGANTE --- */}
        <button className="icon-btn" title="Carrinho">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
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
  return (
    <Router>
      <div className="app-container">
        <HeaderLumie />

        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Categories />
              <div id="vitrine" className="section-padding">
                <h2 className="title-serif" style={{ textAlign: 'center', marginBottom: '40px' }}>
                </h2>
                <Vitrine />
              </div>
            </>
          } />
          <Route path="/pesquisa" element={<Pesquisa />} />
        </Routes>

        <footer id="contato" className="lumie-footer">
          <div className="footer-container">
            {/* Coluna Logo e Social */}
            <div className="footer-column">
              <h3 className="logo-text" style={{ fontSize: '2.2rem', marginBottom: '20px' }}>Lumie</h3>
              <p className="footer-description">
                Especialistas em eternizar momentos através de joias exclusivas e metais nobres.
              </p>
              
              {/* --- ÍCONES SOCIAIS ATUALIZADOS AQUI --- */}
              <div className="social-icons" style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <a href="#" className="social-btn">
                  {/* Substituído o 'f' pelo ícone do Facebook */}
                  <FontAwesomeIcon icon={faFacebookF} />
                </a>
                <a href="#" className="social-btn">
                  {/* Substituído o 'i' pelo ícone do Instagram */}
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a href="#" className="social-btn">
                  {/* Substituído o 't' pelo ícone do Twitter */}
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
              </div>
            </div>

            {/* Coluna Links Rápidos */}
            <div className="footer-column">
              <h4 className="footer-title">Links Rápidos</h4>
              <ul className="footer-links">
                <li><a href="#">Sobre Nós</a></li>
                <li><a href="#">Nossas Coleções</a></li>
                <li><a href="#">Guia de Tamanhos</a></li>
                <li><a href="#">Como Cuidar</a></li>
              </ul>
            </div>

            {/* Coluna Atendimento */}
            <div className="footer-column">
              <h4 className="footer-title">Atendimento</h4>
              <ul className="footer-links">
                <li><a href="#">Política de Privacidade</a></li>
                <li><a href="#">Termos de Uso</a></li>
                <li><a href="#">Trocas e Devoluções</a></li>
                <li><a href="#">Entregas</a></li>
              </ul>
            </div>

            {/* Coluna Contato */}
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