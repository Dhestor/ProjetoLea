'use client';

import { FormEvent, useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nome: '',
    mensagem: ''
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const text = `Olá! Me chamo ${formData.nome} e gostaria de mais informações.${formData.mensagem ? '\n\n' + formData.mensagem : ''}`;
    const whatsappNumber = '19999052345'; // Substitua pelo número correto
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Entre em Contato</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="nome">
            Nome Completo
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            required
            value={formData.nome}
            onChange={(e) => setFormData({...formData, nome: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="mensagem">
            Mensagem (opcional)
          </label>
          <textarea
            id="mensagem"
            name="mensagem"
            rows={4}
            value={formData.mensagem}
            onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            placeholder="Digite sua mensagem aqui..."
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 flex items-center justify-center"
        >
          <i className="fab fa-whatsapp mr-2 text-xl"></i>
          Enviar Mensagem no WhatsApp
        </button>
      </form>
    </div>
  );
}
