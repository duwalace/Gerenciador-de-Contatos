import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ContactList.css';

function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/contatos')
      .then(res => {
        setContacts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este contato?')) {
      axios.delete(`http://localhost:5000/contatos/${id}`)
        .then(() => setContacts(contacts.filter(contact => contact.id !== id)))
        .catch(err => console.error(err));
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.telefone.includes(searchTerm)
  );

  return (
    <div className="list-container">
      <div className="list-header">
        <h2>Lista de Contatos</h2>
        <Link to="/add" className="add-link">
          <span>+</span> Adicionar Contato
        </Link>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Pesquisar contatos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Carregando contatos...</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nome</th>
                <th>Contato</th>
                <th>Salário (R$)</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.length > 0 ? (
                filteredContacts.map(contact => (
                  <tr key={contact.id}>
                    <td className="photo-cell">
                      {contact.foto ? (
                        <img src={contact.foto} alt={contact.nome} className="contact-photo" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/50?text=Sem+foto';
                          }}
                        />
                      ) : (
                        <div className="no-photo">
                          <span>{contact.nome.charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="contact-name">{contact.nome}</div>
                      <div className="contact-email">{contact.email}</div>
                    </td>
                    <td>{contact.telefone || 'Não informado'}</td>
                    <td className="salary-cell">
                      <div className="salary-real">R$ {Number(contact.salario_real).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                      <div className="salary-other">
                        <span>${(contact.salario_dolar || 0).toFixed(2)}</span>
                        <span>€{(contact.salario_euro || 0).toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="actions-cell">
                      <Link to={`/edit/${contact.id}`} className="action-link edit">
                        <svg viewBox="0 0 24 24" width="18" height="18">
                          <path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                        </svg>
                        Editar
                      </Link>
                      <button onClick={() => handleDelete(contact.id)} className="action-link delete">
                        <svg viewBox="0 0 24 24" width="18" height="18">
                          <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                        </svg>
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="no-results">
                  <td colSpan="5">
                    Nenhum contato encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ContactList;