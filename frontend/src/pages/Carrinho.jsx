import React, { useState, useEffect } from 'react';
import './Carrinho.css';
import { Trash2, Plus, Minus, Clock, MapPin, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Carrinho() {
  const navigate = useNavigate();

  const [itens, setItens] = useState(() => {
    const salvos = localStorage.getItem('cartItems');
    return salvos ? JSON.parse(salvos) : [];
  });

  const [tempoRestante, setTempoRestante] = useState(null);
  const [cep, setCep] = useState('');
  const [cupom, setCupom] = useState('');
  const [frete, setFrete] = useState(() => {
    const salvo = localStorage.getItem('lumie_frete');
    return salvo ? parseFloat(salvo) : null;
  });

  const [erroCep, setErroCep] = useState(''); 
  const [erroFreteObrigatorio, setErroFreteObrigatorio] = useState(false); // Novo estado para erro visual
  const [descontoPorcentagem, setDescontoPorcentagem] = useState(0);
  const [msgCupom, setMsgCupom] = useState('');
  const [erroLimite, setErroLimite] = useState(null);

  useEffect(() => {
    const calcularTempo = () => {
      const expiraStr = localStorage.getItem('lumie_timer_expira');
      if (!expiraStr) return;

      const agora = Date.now();
      const restante = Math.floor((parseInt(expiraStr) - agora) / 1000);

      if (restante <= 0) {
        resetarTudo();
        navigate('/'); 
      } else {
        setTempoRestante(restante);
      }
    };

    const interval = setInterval(calcularTempo, 1000);
    calcularTempo();

    return () => clearInterval(interval);
  }, [navigate]);

  const resetarTudo = () => {
    localStorage.removeItem('lumie_timer_expira');
    localStorage.removeItem('lumie_timer_pausado');
    localStorage.removeItem('lumie_segundos_restantes');
    localStorage.removeItem('lumie_frete');
    localStorage.removeItem('cartItems');
    setItens([]);
    setFrete(null);           
    setCep('');                
    setCupom('');              
    setDescontoPorcentagem(0); 
    setMsgCupom('');           
    window.dispatchEvent(new Event('storage'));
  };

  const alterarQuantidade = (index, delta) => {
    const novaLista = [...itens];
    const novaQtd = novaLista[index].quantidade + delta;

    if (novaQtd >= 1 && novaQtd <= 99) {
      novaLista[index].quantidade = novaQtd;
      setErroLimite(null);
      setItens(novaLista);
      localStorage.setItem('cartItems', JSON.stringify(novaLista));
    } else if (novaQtd > 99) {
      setErroLimite(index);
    }
  };

  const removerItem = (index) => {
    const novaLista = itens.filter((_, i) => i !== index);
    if (novaLista.length === 0) {
      resetarTudo(); 
    } else {
      setItens(novaLista);
      localStorage.setItem('cartItems', JSON.stringify(novaLista));
    }
  };

  const formatarTempo = (segundos) => {
    if (segundos === null || segundos <= 0) return "15:00";
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${min}:${seg < 10 ? '0' : ''}${seg}`;
  };

  const handleCepChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    setErroCep('');
    setErroFreteObrigatorio(false); // Limpa o erro ao digitar
    if (value.length > 5) value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    setCep(value.substring(0, 9));
  };

  const calcularFreteReal = async () => {
    if (itens.length === 0) return;
    const cepLimpo = cep.replace(/\D/g, '');
    setErroCep(''); 
    if (cepLimpo.length !== 8) {
      setErroCep('Por favor, digite um CEP válido.');
      return;
    }
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();
      if (data.erro) {
        setErroCep('CEP não encontrado.');
      } else {
        const novoFrete = data.uf === 'SP' ? 15.00 : 50.00;
        setFrete(novoFrete);
        setErroFreteObrigatorio(false); // Sucesso no frete remove o erro
        localStorage.setItem('lumie_frete', novoFrete.toString());
      }
    } catch (error) { setErroCep('Erro ao calcular frete.'); }
  };

  const aplicarCupom = () => {
    if (itens.length === 0) return;
    setMsgCupom('');
    if (cupom.trim() === "") { setMsgCupom("Nenhum cupom foi aplicado."); return; }
    const sorteio = Math.floor(Math.random() * 11) + 5;
    setDescontoPorcentagem(sorteio);
    setMsgCupom(`Cupom aplicado! Você ganhou ${sorteio}% de desconto.`);
  };

  const subtotal = itens.reduce((acc, item) => acc + ((item.preco || item.price) * item.quantidade), 0);
  const valorDesconto = subtotal * (descontoPorcentagem / 100);
  const total = subtotal - valorDesconto + (frete || 0);

  const handleFinalizarCompra = () => {
    if (itens.length === 0) return;

    const freteAtual = parseFloat(localStorage.getItem('lumie_frete') || '0');

    if (!freteAtual || freteAtual <= 0) {
      setErroFreteObrigatorio(true); // Exibe a mensagem em vermelho
      return; 
    }

    const itensParaCheckout = itens.map(item => ({
      ...item,
      price: item.preco || item.price, 
      quantidade: item.quantidade
    }));

    localStorage.setItem('cartItems', JSON.stringify(itensParaCheckout));
    localStorage.setItem('lumie_frete', freteAtual.toString());
    localStorage.setItem('lumie_desconto_aplicado', valorDesconto.toString());
    localStorage.setItem('lumie_timer_pausado', 'true');
    
    window.dispatchEvent(new Event('storage'));
    navigate('/checkout');
  };

  return (
    <div className="carrinho-page-bg">
      <div className="carrinho-container">
        <h1 className="titulo-sessao">Meu Carrinho</h1>

        {itens.length > 0 && (
          <div className="urgencia-banner-replica">
            <div className="urgencia-icon-circle">
              <Clock size={24} color="#6d1e1e" />
            </div>
            <div className="urgencia-content-replica">
              <p className="urgencia-main-text-replica">
                {localStorage.getItem('lumie_timer_pausado') === 'true'
                  ? "Sua reserva está garantida enquanto você finaliza o pagamento."
                  : "Sua reserva expira em breve: finalize a compra antes que os produtos voltem ao estoque."}
              </p>
              <p className="timer-destaque-replica">
                {formatarTempo(tempoRestante)} <span className="timer-minutos-text">minutos</span>
              </p>
              <div className="barra-progresso-bg-replica">
                <div 
                  className="barra-progresso-fill-replica" 
                  style={{ 
                    width: `${Math.min(100, (tempoRestante / 900) * 100)}%`,
                    transition: 'width 1s linear' 
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div className="carrinho-grid-replica" style={itens.length === 0 ? { display: 'block' } : {}}>
          <div className="lista-produtos-replica" style={itens.length === 0 ? { width: '100%' } : {}}>
            {itens.length > 0 ? (
              itens.map((item, index) => (
                <div className="produto-card-replica" key={index}>
                  <div className="produto-img-container-replica">
                    <img src={item.imagem} alt={item.nome} />
                  </div>
                  <div className="produto-detalhes-replica">
                    <h3>{item.nome}</h3>
                    <p className="sku-replica">Tamanho do aro: {item.aro}</p>
                    <p className="preco-unitario-replica">R$ {(item.preco || item.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  
                  <div className="produto-controles-replica">
                    <button className="btn-lixo-minimal" onClick={() => removerItem(index)}>
                      <Trash2 size={18} />
                    </button>
                    <div className="seletor-qtd-minimal">
                      <button onClick={() => alterarQuantidade(index, -1)}><Minus size={12} /></button>
                      <span className="qtd-numero">{item.quantidade}</span>
                      <button onClick={() => alterarQuantidade(index, 1)}><Plus size={12} /></button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', width: '100%', textAlign: 'center' }}>
                <p style={{ color: '#555', fontSize: '20px', marginBottom: '30px' }}>Seu carrinho está vazio</p>
                <button className="btn-finalizar-replica" style={{ maxWidth: '280px', padding: '12px 40px' }} onClick={() => navigate('/')}>Voltar para a loja</button>
              </div>
            )}
          </div>

          {itens.length > 0 && (
            <div className="resumo-pedido-replica">
              <h3>Resumo do Pedido</h3>
              <div className="resumo-item-replica">
                <span>Subtotal</span>
                <span className="resumo-valor">R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              {descontoPorcentagem > 0 && (
                <div className="resumo-item-replica" style={{ color: '#28a745' }}>
                  <span>Desconto ({descontoPorcentagem}%)</span>
                  <span className="resumo-valor">- R$ {valorDesconto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="resumo-item-replica">
                <span>Frete</span>
                <span className="resumo-valor">{frete !== null ? `R$ ${frete.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ 0,00'}</span>
              </div>

              <div className="input-section-replica">
                <label><MapPin size={16} className="label-icon" /> Calcular Frete (Obrigatório)</label>
                <div className="input-row-replica">
                  <input type="text" placeholder="00000-000" value={cep} onChange={handleCepChange} />
                  <button className="btn-aplicar-outline" onClick={calcularFreteReal}>Aplicar</button>
                </div>
                {/* MENSAGEM DE ERRO SOLICITADA ABAIXO DO FRETE */}
                {erroFreteObrigatorio && (
                  <p style={{ color: '#ff0000', fontSize: '13px', marginTop: '8px', fontWeight: 'bold' }}>
                    É obrigatório por o CEP. *
                  </p>
                )}
                {erroCep && <p style={{ color: '#d93025', fontSize: '12px', marginTop: '6px' }}>{erroCep}</p>}
              </div>

              <div className="input-section-replica section-border-top">
                <label><Ticket size={16} className="label-icon" /> Cupom de Desconto</label>
                <div className="input-row-replica">
                  <input type="text" placeholder="Digite o código" value={cupom} onChange={(e) => setCupom(e.target.value.toUpperCase())} />
                  <button className="btn-aplicar-outline" onClick={aplicarCupom}>Aplicar</button>
                </div>
                {msgCupom && <p style={{ color: '#28a745', fontSize: '12px', marginTop: '6px' }}>{msgCupom}</p>}
              </div>

              <hr className="resumo-divider" />
              <div className="resumo-total-replica">
                <span>Total</span>
                <span className="total-gold-replica">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>

              <button className="btn-finalizar-replica" onClick={handleFinalizarCompra}>Finalizar Compra</button>
              <button className="btn-continuar-replica" onClick={() => navigate('/')}>Continuar Comprando</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Carrinho;