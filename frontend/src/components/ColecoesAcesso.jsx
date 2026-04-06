import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ColecoesAcesso.css';

const ColecoesAcesso = () => {
  const navigate = useNavigate();

  return (
    <section className="colecoes-acesso-section">
      <div className="colecoes-acesso-container">
        {/* Usando useNavigate do react-router-dom para redirecionar */}
        <button 
          className="btn-colecoes-master" 
          onClick={() => navigate('/todas-as-colecoes')}
        >
          Conheça Todas as Coleções
        </button>
      </div>
    </section>
  );
};

export default ColecoesAcesso;