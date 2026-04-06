import React from 'react';
import './TodasColecoes.css';

// Importação em massa das imagens da sua subpasta
import colecao1 from '../assets/colecoes/colecao1.jpg';
import colecao2 from '../assets/colecoes/colecao2.jpg';
import colecao3 from '../assets/colecoes/colecao3.jpg';
import colecao4 from '../assets/colecoes/colecao4.jpg';
import colecao5 from '../assets/colecoes/colecao5.jpg';
import colecao6 from '../assets/colecoes/colecao6.jpg';
import colecao7 from '../assets/colecoes/colecao7.jpg';
import colecao8 from '../assets/colecoes/colecao8.jpg';
import colecao9 from '../assets/colecoes/colecao9.jpg';
import colecao10 from '../assets/colecoes/colecao10.jpg';
import colecao11 from '../assets/colecoes/colecao11.jpg';
import colecao12 from '../assets/colecoes/colecao12.jpg';

const colecoes = [
  { id: 1, nome: 'LINE', tamanho: 'wide', img: colecao1 },
  { id: 2, nome: 'BOLD', tamanho: 'small', img: colecao2 },
  { id: 3, nome: 'GRETA', tamanho: 'small', img: colecao3 },
  { id: 4, nome: 'SOMMET', tamanho: 'portrait', img: colecao4 },
  { id: 5, nome: 'LUME', tamanho: 'portrait', img: colecao5 },
  { id: 6, nome: 'APOLO', tamanho: 'wide-tall', img: colecao6 },
  { id: 7, nome: 'DUQUESA', tamanho: 'wide', img: colecao7 },
  { id: 8, nome: 'V LOVE', tamanho: 'small', img: colecao8 },
  { id: 9, nome: 'LYRA', tamanho: 'small', img: colecao9 },
  { id: 10, nome: 'FLORENCE', tamanho: 'small', img: colecao10 },
  { id: 11, nome: 'CAPRI', tamanho: 'small', img: colecao11 },
  { id: 12, nome: 'VIVARA', tamanho: 'wide', img: colecao12 },
];

function TodasColecoes() {
  return (
    <div className="colecoes-page">
      <header className="colecoes-header">
        <h1 className="header-title">Coleções Lumie</h1>
        <p className="header-subtitle">Escolha seu estilo perfeito</p>
      </header>

      <div className="mosaico-container">
        <div className="colecoes-grid">
          {colecoes.map((col) => (
            <div key={col.id} className={`colecao-card ${col.tamanho}`}>
              <div className="colecao-content">
                <p className="label-colecao">COLEÇÃO</p>
                <h3 className="nome-colecao">{col.nome}</h3>
              </div>
              {/* A imagem é injetada via style para garantir o redimensionamento dinâmico */}
              <div 
                className="placeholder-img" 
                style={{ backgroundImage: `url(${col.img})` }}
              ></div> 
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TodasColecoes;