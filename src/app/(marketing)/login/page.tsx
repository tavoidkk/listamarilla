'use client';

import { useState, useTransition } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { resolvePostLoginDestination } from "./actions";

export default function MarketingLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = (formData.get('email') as string ?? '').trim();
    const password = formData.get('password') as string ?? '';

    if (!email || !password) {
      setError('Por favor ingresa tu correo y contraseña.');
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (authError.message.toLowerCase().includes('invalid login credentials')) {
          setError('Correo o contraseña incorrectos.');
        } else if (authError.message.toLowerCase().includes('email not confirmed')) {
          setError('Debes confirmar tu correo electrónico antes de iniciar sesión.');
        } else if (authError.message.toLowerCase().includes('rate limit')) {
          setError('Demasiados intentos. Espera unos minutos e inténtalo de nuevo.');
        } else {
          setError(authError.message || 'No se pudo iniciar sesión. Inténtalo de nuevo.');
        }
        setLoading(false);
        return;
      }

      const user = data?.user;
      if (!user) {
        setError('No se pudo obtener la información del usuario.');
        setLoading(false);
        return;
      }

      startTransition(async () => {
        try {
          const destination = await resolvePostLoginDestination();
          router.replace(destination);
        } catch (err) {
          console.error('Login redirect error:', err);
          router.replace('/');
        }
      });
    } catch (err) {
      console.error('Login error:', err);
      setError('Ocurrió un error inesperado. Inténtalo de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 selection:bg-amber-300 selection:text-slate-900">
      <div className="w-full max-w-md space-y-6">

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-lg px-2 py-1"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver al inicio
        </Link>

        <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm w-full max-w-md space-y-8">

          {/* Logo / Marca */}
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400 shadow-md">
              <svg className="h-8 w-8 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">LISTAMARILLA</h1>
            <p className="text-slate-500 text-sm">Inicia sesión en tu cuenta</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>

            {/* Mensaje de error */}
            {error ? (
              <div
                role="alert"
                aria-live="polite"
                className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700 animate-fade-in-up"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-red-600" aria-hidden="true" />
                <span className="leading-relaxed">{error}</span>
              </div>
            ) : null}

            {/* Campo Email — JSX directo */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="tucorreo@ejemplo.com"
                required
                autoComplete="email"
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            {/* Campo Contraseña — JSX directo */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                Contraseña
              </label>
              <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 py-3 pl-4 pr-11 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                disabled={loading}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-60"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
            >
              {loading ? (
                <>
                  <span
                    className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-900 border-t-transparent"
                    aria-hidden="true"
                  />
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                'Iniciar sesión'
              )}
            </button>

          </form>

          {/* Link de registro */}
          <p className="text-center text-sm text-slate-500">
            ¿No tienes cuenta?{' '}
            <Link href="/solicitar" className="font-semibold text-amber-600 hover:underline">
              Solicita acceso
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}