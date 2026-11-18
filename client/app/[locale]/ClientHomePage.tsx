'use client';

import { ErrorScreen } from '@/components/error/ErrorScreen';
import LandingPage from '@/components/home';
import { apiFetch } from '@/services/apiClient';
import { useEffect, useState } from 'react';

export default function ClientHomePage({ locale }: { locale: string }) {
  const [data, setData] = useState<any>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/consultations')
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err: any) => {
        setErrorStatus(err.statusCode ?? 500);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p style={{ textAlign: 'center', color: '#fff' }}>Cargando...</p>;
  }

  if (errorStatus === 500) {
    return <ErrorScreen message="Error interno del servidor" />;
  }

  if (errorStatus === 400) {
    return <ErrorScreen message="Solicitud inválida, revisa tus datos" />;
  }

  if (errorStatus === 404) {
    return <ErrorScreen message="Esta página no se pudo encontrar" />;
  }

  return <LandingPage />;
}

