import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { ArrowLeft, Save, Bot, Download, MessageSquare } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatSidebar from './ChatSidebar';

function Notebook() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [materia, setMateria] = useState(null);
  const [conteudo, setConteudo] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [showChat, setShowChat] = useState(false); // Estado para abrir/fechar chat

  // Carregar dados
  useEffect(() => {
    const materiasSalvas = JSON.parse(localStorage.getItem('teobook_materias') || '[]');
    const materiaAtual = materiasSalvas.find(m => m.id === parseInt(id));
    
    if (materiaAtual) {
      setMateria(materiaAtual);
      const notasSalvas = localStorage.getItem(`teobook_notas_${id}`);
      if (notasSalvas) setConteudo(notasSalvas);
    }
  }, [id]);

  // Autosave
  useEffect(() => {
    const timer = setTimeout(() => {
      if (conteudo) {
        localStorage.setItem(`teobook_notas_${id}`, conteudo);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [conteudo, id]);

  const salvarNotas = () => {
    setSalvando(true);
    localStorage.setItem(`teobook_notas_${id}`, conteudo);
    setTimeout(() => setSalvando(false), 800);
  };

  // Exportar DOCX Simplificado (para focar no chat agora)
  const exportarDocx = () => {
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>${materia.nome}</title></head><body>`;
    const footer = "</body></html>";
    const sourceHTML = header + `<h1>${materia.nome}</h1>` + conteudo + footer;
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `${materia.nome}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'direction': 'rtl' }, { 'align': [] }],
      ['link', 'image', 'clean']
    ],
  };

  if (!materia) return <div className="p-10 text-green-900">Carregando...</div>;

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header Fixo */}
      <header className="bg-green-900 text-white px-4 py-3 flex justify-between items-center shadow-md z-20 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="hover:bg-green-800 p-2 rounded-full transition">
            <ArrowLeft size={20} />
          </button>
          <div className="overflow-hidden">
            <h1 className="font-bold text-lg leading-tight truncate">{materia.nome}</h1>
            <p className="text-xs text-green-200 truncate">Prof. {materia.professor}</p>
          </div>
        </div>

        <div className="flex gap-2 items-center">
           <button onClick={exportarDocx} className="p-2 hover:bg-green-800 rounded transition hidden sm:block" title="Baixar DOC">
             <Download size={18} />
           </button>

           <button 
             onClick={salvarNotas} 
             className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-xs px-3 py-2 rounded shadow transition"
           >
             <Save size={16} />
             {salvando ? '...' : 'Salvar'}
           </button>

           {/* Botão Toggle Chat */}
           <button 
             onClick={() => setShowChat(!showChat)}
             className={`flex items-center gap-2 text-xs px-3 py-2 rounded shadow transition border ${
               showChat ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-transparent border-green-400 text-green-100 hover:bg-green-800'
             }`}
           >
             {showChat ? <ArrowLeft size={16}/> : <MessageSquare size={16}/>}
             <span className="hidden sm:inline">{showChat ? 'Fechar Chat' : 'Abrir Chat IA'}</span>
           </button>
        </div>
      </header>

      {/* Corpo Principal (Layout Flex) */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Lado Esquerdo: Editor (Ocupa tudo ou encolhe se chat abrir) */}
        <div className={`flex flex-col transition-all duration-300 ease-in-out h-full ${showChat ? 'w-full md:w-2/3' : 'w-full'}`}>
          <div className="flex-1 bg-white shadow-lg m-4 rounded-lg border border-gray-200 flex flex-col overflow-hidden">
             <ReactQuill 
                theme="snow" 
                value={conteudo} 
                onChange={setConteudo} 
                modules={modules}
                className="h-full flex flex-col"
                placeholder="Anotações da aula..."
              />
          </div>
        </div>

        {/* Lado Direito: Chat (Slide-in) */}
        <div 
          className={`absolute inset-y-0 right-0 w-full md:w-1/3 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-10 ${
            showChat ? 'translate-x-0' : 'translate-x-full'
          } md:relative md:transform-none md:transition-all ${
            showChat ? 'md:flex' : 'md:hidden'
          }`}
        >
          {showChat && (
            <ChatSidebar 
              onClose={() => setShowChat(false)} 
              textoEditor={conteudo} // Passamos o texto para a IA ter contexto
            />
          )}
        </div>

      </div>
    </div>
  );
}

// CSS Global para o Editor preencher altura
const style = document.createElement('style');
style.innerHTML = `
  .quill { display: flex; flex-direction: column; height: 100%; }
  .ql-container { flex: 1; overflow-y: auto; font-family: 'Georgia', serif; font-size: 16px; }
  .ql-toolbar { border-top: none !important; border-left: none !important; border-right: none !important; background: #f9fafb; }
`;
document.head.appendChild(style);

export default Notebook;