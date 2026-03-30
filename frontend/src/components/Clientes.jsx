import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles.css'; 

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const API_URL = "http://localhost:3001/api/clientes";

  const carregarClientes = async () => {
    const res = await axios.get(API_URL);
    setClientes(res.data);
  };

  useEffect(() => { carregarClientes(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dados = { nome, email, telefone, cpf };
    
    if (editandoId) {
      await axios.put(`${API_URL}/${editandoId}`, dados);
    } else {
      await axios.post(API_URL, dados);
    }
    
    setNome(''); setEmail(''); setTelefone(''); setCpf(''); setEditandoId(null);
    carregarClientes();
  };

  const deletarCliente = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    carregarClientes();
  };

  return (
    <div className="container-lumie">
      <h1 className="title-serif">Gestão de Clientes</h1>
      <form onSubmit={handleSubmit} className="crud-form">
        <div className="input-group"><label>Nome</label><input value={nome} onChange={e => setNome(e.target.value)} /></div>
        <div className="input-group"><label>CPF</label><input value={cpf} onChange={e => setCpf(e.target.value)} /></div>
        <div className="input-group"><label>E-mail</label><input value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div className="input-group"><label>Telefone</label><input value={telefone} onChange={e => setTelefone(e.target.value)} /></div>
        <button type="submit" className="btn-primary">{editandoId ? "Salvar" : "Cadastrar"}</button>
      </form>
      {/* Lista de clientes... (mesma lógica de map) */}
    </div>
  );
}