import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGem, faTruckFast, faCertificate, faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import './ExperienciaLumie.css';

const ExperienciaLumie = () => {
  const vantagens = [
    
    {
      id: 2,
      icon: faTruckFast,
      title: "Entrega Segura",
      desc: "Envio com seguro total e rapidez para todo o Brasil."
    },
    {
      id: 3,
      icon: faCertificate,
      title: "Garantia Eterna",
      desc: "Certificado de autenticidade e garantia vitalícia do metal."
    },
    {
      id: 4,
      icon: faArrowsRotate,
      title: "Troca Facilitada",
      desc: "Primeira troca grátis em até 30 dias após o recebimento."
    }
  ];

  return (
    <section className="experiencia-section">
      <div className="experiencia-header">
        <h2 className="title-serif">A Experiência Lumie</h2>
        <p className="subtitle-spacing">DESCUBRA NOSSAS VANTAGENS EXCLUSIVAS</p>
      </div>

      <div className="vantagens-grid">
        {vantagens.map(item => (
          <div key={item.id} className="vantagem-card">
            <div className="vantagem-icon">
              <FontAwesomeIcon icon={item.icon} />
            </div>
            <h4 className="vantagem-title">{item.title}</h4>
            <p className="vantagem-desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExperienciaLumie;