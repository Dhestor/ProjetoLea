'use client'

import Link from 'next/link';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }
  return (
    <header className="border-b border-gray-300 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Site Name */}
          <div className="flex items-center space-x-2">
            <img
              alt="Logo"
              className="rounded-full w-8 h-8"
              src="https://storage.googleapis.com/a1aa/image/43ddb391-40b4-4a81-cb54-6f8e961d2ee6.jpg"
            />
            <Link href="/">
              <span className="text-xl sm:text-2xl font-extrabold text-blue-800">Nome Site</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6 lg:space-x-8 text-blue-900 font-semibold">
              <li>
                <Link href="/" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:shadow-lg hover:text-blue-700 transition-all duration-300">
                  <i className="fas fa-home"></i><span className="hidden lg:inline">Home</span>
                </Link>
              </li>
              <li>
                <Link href="/como-funciona" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:shadow-lg hover:text-blue-700 transition-all duration-300">
                  <i className="fas fa-question-circle"></i><span className="hidden lg:inline">Como Funciona</span>
                </Link>
              </li>
              <li>
                <Link href="/contato" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:shadow-lg hover:text-blue-700 transition-all duration-300">
                  <i className="fas fa-envelope"></i><span className="hidden lg:inline">Contato</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {user ? (
              <>
                <span className="hidden sm:flex text-blue-800 font-semibold items-center gap-2 text-sm">
                  <i className="fas fa-user-shield"></i>
                  <span className="hidden lg:inline">Olá {user.user_metadata?.name || user.email}</span>
                </span>
                <Link href="/dashboard" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-2 sm:px-4 py-2 rounded-md text-sm sm:text-base transition-colors duration-300">
                  <span className="hidden sm:inline">Área Admin</span>
                  <i className="fas fa-cog sm:hidden"></i>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-2 sm:px-4 py-2 rounded-md text-sm sm:text-base transition-colors duration-300"
                >
                  <span className="hidden sm:inline">Sair</span>
                  <i className="fas fa-sign-out-alt sm:hidden"></i>
                </button>
              </>
            ) : (
              <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base transition-colors duration-300">
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden pb-4">
          <ul className="flex justify-center space-x-6 text-blue-900 font-semibold text-sm">
            <li>
              <Link href="/" className="flex flex-col items-center space-y-1 px-2 py-1 rounded-md hover:text-blue-700 transition-colors duration-300">
                <i className="fas fa-home"></i><span>Home</span>
              </Link>
            </li>
            <li>
              <Link href="/como-funciona" className="flex flex-col items-center space-y-1 px-2 py-1 rounded-md hover:text-blue-700 transition-colors duration-300">
                <i className="fas fa-question-circle"></i><span>Como Funciona</span>
              </Link>
            </li>
            <li>
              <Link href="/contato" className="flex flex-col items-center space-y-1 px-2 py-1 rounded-md hover:text-blue-700 transition-colors duration-300">
                <i className="fas fa-envelope"></i><span>Contato</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
