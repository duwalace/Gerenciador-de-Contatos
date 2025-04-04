import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './ContactForm.css';

function ContactForm() {
  const [contact, setContact] = useState({
    nome: '', telefone: '', email: '', foto: '', salario_real: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios.get(`http://localhost:5000/contatos/${id}`)
        .then(res => {
          setContact(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    const request = id 
      ? axios.put(`http://localhost:5000/contatos/${id}`, contact)
      : axios.post('http://localhost:5000/contatos', contact);
    
    request
      .then(() => navigate('/'))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="form-container">
      <h2 className="form-title">{id ? 'Editar Contato' : 'Adicionar Contato'}</h2>
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="nome">Nome Completo</label>
          <input 
            id="nome"
            name="nome" 
            value={contact.nome} 
            onChange={handleChange} 
            placeholder="Digite o nome completo" 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="telefone">Telefone</label>
          <input 
            id="telefone"
            name="telefone" 
            value={contact.telefone} 
            onChange={handleChange} 
            placeholder="(00) 00000-0000" 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input 
            id="email"
            name="email" 
            type="email"
            value={contact.email} 
            onChange={handleChange} 
            placeholder="exemplo@email.com" 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="foto">URL da Foto</label>
          <input 
            id="foto"
            name="foto" 
            value={contact.foto} 
            onChange={handleChange} 
            placeholder="https://exemplo.com/foto.jpg" 
          />
          {contact.foto && (
            <div className="photo-preview">
              <img src={contact.foto} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="salario_real">Salário (R$)</label>
          <input 
            id="salario_real"
            name="salario_real" 
            type="number" 
            step="0.01"
            value={contact.salario_real} 
            onChange={handleChange} 
            placeholder="0,00" 
          />
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={handleBack} className="back-btn">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
            </svg>
            Voltar
          </button>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <span className="spinner"></span>
            ) : (
              id ? 'Atualizar Contato' : 'Cadastrar Contato'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ContactForm;