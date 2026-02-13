import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Send, X, MessageSquare, Book, User, Loader2 } from 'lucide-react';

function ChatSidebar({ onClose, textoEditor }) {
  const [messages, setMessages] = useState([
    { 
      role: 'model', 
      text: 'Graça e paz! Sou seu assistente teológico. Em que posso ajudar nos seus estudos hoje? Posso analisar o que você escreveu ou tirar dúvidas doutrinárias.' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Rola para baixo sempre que chega mensagem nova
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      // Pega a chave do arquivo .env
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error("API Key não encontrada. Verifique o arquivo .env");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      // O "Cérebro" Reformado
      const promptSistema = `
        Você é um mentor de teologia Reformada (Calvinista).
        
        Contexto atual do aluno (o que ele está escrevendo no caderno): 
        "${textoEditor.substring(0, 1000)}..." (trecho)

        Diretrizes de resposta:
        1. Responda à pergunta do aluno: "${userMessage}".
        2. Use sempre linguagem pastoral, acadêmica e encorajadora.
        3. Fundamente suas respostas na Bíblia Sagrada e nos Símbolos de Fé de Westminster (Confissão, Catecismo Maior e Breve).
        4. Se o aluno perguntar algo contrário à sã doutrina, corrija com mansidão e referências bíblicas.
        5. Seja conciso (máximo 3 parágrafos curtos).
      `;

      const result = await model.generateContent(promptSistema);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'model', text: text }]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'Perdão, irmão. Ocorreu um erro de conexão com a API. Verifique a chave ou a internet.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white border-l border-green-900 shadow-2xl">
      {/* Cabeçalho do Chat */}
      <div className="bg-green-900 text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <Book size={20} className="text-yellow-500" />
          <h3 className="font-bold text-sm">Teólogo Virtual</h3>
        </div>
        <button onClick={onClose} className="hover:bg-green-700 p-1 rounded transition">
          <X size={20} />
        </button>
      </div>

      {/* Área de Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] p-3 rounded-lg text-sm shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-green-700 text-white rounded-br-none' 
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
              }`}
            >
              {/* Ícone pequeno para identificar */}
              <div className="flex items-center gap-1 mb-1 opacity-70 text-xs font-bold uppercase">
                {msg.role === 'user' ? <User size={10} /> : <Book size={10} />}
                {msg.role === 'user' ? 'Você' : 'Mentor'}
              </div>
              <div className="leading-relaxed whitespace-pre-wrap">{msg.text}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-center gap-2 text-sm text-gray-500">
              <Loader2 size={16} className="animate-spin text-green-700" />
              <span>Consultando as Escrituras...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Faça uma pergunta teológica..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700"
        />
        <button 
          type="submit" 
          disabled={loading || !input.trim()}
          className="bg-green-900 text-white p-2 rounded-lg hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}

export default ChatSidebar;