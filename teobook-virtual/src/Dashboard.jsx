import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, Clock, Calendar, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Dashboard({ aluno, onLogout }) {
  const [materias, setMaterias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  
  const [novaMateria, setNovaMateria] = useState({
    nome: '',
    professor: '',
    dias: [], 
    horario: ''
  });

  const diasSemana = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];

  useEffect(() => {
    const salvos = localStorage.getItem('teobook_materias');
    if (salvos) {
      setMaterias(JSON.parse(salvos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('teobook_materias', JSON.stringify(materias));
  }, [materias]);

  const handleSaveMateria = (e) => {
    e.preventDefault();
    if (!novaMateria.nome) return;

    const item = { ...novaMateria, id: Date.now() };
    setMaterias([...materias, item]);
    
    setNovaMateria({ nome: '', professor: '', dias: [], horario: '' });
    setShowModal(false);
  };

  const toggleDia = (dia) => {
    if (novaMateria.dias.includes(dia)) {
      setNovaMateria({ ...novaMateria, dias: novaMateria.dias.filter(d => d !== dia) });
    } else {
      setNovaMateria({ ...novaMateria, dias: [...novaMateria.dias, dia] });
    }
  };

  const deletarMateria = (id) => {
    if (window.confirm("Deseja remover esta matéria e suas anotações?")) {
      setMaterias(materias.filter(m => m.id !== id));
      // Opcional: Limpar também as notas salvas dessa matéria
      localStorage.removeItem(`teobook_notas_${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Cabeçalho Verde IPB */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 border-t-4 border-t-green-900">
        <div className="flex items-center gap-4">
          {/* LOGOS PEQUENAS */}
          <div className="flex items-center gap-3 border-r pr-4 border-gray-300">
             <img src="/logo-ipb.png" alt="IPB" className="h-10 w-auto" />
             <img src="/logo-spn.png" alt="SPN" className="h-10 w-auto" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-green-900 leading-none">TEObook</h1>
            <p className="text-xs text-gray-500">Seminário {aluno.nomeSeminario}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="text-right hidden sm:block">
             <p className="text-sm font-medium text-gray-700">{aluno.nomeSeminarista}</p>
             <p className="text-xs text-gray-500">{aluno.turmaInicial} • {aluno.anoEntrada}</p>
           </div>
           <button onClick={onLogout} className="text-xs text-red-400 hover:text-red-600 border border-red-200 px-2 py-1 rounded">Sair</button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Minhas Matérias</h2>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-green-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-800 transition shadow-sm"
          >
            <Plus size={20} /> Nova Matéria
          </button>
        </div>

        {materias.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
            <BookOpen size={48} className="mx-auto text-green-200 mb-4" />
            <p className="text-gray-500">Nenhuma matéria cadastrada ainda.</p>
            <p className="text-sm text-gray-400">Clique em "Nova Matéria" para começar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {materias.map((materia) => (
              <div 
                key={materia.id} 
                onClick={() => navigate(`/materia/${materia.id}`)}
                className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer group relative hover:border-green-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{materia.nome}</h3>
                    <p className="text-sm text-gray-500 mb-3">Prof. {materia.professor}</p>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); deletarMateria(materia.id); }}
                    className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-gray-600 mt-2">
                  <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded text-green-800 font-medium">
                    <Calendar size={14} />
                    <span>{materia.dias.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-gray-600">
                    <Clock size={14} />
                    <span>{materia.horario}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de Cadastro */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl border-t-4 border-green-900">
            <h2 className="text-xl font-bold mb-4 text-green-900">Cadastrar Nova Matéria</h2>
            
            <form onSubmit={handleSaveMateria} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome da Matéria</label>
                <input 
                  autoFocus
                  type="text" 
                  className="w-full border p-2 rounded mt-1 focus:ring-green-500 focus:border-green-500 outline-none" 
                  placeholder="Ex: Teologia Sistemática I"
                  value={novaMateria.nome}
                  onChange={e => setNovaMateria({...novaMateria, nome: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Professor</label>
                <input 
                  type="text" 
                  className="w-full border p-2 rounded mt-1 focus:ring-green-500 focus:border-green-500 outline-none" 
                  placeholder="Ex: Rev. Silva"
                  value={novaMateria.professor}
                  onChange={e => setNovaMateria({...novaMateria, professor: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dias da Semana</label>
                <div className="flex gap-2">
                  {diasSemana.map(dia => (
                    <button
                      key={dia}
                      type="button"
                      onClick={() => toggleDia(dia)}
                      className={`px-3 py-1 rounded text-sm border transition ${
                        novaMateria.dias.includes(dia) 
                          ? 'bg-green-900 text-white border-green-900' 
                          : 'bg-white text-gray-600 border-gray-300 hover:bg-green-50'
                      }`}
                    >
                      {dia}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Horário</label>
                <input 
                  type="text" 
                  className="w-full border p-2 rounded mt-1 focus:ring-green-500 focus:border-green-500 outline-none" 
                  placeholder="Ex: 19:00 - 22:30"
                  value={novaMateria.horario}
                  onChange={e => setNovaMateria({...novaMateria, horario: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-green-900 text-white rounded hover:bg-green-800 font-medium"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;