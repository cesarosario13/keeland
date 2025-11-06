import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { HomePage } from './pages/HomePage';
import { CasinoPage } from './pages/CasinoPage';
import { SportsPage } from './pages/SportsPage';
import { LivePage } from './pages/LivePage';
import { PromotionsPage } from './pages/PromotionsPage';
import ProfilePage from './pages/ProfilePage';
import RechargePage from './pages/RechargePage';
import CustomBetsPage from './pages/CustomBetsPage';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>(user ? 'home' : 'login');
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-xl">Cargando...</div>
      </div>
    );
  }

  // Show auth pages if not logged in
  if (!user && (currentPage === 'login' || currentPage === 'register')) {
    if (authView === 'login' || currentPage === 'login') {
      return <LoginPage onSwitchToRegister={() => { setAuthView('register'); setCurrentPage('register'); }} />;
    } else {
      return <RegisterPage onSwitchToLogin={() => { setAuthView('login'); setCurrentPage('login'); }} />;
    }
  }

  // Redirect to home if logged in and trying to access auth pages
  if (user && (currentPage === 'login' || currentPage === 'register')) {
    setCurrentPage('home');
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={handleNavigate} currentPage={currentPage} />
      
      <main>
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'casino' && <CasinoPage />}
        {currentPage === 'sports' && <SportsPage />}
        {currentPage === 'live' && <LivePage />}
        {currentPage === 'promotions' && <PromotionsPage />}
        {currentPage === 'profile' && <ProfilePage />}
        {currentPage === 'recharge' && <RechargePage />}
        {currentPage === 'customBets' && <CustomBetsPage />}

        {/* Footer Section */}
        {['home', 'casino', 'sports', 'live', 'promotions', 'customBets'].includes(currentPage) && (
          <div className="container mx-auto px-4">
            <div className="mt-16 pt-8 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div>
                  <h4 className="text-foreground mb-4">Keeneland</h4>
                  <p className="text-muted-foreground text-sm">
                    La plataforma de apuestas personalizadas más innovadora. 
                    Crea tus propias competencias y compite con amigos.
                  </p>
                </div>
                <div>
                  <h4 className="text-foreground mb-4">Servicios</h4>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>
                      <button onClick={() => handleNavigate('customBets')} className="hover:text-primary">
                        Apuestas Personalizadas
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleNavigate('casino')} className="hover:text-primary">
                        Casino
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleNavigate('sports')} className="hover:text-primary">
                        Deportes
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleNavigate('promotions')} className="hover:text-primary">
                        Promociones
                      </button>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-foreground mb-4">Soporte</h4>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li><a href="#" className="hover:text-primary">Centro de Ayuda</a></li>
                    <li><a href="#" className="hover:text-primary">Chat en Vivo</a></li>
                    <li><a href="#" className="hover:text-primary">Contacto</a></li>
                    <li><a href="#" className="hover:text-primary">Términos</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-foreground mb-4">Legal</h4>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li><a href="#" className="hover:text-primary">Sobre Nosotros</a></li>
                    <li><a href="#" className="hover:text-primary">Responsabilidad</a></li>
                    <li><a href="#" className="hover:text-primary">Licencias</a></li>
                    <li><a href="#" className="hover:text-primary">Privacidad</a></li>
                  </ul>
                </div>
              </div>
              <div className="text-center pt-8 border-t border-border">
                <p className="text-muted-foreground text-sm">
                  © 2025 Keeneland. Todos los derechos reservados.
                </p>
                <p className="text-muted-foreground text-xs mt-2">
                  Juega responsablemente. Solo para mayores de 18 años.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}