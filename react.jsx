import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Auth = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isRegister ? 'http://localhost:5000/register' : 'http://localhost:5000/login';
      const payload = isRegister ? { name, email, password } : { email, password };
      const response = await axios.post(url, payload);
      if (!isRegister) {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
      } else {
        setIsRegister(false);
      }
    } catch (err) {
      setError('Erro ao processar a solicitação');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">{isRegister ? 'Cadastro' : 'Login'}</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input
              type="text"
              placeholder="Nome"
              className="w-full p-2 border rounded mb-4"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full p-2 border rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            {isRegister ? 'Cadastrar' : 'Entrar'}
          </button>
        </form>
        <button
          className="w-full text-blue-500 mt-4"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? 'Já tem uma conta? Faça login' : 'Não tem conta? Cadastre-se'}
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:5000/links', {
      headers: { Authorization: token },
    }).then(response => setLinks(response.data));
  }, [token]);

  const addLink = async (e) => {
    e.preventDefault();
    const response = await axios.post('http://localhost:5000/links', { url, title }, {
      headers: { Authorization: token },
    });
    setLinks([...links, response.data]);
  };

  const deleteLink = async (id) => {
    await axios.delete(`http://localhost:5000/links/${id}`, {
      headers: { Authorization: token },
    });
    setLinks(links.filter(link => link.id !== id));
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <form onSubmit={addLink} className="mb-4">
        <input
          type="text"
          placeholder="Título"
          className="p-2 border rounded mr-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="URL"
          className="p-2 border rounded mr-2"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded">Adicionar</button>
      </form>
      <ul>
        {links.map(link => (
          <li key={link.id} className="p-2 border-b flex justify-between">
            <span>{link.title} - {link.url}</span>
            <button onClick={() => deleteLink(link.id)} className="bg-red-500 text-white p-1 rounded">Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export { Auth, Dashboard };
