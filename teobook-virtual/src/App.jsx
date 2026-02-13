import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from './Onboarding';
import Dashboard from './Dashboard';
import Notebook from './Notebook';

function App() {
  const [aluno, setAluno] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica se já existe login
    const dadosSalvos = localStorage.getItem('teobook_aluno');
    if (dadosSalvos) {
      setAluno(JSON.parse(dadosSalvos));
    }
    setLoading(false);
  }, []);

  const salvarCadastro = (dados) => {
    localStorage.setItem('teobook_aluno', JSON.stringify(dados));
    setAluno(dados);
  };

  const fazerLogout = () => {
    localStorage.removeItem('teobook_aluno');
    setAluno(null);
    // Recarrega a página para limpar estados
    window.location.href = "/";
  };

  if (loading) return <div className="p-10 text-center text-green-900">Carregando TEObook...</div>;

  return (
    <BrowserRouter>
      <div className="font-sans text-gray-900">
        <Routes>
          {/* Rota Raiz: Se tem aluno, vai pro Dashboard, senão Onboarding */}
          <Route 
            path="/" 
            element={
              !aluno ? (
                <Onboarding onSave={salvarCadastro} />
              ) : (
                <Dashboard aluno={aluno} onLogout={fazerLogout} />
              )
            } 
          />

          {/* Rota do Caderno: Só acessa se tiver aluno */}
          <Route 
            path="/materia/:id" 
            element={aluno ? <Notebook /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;