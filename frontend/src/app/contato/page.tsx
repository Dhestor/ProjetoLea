import Image from 'next/image';
import ContactForm from '@/components/contact/ContactForm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Contato() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Informações do Corretor */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative w-40 h-40 mb-4">
              <Image
                src="/images/profile.jpg"
                alt="Foto do Corretor"
                fill
                className="rounded-full object-cover border-4 border-orange-500"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Léa Sales Cunha</h1>
            <div className="flex flex-col items-center space-y-1">
              <p className="text-orange-600 font-semibold">CRECI-SP 42.950</p>
              <p className="text-orange-600 font-semibold">CNAI 022756</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <a
                href="mailto:leasalescunha@gmail.com"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
              >
                <i className="far fa-envelope mr-2"></i>
                Contato via E-mail
              </a>
            </div>
            
            <div className="text-center text-gray-600">
              <p className="mb-2">Especialista em Imóveis</p>
              <p>Corretora especializada em imóveis com desconto</p>
            </div>
          </div>
        </div>

        {/* Formulário de Contato */}
        <ContactForm />
      </div>
      </main>
      <Footer />
    </div>
  );
}
