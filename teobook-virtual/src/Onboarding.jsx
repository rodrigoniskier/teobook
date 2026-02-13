import React, { useState } from 'react';

function Onboarding({ onSave }) {
  const [formData, setFormData] = useState({
    nomeSeminarista: '',
    nomeSeminario: '',
    anoEntrada: new Date().getFullYear(),
    turmaInicial: 'T1'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nomeSeminarista || !formData.nomeSeminario) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border-t-4 border-green-900">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-green-900 mb-2">TEObook Virtual</h1>
          <p className="text-gray-600 text-sm">Registro de Conteúdo para Seminaristas</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome do Seminarista</label>
            <input 
              type="text" 
              name="nomeSeminarista"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 outline-none"
              placeholder="Ex: João Calvino"
              value={formData.nomeSeminarista}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nome do Seminário</label>
            <input 
              type="text" 
              name="nomeSeminario"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 outline-none"
              placeholder="Ex: JMC, SP, Rio..."
              value={formData.nomeSeminario}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Ano de Entrada</label>
              <input 
                type="number" 
                name="anoEntrada"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 outline-none"
                value={formData.anoEntrada}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Turma Inicial</label>
              <select 
                name="turmaInicial"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 outline-none"
                value={formData.turmaInicial}
                onChange={handleChange}
              >
                <option value="T1">T1</option>
                <option value="T2">T2</option>
                <option value="T3">T3</option>
                <option value="T4">T4</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-green-900 text-white py-2 px-4 rounded-md hover:bg-green-800 transition duration-200 mt-6 font-semibold"
          >
            Iniciar Jornada Teológica
          </button>
        </form>
        
        <p className="mt-4 text-xs text-center text-gray-400">
          "Soli Deo Gloria" - Desenvolvido por Rodrigo Niskier.
        </p>
      </div>
    </div>
  );
}

export default Onboarding;