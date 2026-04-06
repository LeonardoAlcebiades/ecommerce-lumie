import React, { useState, useEffect } from 'react';
import './Checkout.css';
import { CreditCard, Smartphone, Ticket, Lock, CheckCircle, DollarSign, AlertTriangle, Barcode, Truck } from 'lucide-react';

function Checkout() {
  const [etapa, setEtapa] = useState(1);
  const [metodoPagamento, setMetodoPagamento] = useState('cartao');
  const [dividirCartoes, setDividirCartoes] = useState(false);
  const [cartaoAtivo, setCartaoAtivo] = useState(0);
  const [quantidadeCartoes, setQuantidadeCartoes] = useState(1);
  const [tipoFrete, setTipoFrete] = useState('pac'); // Estado para a nova etapa 2
  
  const [erros, setErros] = useState({});
  const [erroFrete, setErroFrete] = useState(false);
  const [erroSoma, setErroSoma] = useState('');
  const [tentouFinalizar, setTentouFinalizar] = useState(false);

  const [formData, setFormData] = useState({
    nome: '', cpf: '', cep: '', rua: '', numero: '',
    complemento: '', bairro: '', cidade: '', estado: '', telefone: ''
  });

  const [valoresCheckout, setValoresCheckout] = useState({
    subtotal: 0,
    frete: 0,
    desconto: 0,
    total: 0
  });

  const [cartoes, setCartoes] = useState([
    { numero: '', nome: '', validade: '', cvv: '', cpfTitular: '', valor: '0,00' },
    { numero: '', nome: '', validade: '', cvv: '', cpfTitular: '', valor: '0,00' },
    { numero: '', nome: '', validade: '', cvv: '', cpfTitular: '', valor: '0,00' },
    { numero: '', nome: '', validade: '', cvv: '', cpfTitular: '', valor: '0,00' }
  ]);

  const temApenasLetras = (str) => /^[a-zA-ZÀ-ÿ\s]*$/.test(str);
  const temApenasNumeros = (str) => /^[0-9]*$/.test(str);

  const limparValor = (valor) => {
    if (typeof valor === 'number') return valor;
    const apenasNumeros = valor.replace(/\D/g, '');
    return Number(apenasNumeros) / 100;
  };

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const freteBase = 15.00; // Frete padrão definido como 15 reais
    const descontoSalvo = parseFloat(localStorage.getItem('lumie_desconto_aplicado') || '0');

    const sub = cartItems.reduce((acc, item) => {
      const preco = item.price || item.preco || 0;
      const qtd = item.quantity || item.quantidade || 1;
      return acc + (preco * qtd);
    }, 0);
    
    // Lógica: PAC = 15, SEDEX = 15 + 15 (30)
    const valorFreteFinal = tipoFrete === 'sedex' ? freteBase + 15 : freteBase;
    
    const novoTotal = sub - descontoSalvo + valorFreteFinal;

    setValoresCheckout({
      subtotal: sub,
      frete: valorFreteFinal,
      desconto: descontoSalvo,
      total: novoTotal > 0 ? novoTotal : 0
    });

    if (valorFreteFinal > 0) setErroFrete(false);

    const valorIndividual = (novoTotal / quantidadeCartoes).toFixed(2).replace('.', ',');
    setCartoes(prev => prev.map(c => ({ ...c, valor: valorIndividual })));
    setErroSoma('');

    localStorage.setItem('lumie_timer_pausado', 'true');
    window.dispatchEvent(new Event('storage'));

    return () => {
      const carrinho = localStorage.getItem('cartItems');
      if (carrinho && carrinho !== '[]') {
        localStorage.setItem('lumie_timer_pausado', 'false');
        window.dispatchEvent(new Event('storage'));
      }
    };
  }, [quantidadeCartoes, tipoFrete]); // Adicionado tipoFrete para recalcular total ao mudar opção

  const mascaraCartao = (v) => {
    return v.replace(/\D/g, '')
            .replace(/(\d{4})(\d)/, '$1 $2')
            .replace(/(\d{4})(\d)/, '$1 $2')
            .replace(/(\d{4})(\d)/, '$1 $2')
            .slice(0, 19);
  };

  const mascaraValidade = (v) => v.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
  const mascaraCPF = (v) => v.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').slice(0, 14);
  const mascaraTelefone = (v) => v.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 15);
  const mascaraCEP = (v) => v.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9);
  const mascaraMoeda = (v) => {
    v = v.replace(/\D/g, "");
    v = (Number(v) / 100).toFixed(2).replace(".", ",");
    v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    return v;
  };

  const validarCPF = (cpf) => {
    const limpo = cpf.replace(/\D/g, '');
    if (limpo.length !== 11 || /^(\d)\1+$/.test(limpo)) return false;
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(limpo.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(limpo.substring(9, 10))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(limpo.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(limpo.substring(10, 11));
  };

  const checarValidadeCartao = (valor) => {
    if (valor.length < 5) return '';
    const [mes, ano] = valor.split('/').map(Number);
    const dataAtual = new Date();
    const anoAtual = dataAtual.getFullYear() % 100;
    const mesAtual = dataAtual.getMonth() + 1;
    if (mes < 1 || mes > 12) return 'Mês inválido';
    if (ano < anoAtual || (ano === anoAtual && mes < mesAtual)) return 'Expirado';
    return '';
  };

  const buscarCep = async (valor) => {
    const cepLimpo = valor.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev, rua: data.logradouro, bairro: data.bairro, cidade: data.localidade, estado: data.uf
          }));
        }
      } catch (e) { console.error("Erro CEP"); }
    }
  };

  const handleChangeEndereco = (e) => {
    const { name, value } = e.target;
    
    if (['nome', 'cidade', 'estado', 'bairro', 'rua'].includes(name)) {
      if (!temApenasLetras(value)) {
        setErros(prev => ({ ...prev, [name]: 'Apenas letras são válidas' }));
        return;
      }
    } else if (['cpf', 'cep', 'telefone', 'numero'].includes(name)) {
      const valorSemMascara = value.replace(/[.\-()\s]/g, '');
      if (!temApenasNumeros(valorSemMascara)) {
        setErros(prev => ({ ...prev, [name]: 'Apenas números são válidos' }));
        return;
      }
    }

    setErros(prev => ({ ...prev, [name]: '' }));

    let novoValor = value;
    if (name === 'cpf') novoValor = mascaraCPF(value);
    if (name === 'cep') {
      novoValor = mascaraCEP(value);
      if (novoValor.length === 9) buscarCep(novoValor);
    }
    if (name === 'telefone') novoValor = mascaraTelefone(value);
    
    setFormData(prev => ({ ...prev, [name]: novoValor }));
  };

  const handleCartaoChange = (index, campo, valor) => {
    if (campo === 'nome') {
      if (!temApenasLetras(valor)) {
        setErros(prev => ({ ...prev, [`cartao_${index}_${campo}`]: 'Apenas letras são válidas' }));
        return;
      }
    } else if (['numero', 'cvv', 'cpfTitular', 'validade'].includes(campo)) {
      const valorSemMascara = valor.replace(/[\/\s]/g, '');
      if (!temApenasNumeros(valorSemMascara)) {
        setErros(prev => ({ ...prev, [`cartao_${index}_${campo}`]: 'Apenas números são válidos' }));
        return;
      }
    }

    const novosCartoes = [...cartoes];
    let novoValor = valor;

    if (campo === 'numero') novoValor = mascaraCartao(valor);
    if (campo === 'validade') novoValor = mascaraValidade(valor);
    if (campo === 'cpfTitular') novoValor = mascaraCPF(valor);
    if (campo === 'valor') {
      const valorDigitadoNumerico = limparValor(valor);
      const somaOutrosCartoes = cartoes.reduce((acc, c, i) => {
        if (i === index || i >= quantidadeCartoes) return acc;
        return acc + limparValor(c.valor);
      }, 0);
      const limiteDisponivel = Math.max(0, valoresCheckout.total - somaOutrosCartoes);
      novoValor = valorDigitadoNumerico > limiteDisponivel ? mascaraMoeda((limiteDisponivel * 100).toFixed(0)) : mascaraMoeda(valor.replace(/\D/g, ""));
      setErroSoma('');
    }

    novosCartoes[index][campo] = novoValor;
    setCartoes(novosCartoes);
    
    let erroMsg = '';
    if (campo === 'validade' && novoValor.length === 5) erroMsg = checarValidadeCartao(novoValor);
    setErros(prev => ({ ...prev, [`cartao_${index}_${campo}`]: erroMsg }));
  };

  const handleQuantidadeChange = (e) => {
    const qtd = Number(e.target.value);
    setQuantidadeCartoes(qtd);
    setDividirCartoes(qtd > 1);
    setCartaoAtivo(0);
  };

  const validarEtapa1 = () => {
    let novosErros = {};
    const camposObrigatorios = ['nome', 'cpf', 'cep', 'rua', 'numero', 'bairro', 'cidade', 'estado', 'telefone'];
    
    camposObrigatorios.forEach(campo => {
      if (!formData[campo] || formData[campo].trim() === '') {
        novosErros[campo] = 'Obrigatório';
      }
    });

    if (formData.cpf && !validarCPF(formData.cpf)) novosErros.cpf = 'CPF inválido';
    if (formData.nome && formData.nome.length < 3) novosErros.nome = 'Nome muito curto';

    setErros(prev => ({ ...prev, ...novosErros }));
    
    const temErroDeDigitação = Object.values(erros).some(msg => msg && msg.includes('Apenas'));
    return Object.keys(novosErros).length === 0 && !temErroDeDigitação;
  };

  const handleIrParaFrete = () => {
    setTentouFinalizar(true);
    if (validarEtapa1()) {
      setEtapa(2);
      window.scrollTo(0, 0);
    }
  };

  const handleIrParaPagamento = () => {
    setEtapa(3);
    window.scrollTo(0, 0);
  };

  const handleFinalizarCompra = () => {
    if (valoresCheckout.frete === 0) {
      setErroFrete(true);
      return;
    }
    if (metodoPagamento === 'cartao') {
      let errosCartao = {};
      for (let i = 0; i < quantidadeCartoes; i++) {
        if (!cartoes[i].numero) errosCartao[`cartao_${i}_numero`] = 'Obrigatório';
        else if (cartoes[i].numero.replace(/\s/g, '').length < 16) errosCartao[`cartao_${i}_numero`] = 'Inválido';
        
        if (!cartoes[i].nome) errosCartao[`cartao_${i}_nome`] = 'Obrigatório';
        
        if (!cartoes[i].validade) errosCartao[`cartao_${i}_validade`] = 'Obrigatório';
        else if (checarValidadeCartao(cartoes[i].validade)) errosCartao[`cartao_${i}_validade`] = 'Inválido';
        
        if (!cartoes[i].cvv) errosCartao[`cartao_${i}_cvv`] = 'Obrigatório';
        else if (cartoes[i].cvv.length < 3) errosCartao[`cartao_${i}_cvv`] = 'Inválido';
      }
      
      if (Object.keys(errosCartao).length > 0) {
        setErros(prev => ({ ...prev, ...errosCartao }));
        return;
      }
    }
    if (dividirCartoes) {
      const somaTotal = cartoes.reduce((acc, c, i) => i < quantidadeCartoes ? acc + limparValor(c.valor) : acc, 0);
      if (Math.abs(somaTotal - valoresCheckout.total) > 0.01) {
        setErroSoma(`Soma incorreta. Falta R$ ${(valoresCheckout.total - somaTotal).toFixed(2)}`);
        return;
      }
    }
    setEtapa(4);
  };

  const LabelErro = ({ campo }) => {
    if (erros[campo]) {
      return <span style={{color: '#ff4d4d', fontSize: '11px', fontWeight: 'bold', marginLeft: '5px'}}>({erros[campo]})</span>;
    }
    return null;
  };

  return (
    <div className="checkout-page-bg">
      <div className="checkout-container">
        <h1 className="titulo-sessao">Finalizar Compra</h1>

        <div className="checkout-stepper">
          <div className={`step-circle ${etapa >= 1 ? 'active' : ''}`}>1</div>
          <div className={`step-line ${etapa >= 2 ? 'active' : ''}`}></div>
          <div className={`step-circle ${etapa >= 2 ? 'active' : ''}`}>2</div>
          <div className={`step-line ${etapa >= 3 ? 'active' : ''}`}></div>
          <div className={`step-circle ${etapa >= 3 ? 'active' : ''}`}>3</div>
          <div className={`step-line ${etapa >= 4 ? 'active' : ''}`}></div>
          <div className={`step-circle ${etapa >= 4 ? 'active' : ''}`}>4</div>
        </div>

        <div className="checkout-card">
          {etapa === 1 && (
            <>
              <h2 className="checkout-section-title">1. Endereço de Entrega</h2>
              <div className="checkout-form">
                <div className="form-group full-width">
                  <label>Nome Completo <LabelErro campo="nome" /></label>
                  <input type="text" name="nome" value={formData.nome} onChange={handleChangeEndereco} placeholder="Seu nome" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>CPF <LabelErro campo="cpf" /></label>
                    <input type="text" name="cpf" value={formData.cpf} onChange={handleChangeEndereco} placeholder="000.000.000-00" />
                  </div>
                  <div className="form-group">
                    <label>CEP <LabelErro campo="cep" /></label>
                    <input type="text" name="cep" value={formData.cep} onChange={handleChangeEndereco} placeholder="00000-000" />
                  </div>
                </div>
                <div className="form-group full-width">
                  <label>Rua <LabelErro campo="rua" /></label>
                  <input type="text" name="rua" value={formData.rua} onChange={handleChangeEndereco} placeholder="Nome da rua" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Número <LabelErro campo="numero" /></label>
                    <input type="text" name="numero" value={formData.numero} onChange={handleChangeEndereco} placeholder="123" />
                  </div>
                  <div className="form-group">
                    <label>Complemento</label>
                    <input type="text" name="complemento" value={formData.complemento} onChange={handleChangeEndereco} placeholder="Apto, bloco..." />
                  </div>
                </div>
                <div className="form-group full-width">
                  <label>Bairro <LabelErro campo="bairro" /></label>
                  <input type="text" name="bairro" value={formData.bairro} onChange={handleChangeEndereco} placeholder="Seu bairro" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Cidade <LabelErro campo="cidade" /></label>
                    <input type="text" name="cidade" value={formData.cidade} onChange={handleChangeEndereco} placeholder="Sua cidade" />
                  </div>
                  <div className="form-group">
                    <label>Estado (UF) <LabelErro campo="estado" /></label>
                    <input type="text" name="estado" value={formData.estado} onChange={handleChangeEndereco} placeholder="SP" maxLength="2" />
                  </div>
                </div>
                <div className="form-group full-width">
                  <label>Telefone <LabelErro campo="telefone" /></label>
                  <input type="text" name="telefone" value={formData.telefone} onChange={handleChangeEndereco} placeholder="(00) 00000-0000" />
                </div>
                <button className="btn-proximo-checkout" onClick={handleIrParaFrete}>
                  Continuar para frete
                </button>
              </div>
            </>
          )}

          {etapa === 2 && (
            <div className="shipping-step-container">
              <h2 className="checkout-section-title">2. Opções de Envio</h2>
              <div className="payment-methods-list">
                <div className={`method-row ${tipoFrete === 'pac' ? 'active' : ''}`} onClick={() => setTipoFrete('pac')}>
                  <div className="radio-dot"></div>
                  <div className="method-info" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                    <Truck size={18} className="icon-gold" />
                    <span className="label">Correios PAC (7 a 10 dias úteis) - R$ 15,00</span>
                  </div>
                </div>
                <div className={`method-row ${tipoFrete === 'sedex' ? 'active' : ''}`} onClick={() => setTipoFrete('sedex')}>
                  <div className="radio-dot"></div>
                  <div className="method-info" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                    <Truck size={18} className="icon-gold" />
                    <span className="label">Correios SEDEX (2 a 4 dias úteis) - R$ 30,00</span>
                  </div>
                </div>
              </div>
              
              <div className="summary-mini-box" style={{ marginTop: '20px', padding: '15px', background: '#fdfdfd', borderRadius: '8px', border: '1px solid #d8d6d6' }}>
                 <p style={{ margin: '0', color: '#000000' }}>Subtotal: R$ {valoresCheckout.subtotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                 <h3 style={{ margin: '5px 0 0 0', color: '#d4af37' }}>Total com frete: R$ {valoresCheckout.total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h3>
              </div>

              <div className="checkout-actions-row">
                <button className="btn-voltar-checkout" onClick={() => setEtapa(1)}>Voltar</button>
                <button className="btn-proximo-checkout" onClick={handleIrParaPagamento}>
                  Ir para pagamento
                </button>
              </div>
            </div>
          )}

          {etapa === 3 && (
            <div className="payment-step-container">
              <h2 className="checkout-section-title">3. Forma de Pagamento</h2>
              <div className="payment-methods-list">
                <div className={`method-row ${metodoPagamento === 'cartao' ? 'active' : ''}`} onClick={() => setMetodoPagamento('cartao')}>
                  <div className="radio-dot"></div>
                  <div className="method-info" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                    <CreditCard size={18} className="icon-gold" />
                    <span className="label">Cartão de Crédito</span>
                  </div>
                </div>
                <div className={`method-row ${metodoPagamento === 'pix' ? 'active' : ''}`} onClick={() => setMetodoPagamento('pix')}>
                  <div className="radio-dot"></div>
                  <div className="method-info" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                    <Smartphone size={18} className="icon-gold" />
                    <span className="label">PIX (5% de desconto: R$ {(valoresCheckout.total * 0.95).toLocaleString('pt-BR', {minimumFractionDigits: 2})})</span>
                  </div>
                </div>
                <div className={`method-row ${metodoPagamento === 'boleto' ? 'active' : ''}`} onClick={() => setMetodoPagamento('boleto')}>
                  <div className="radio-dot"></div>
                  <div className="method-info" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                    <Barcode size={18} className="icon-gold" />
                    <span className="label">Boleto Bancário</span>
                  </div>
                </div>
              </div>

              {metodoPagamento === 'cartao' && (
                <>
                  <div className="split-cards-toggle-box">
                    <div className="toggle-content">
                      <CreditCard size={18} color="#d4af37" />
                      <div className="toggle-texts">
                        <strong>Pagar com múltiplos cartões</strong>
                        <p>Divida o pagamento em até 4 cartões diferentes</p>
                      </div>
                    </div>
                    <select className="select-quantidade-cartoes" value={quantidadeCartoes} onChange={handleQuantidadeChange}>
                      <option value={1}>1 Cartão</option>
                      <option value={2}>2 Cartões</option>
                      <option value={3}>3 Cartões</option>
                      <option value={4}>4 Cartões</option>
                    </select>
                  </div>

                  {dividirCartoes && (
                    <div className="division-values-container animate-fade-in">
                      <div className="division-title"><DollarSign size={18} /> Divisão de Valores</div>
                      <div className="values-grid">
                        {Array.from({ length: quantidadeCartoes }).map((_, i) => (
                          <div key={i} className="value-input-group">
                            <label>Valor no {i + 1}º Cartão</label>
                            <div className="value-field-wrapper">
                              <span>R$</span>
                              <input type="text" value={cartoes[i].valor} onChange={(e) => handleCartaoChange(i, 'valor', e.target.value)} />
                            </div>
                          </div>
                        ))}
                      </div>
                      {erroSoma && <div className="error-message-sum"><AlertTriangle size={14} /> {erroSoma}</div>}
                    </div>
                  )}

                  <div className="card-form-area animate-fade-in">
                    {dividirCartoes && (
                      <div className="card-tabs-container">
                        {Array.from({ length: quantidadeCartoes }).map((_, i) => (
                          <button key={i} className={`tab-item ${cartaoAtivo === i ? 'active' : ''}`} onClick={() => setCartaoAtivo(i)}>
                            {i + 1}º Cartão
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="visual-card-display">
                      <div className="card-top-row">
                        <div className="chip"></div>
                        <span className="card-split-value">R$ {cartoes[cartaoAtivo].valor}</span>
                      </div>
                      <div className="card-number-dots">{cartoes[cartaoAtivo].numero || '•••• •••• •••• ••••'}</div>
                      <div className="card-bottom">
                        <div><span>Nome do Titular</span><p>{cartoes[cartaoAtivo].nome || 'SEU NOME'}</p></div>
                        <div><span>Validade</span><p>{cartoes[cartaoAtivo].validade || 'MM/AA'}</p></div>
                      </div>
                    </div>

                    <div className="checkout-form">
                      <div className="form-group full-width">
                        <label>Número do Cartão <LabelErro campo={`cartao_${cartaoAtivo}_numero`} /></label>
                        <input type="text" value={cartoes[cartaoAtivo].numero} onChange={(e) => handleCartaoChange(cartaoAtivo, 'numero', e.target.value)} placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="form-group full-width">
                        <label>Nome do Titular <LabelErro campo={`cartao_${cartaoAtivo}_nome`} /></label>
                        <input type="text" value={cartoes[cartaoAtivo].nome} onChange={(e) => handleCartaoChange(cartaoAtivo, 'nome', e.target.value)} placeholder="JOÃO DA SILVA" />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Validade <LabelErro campo={`cartao_${cartaoAtivo}_validade`} /></label>
                          <input type="text" value={cartoes[cartaoAtivo].validade} onChange={(e) => handleCartaoChange(cartaoAtivo, 'validade', e.target.value)} placeholder="MM/AA" />
                        </div>
                        <div className="form-group">
                          <label>CVV <LabelErro campo={`cartao_${cartaoAtivo}_cvv`} /></label>
                          <input type="text" value={cartoes[cartaoAtivo].cvv} onChange={(e) => handleCartaoChange(cartaoAtivo, 'cvv', e.target.value)} placeholder="123" maxLength="4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="secure-badge-box">
                <Lock size={16} color="#d4af37" />
                <div className="badge-text">
                  <strong>Seus dados estão seguros</strong>
                  <p>Criptografia de ponta ativada.</p>
                </div>
              </div>

              <div className="checkout-actions-row">
                <button className="btn-voltar-checkout" onClick={() => setEtapa(2)}>Voltar</button>
                <button className="btn-proximo-checkout finalize" onClick={handleFinalizarCompra}>
                  {metodoPagamento === 'pix' ? 'Gerar código Pix' : 'Finalizar pagamento'}
                </button>
              </div>
            </div>
          )}

          {etapa === 4 && (
            <div className="success-container">
              <CheckCircle size={60} color="#d4af37" />
              <h2 className="checkout-section-title">Pedido Confirmado!</h2>
              <p>Obrigado por sua compra.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Checkout;