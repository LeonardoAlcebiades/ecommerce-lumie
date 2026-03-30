import React from 'react';
import { useNavigate } from 'react-router-dom';

// 1. IMPORTAR AS IMAGENS LOCAIS (O PULO DO GATO)
// O Vite vai converter esses caminhos para URLs válidas automaticamente
import imgFeminina from '../assets/aliancas/feminina.jpg';
import imgMasculina from '../assets/aliancas/masculina.jpg';
import imgPersonalizada from '../assets/aliancas/personalizada.jpg';

const categorias = [
  {
    id: 1,
    titulo: 'Alianças Femininas',
    subtitulo: 'Delicadeza e elegância',
    rota: '/pesquisa',
    // Usamos a variável importada aqui
    imagem: imgFeminina 
  },
  {
    id: 2,
    titulo: 'Alianças Masculinas',
    subtitulo: 'Força e sofisticação',
    rota: '/pesquisa',
    // Usamos a variável importada aqui
    imagem: imgMasculina
  },
  {
    id: 3,
    titulo: 'Alianças Personalizadas',
    subtitulo: 'Exclusividade única',
    rota: '/pesquisa',
    // Usamos a variável importada aqui
    imagem: imgPersonalizada
  }
];

export default function Categories() {
  const navigate = useNavigate();

  return (
    <section className="categories-section section-padding">
      <div className="categories-grid">
        {categorias.map(cat => (
          <div 
            key={cat.id} 
            className="category-card"
            onClick={() => navigate(cat.rota)}
          >
            <div className="category-image-wrapper">
              {/* A imagem agora é carregada localmente e com segurança */}
              <img src={cat.imagem} alt={cat.titulo} className="category-image" />
            </div>
            <div className="category-info">
              <h3 className="category-title">{cat.titulo}</h3>
              <p className="category-subtitle">{cat.subtitulo}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}