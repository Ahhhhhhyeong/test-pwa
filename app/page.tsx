'use client';

import { useEffect, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export default function Home() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installable, setInstallable] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    // beforeinstallprompt 이벤트 캐치
    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setInstallable(true);
    };

    // 온라인/오프라인 상태 체크
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    console.log('Install outcome:', choice.outcome);
    // 다시 인스톨 버튼이 뜨지 않게
    setDeferredPrompt(null);
    setInstallable(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        padding: '2rem',
        background: isOnline ? '#f0f4f8' : '#1f1f1f',
        color: isOnline ? '#1e293b' : '#f8fafc',
        transition: 'background 0.3s, color 0.3s',
      }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>PWA 데모 페이지</h1>
      <p>
        네트워크 상태: <strong>{isOnline ? 'Online' : 'Offline'}</strong>
      </p>

      {installable ? (
        <button
          onClick={handleInstallClick}
          style={{
            marginTop: '2rem',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            background: '#1e40af',
            color: '#fff',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
          }}>
          앱 설치하기
        </button>
      ) : (
        <p style={{ marginTop: '2rem' }}>설치 가능 이벤트 대기 중… (또는 이미 설치됨)</p>
      )}

      <small style={{ marginTop: '3rem', opacity: 0.6 }}>휴대폰에서 직접 설치해보세요.</small>
    </div>
  );
}
