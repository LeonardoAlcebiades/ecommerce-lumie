import React, { useState } from 'react'; 
import './VitrinePremium.css';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast'; 

// Importação das imagens da pasta assets
import img1 from '../assets/aliancas/alianca.jpg';
import img2 from '../assets/aliancas/alianca1.jpg';
import img3 from '../assets/aliancas/alianca2.jpg';
import img4 from '../assets/aliancas/alianca3.jpg';
import img5 from '../assets/aliancas/alianca4.jpg';
import img6 from '../assets/aliancas/alianca5.jpg';
import img7 from '../assets/aliancas/alianca6.jpg';
import img8 from '../assets/aliancas/alianca7.jpg';

const aliancasPremium = [
  { id: 1, name: "Aliança Eternity Gold", price: "R$ 2.450,00", inst: "10x de R$ 245,00", img: img1 },
  { id: 2, name: "Aliança Infinite Silver", price: "R$ 3.100,00", inst: "10x de R$ 310,00", img: img2 },
  { id: 3, name: "Aliança Royal Textured", price: "R$ 890,00", inst: "10x de R$ 89,00", img: img3 },
  { id: 4, name: "Aliança Classic Minimalist", price: "R$ 1.850,00", inst: "10x de R$ 185,00", img: img4 },
  { id: 5, name: "Aliança Elegance Satin", price: "R$ 4.200,00", inst: "12x de R$ 350,00", img: img5 },
  { id: 6, name: "Aliança Majestic Duo", price: "R$ 2.100,00", inst: "10x de R$ 210,00", img: img6 },
  { id: 7, name: "Aliança Crystal Shine", price: "R$ 1.550,00", inst: "10x de R$ 155,00", img: img7 },
  { id: 8, name: "Aliança Artisan Rough", price: "R$ 1.200,00", inst: "10x de R$ 120,00", img: img8 },
];

function VitrinePremium() {
  const navigate = useNavigate();
  const [notificacoes, setNotificacoes] = useState([]); 

  const adicionarNotificacao = (msg, tipo = 'sucesso') => {
    const id = Date.now();
    const novaNotificacao = { id, msg, tipo, saindo: false }; // Adicionado estado 'saindo'
    
    setNotificacoes(prev => [...prev, novaNotificacao]);

    // Inicia a animação de saída um pouco antes de remover do array
    setTimeout(() => {
      fecharNotificacao(id);
    }, 3000);
  };

  const fecharNotificacao = (id) => {
    // Primeiro marcamos como 'saindo' para disparar o CSS
    setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, saindo: true } : n));

    // Depois de 400ms (tempo da animação), removemos de fato
    setTimeout(() => {
      setNotificacoes(prev => prev.filter(n => n.id !== id));
    }, 400);
  };

const adicionarAoCarrinho = (item) => {
  const carrinhoAtual = JSON.parse(localStorage.getItem('cartItems') || '[]');
  
  // Procura se o item já existe no carrinho pelo ID ou Nome
  const indexExistente = carrinhoAtual.findIndex(p => p.id === item.id || p.nome === item.name);

  if (indexExistente !== -1) {
    // CASO 1: O item já está no carrinho, verificamos o limite de 99
    if (carrinhoAtual[indexExistente].quantidade >= 99) {
      // Exibe toast de limite atingido (baseado na sua print de toasts)
      adicionarNotificacao("Limite máximo de 99 unidades atingido!", "erro");
      return; // Interrompe a função
    }

    // Caso não tenha atingido o limite, atualiza a quantidade
    carrinhoAtual[indexExistente].quantidade += 1;
    
    // CASO 2: Notificação de quantidade atualizada
    adicionarNotificacao("Quantidade do produto atualizada!", "info");
    
  } else {
    // CASO 3: É o primeiro item deste tipo sendo adicionado
    const precoNumerico = typeof item.price === 'string' 
      ? parseFloat(item.price.replace('R$', '').replace('.', '').replace(',', '.').trim())
      : item.price;

    carrinhoAtual.push({
      id: item.id,
      nome: item.name || item.nome,
      preco: precoNumerico,
      imagem: item.img || item.imagem,
      aro: 18, // Padrão inicial
      quantidade: 1
    });

    // Como é um item novo, reiniciamos o timer de reserva (15min)
    const novoExpira = Date.now() + (15 * 60 * 1000);
    localStorage.setItem('lumie_timer_expira', novoExpira.toString());
    
    // Notificação de produto novo adicionado
    adicionarNotificacao("Produto adicionado ao carrinho!", "sucesso");
  }

  // Salva no localStorage e dispara o evento para atualizar outras abas/componentes
  localStorage.setItem('cartItems', JSON.stringify(carrinhoAtual));
  window.dispatchEvent(new Event('storage'));
};

  return (
    <section className="vitrine-section">
      
      {/* Container de empilhamento visual */}
      <div className="toast-stack-container">
        {notificacoes.map((n) => (
          <Toast 
            key={n.id}
            mensagem={n.msg} 
            tipo={n.tipo} 
            onFechar={() => setNotificacoes(prev => prev.filter(notif => notif.id !== n.id))} 
          />
        ))}
      </div>

      <h2 className="premium-title">Coleção Premium</h2>

      <div className="premium-grid">
        {aliancasPremium.map((item) => (
          <div key={item.id} className="premium-card">
            <div className="premium-image-wrapper">
              <img src={item.img} alt={item.name} className="premium-image" />
            </div>

            <div className="premium-content">
              <p className="premium-product-name">{item.name}</p>

              <div className="premium-price-group">
                <span className="premium-price">{item.price}</span>
                <p className="premium-installments">{item.inst}</p>
              </div>

              <div className="premium-buy-btn">
                <button 
                  className="btn-buy-premium" 
                  onClick={() => adicionarAoCarrinho(item)}
                >
                  Comprar Agora
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default VitrinePremium;

