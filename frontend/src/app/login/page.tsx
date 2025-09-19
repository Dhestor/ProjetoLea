'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { sanitizeInput, isValidEmail, isValidPassword } from '@/lib/sanitize'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Sanitização contra XSS
    const sanitizedEmail = sanitizeInput(email)
    const sanitizedPassword = sanitizeInput(password)

    if (!sanitizedEmail || !sanitizedPassword) {
      setError('Por favor, preencha todos os campos.')
      setLoading(false)
      return
    }

    if (!isValidEmail(sanitizedEmail)) {
      setError('Por favor, insira um e-mail válido.')
      setLoading(false)
      return
    }

    if (!isValidPassword(sanitizedPassword)) {
      setError('A senha deve ter entre 6 e 128 caracteres.')
      setLoading(false)
      return
    }

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: sanitizedEmail,
      password: sanitizedPassword,
    })

    if (loginError) {
      setError(loginError.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center p-4" 
         style={{ 
           background: 'linear-gradient(135deg, #f9fafb, #e2e8f0)',
           fontFamily: 'Inter, sans-serif',
           color: '#1e293b'
         }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden p-10 relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 to-orange-500"></div>
        
        <div className="text-center mb-8">
          <div className="flex flex-col items-center">
            <i className="fas fa-gavel text-4xl text-orange-400 mb-2 transition-transform hover:rotate-12"></i>
            <span className="text-xl font-bold text-center block mt-2">Painel Administrativo</span>
          </div>
          <p className="text-slate-500 mt-3">Entre na sua conta para continuar</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-6 relative">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3.5 pr-12 border border-gray-200 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-orange-400 focus:shadow-lg focus:shadow-orange-100 focus:bg-white"
              placeholder="seu@email.com"
              required
            />
            <i className="fas fa-envelope absolute right-4 top-11 text-xl text-orange-400 transition-all duration-300"></i>
          </div>

          <div className="mb-6 relative">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3.5 pr-12 border border-gray-200 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-orange-400 focus:shadow-lg focus:shadow-orange-100 focus:bg-white"
              placeholder="Digite sua senha"
              required
            />
            <i className="fas fa-lock absolute right-4 top-11 text-xl text-orange-400 transition-all duration-300"></i>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 border-none rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 text-white text-base font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner animate-spin"></i>
                Entrando...
              </>
            ) : (
              <>
                Entrar
                <i className="fas fa-arrow-right text-xl transition-transform group-hover:translate-x-1"></i>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}