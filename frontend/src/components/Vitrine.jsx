import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Vitrine() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    // Busca alianças do Postgres via API
    axios.get('http://localhost:3001/api/produtos')
      .then(res => setProdutos(res.data))
      .catch(err => console.error("Erro na vitrine:", err));
  }, []);

  return (
    <div className="products-grid">
      {produtos.map(p => (
        <div key={p.id} className="product-card">
          <img src={p.imagem_url} alt={p.nome} className="product-image" />
          <div className="product-info">
            <h3 className="product-title">{p.nome}</h3>
            <p className="product-price">
              R$ {parseFloat(p.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <button className="btn-add-cart">Adicionar ao Carrinho</button>
          </div>
        </div>
      ))}
    </div>
  );
}