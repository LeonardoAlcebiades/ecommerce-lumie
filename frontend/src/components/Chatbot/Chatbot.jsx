import React, { useState } from 'react';
import './Chatbot.css';

const BotLumieIcon = () => (
  <svg viewBox="0 0 1024 1024" fill="currentColor">
    <path d="M725.33,512a42.67,42.67,0,1,1-42.66-42.67A42.67,42.67,0,0,1,725.33,512ZM341.33,469.33A42.67,42.67,0,1,0,384,512,42.67,42.67,0,0,0,341.33,469.33ZM938.67,469.33V554.67a42.67,42.67,0,0,1-85.34,0V469.33a42.67,42.67,0,0,1,85.34,0ZM170.67,469.33V554.67a42.67,42.67,0,0,1-85.34,0V469.33a42.67,42.67,0,0,1,85.34,0ZM512,128A42.67,42.67,0,0,0,554.67,85.33V42.67a42.67,42.67,0,0,0-85.34,0V85.33A42.67,42.67,0,0,0,512,128ZM768,256H256A128.15,128.15,0,0,0,128,384V725.33A128.15,128.15,0,0,0,256,853.33H426.67v85.34a42.67,42.67,0,0,0,85.33,0V853.33H768a128.15,128.15,0,0,0,128-128V384A128.15,128.15,0,0,0,768,256ZM810.67,725.33A42.72,42.72,0,0,1,768,768H256a42.72,42.72,0,0,1-42.67-42.67V384A42.72,42.72,0,0,1,256,341.33H768A42.72,42.72,0,0,1,810.67,384Z"/>
  </svg>
);

const UserSvgIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim()) {
      console.log("Mensagem enviada:", inputValue);
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className={`chatbot-premium ${isOpen ? 'is-active' : ''}`}>
      <button className="chat-trigger-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✕" : "💬"}
      </button>

      {isOpen && (
        <div className="chat-window-premium">
          <div className="chat-header-grad">
            <div className="bot-title-area">
              <div className="bot-avatar-circle"><BotLumieIcon /></div>
              <div className="text-info">
                <span>Assistente Lumie</span>
                <div className="status-online"><div className="dot"></div>Online</div>
              </div>
            </div>
            <button className="close-chat" onClick={() => setIsOpen(false)}>&times;</button>
          </div>

          <div className="chat-messages-premium">
            <div className="msg-row bot">
              <div className="avatar bot"><BotLumieIcon /></div>
              <div className="bubble-wrapper">
                <div className="bubble">Olá! Como podemos ajudar você hoje?</div>
              </div>
            </div>
            
            <div className="msg-row user">
              <div className="avatar user"><UserSvgIcon /></div>
              <div className="bubble-wrapper">
                <div className="bubble user-gradient">Gostaria de saber o prazo de entrega para SP.</div>
              </div>
            </div>
          </div>

          <div className="chat-footer-premium">
            <div className="chat-input-row">
              <div className="chat-input-premium">
                <input 
                  type="text" 
                  placeholder="Escreva sua mensagem..." 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <button 
                className={`send-msg-btn ${inputValue.trim() ? 'has-text' : ''}`} 
                onClick={handleSend}
                disabled={!inputValue.trim()}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </div>
            <p className="enter-hint">Pressione Enter para enviar</p>
          </div>
        </div>
      )}
    </div>
  );
}