import React, { useEffect } from 'react';
import './Toast.css';

function Toast({ mensagem, tipo, onFechar }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFechar();
    }, 3000); // Some após 3 segundos
    return () => clearTimeout(timer);
  }, [onFechar]);

  return (
    <div className={`toast-container toast-${tipo}`}>
      <div className="toast-icon">
        {tipo === 'erro' ? '✕' : '✓'}
      </div>
      <span className="toast-mensagem">{mensagem}</span>
    </div>
  );
}

export default Toast;