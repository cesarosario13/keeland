import { useState } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from './ui/dropdown-menu';
import { 
  Menu, 
  X, 
  User, 
  Wallet, 
  Settings, 
  LogOut,
  ChevronDown,
  TrendingUp,
  Plus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import keenelandLogo from 'figma:asset/38b16652800465a4aeaae6f19d9666d997868bc6.png';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, balance } = useAuth();

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => onNavigate('home')}
          >
            <img 
              src={keenelandLogo} 
              alt="Keeneland Logo" 
              className="h-12 w-12 object-contain"
            />
            <div>
              <h1 className="text-foreground font-bold text-xl">Keeneland</h1>
              <p className="text-primary text-xs">Apuestas Personalizadas</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => onNavigate('home')}
              className={`transition-colors ${
                currentPage === 'home' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Inicio
            </button>
            <button 
              onClick={() => onNavigate('customBets')}
              className={`transition-colors flex items-center gap-1 ${
                currentPage === 'customBets' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              Apuestas Personalizadas
            </button>
            <button 
              onClick={() => onNavigate('casino')}
              className={`transition-colors ${
                currentPage === 'casino' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Casino
            </button>
            <button 
              onClick={() => onNavigate('sports')}
              className={`transition-colors ${
                currentPage === 'sports' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Deportes
            </button>
            <button 
              onClick={() => onNavigate('promotions')}
              className={`transition-colors ${
                currentPage === 'promotions' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Promociones
            </button>
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            {!user ? (
              <div className="hidden md:flex gap-2">
                <Button 
                  variant="outline" 
                  className="border-border text-foreground hover:bg-secondary"
                  onClick={() => onNavigate('login')}
                >
                  Iniciar Sesión
                </Button>
                <Button 
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => onNavigate('register')}
                >
                  Registrarse
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => onNavigate('recharge')}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Recargar
                </Button>
                <div className="px-4 py-2 bg-secondary rounded-lg text-right">
                  <p className="text-foreground font-semibold">${balance.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">Balance</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 text-foreground hover:bg-secondary">
                      <Avatar className="h-8 w-8 border-2 border-primary">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user?.user_metadata?.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-card border-border min-w-[200px]">
                    <DropdownMenuItem 
                      className="text-foreground hover:bg-secondary focus:bg-secondary cursor-pointer"
                      onClick={() => onNavigate('profile')}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Mi Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-foreground hover:bg-secondary focus:bg-secondary cursor-pointer"
                      onClick={() => onNavigate('recharge')}
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      Recargar Balance
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-foreground hover:bg-secondary focus:bg-secondary cursor-pointer"
                      onClick={() => onNavigate('customBets')}
                    >
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Mis Apuestas
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem 
                      className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10 cursor-pointer"
                      onClick={logout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <nav className="px-4 py-4 space-y-3">
            <button 
              onClick={() => { onNavigate('home'); setIsMenuOpen(false); }}
              className="block text-foreground hover:text-primary w-full text-left py-2"
            >
              Inicio
            </button>
            <button 
              onClick={() => { onNavigate('customBets'); setIsMenuOpen(false); }}
              className="block text-foreground hover:text-primary w-full text-left py-2"
            >
              Apuestas Personalizadas
            </button>
            <button 
              onClick={() => { onNavigate('casino'); setIsMenuOpen(false); }}
              className="block text-foreground hover:text-primary w-full text-left py-2"
            >
              Casino
            </button>
            <button 
              onClick={() => { onNavigate('sports'); setIsMenuOpen(false); }}
              className="block text-foreground hover:text-primary w-full text-left py-2"
            >
              Deportes
            </button>
            <button 
              onClick={() => { onNavigate('promotions'); setIsMenuOpen(false); }}
              className="block text-foreground hover:text-primary w-full text-left py-2"
            >
              Promociones
            </button>
            
            {!user ? (
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Button 
                  variant="outline" 
                  className="border-border"
                  onClick={() => { onNavigate('login'); setIsMenuOpen(false); }}
                >
                  Iniciar Sesión
                </Button>
                <Button 
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => { onNavigate('register'); setIsMenuOpen(false); }}
                >
                  Registrarse
                </Button>
              </div>
            ) : (
              <div className="pt-4 border-t border-border space-y-2">
                <p className="text-foreground font-semibold">Balance: ${balance.toFixed(2)}</p>
                <button
                  onClick={() => { onNavigate('profile'); setIsMenuOpen(false); }}
                  className="block text-foreground hover:text-primary w-full text-left py-2"
                >
                  Mi Perfil
                </button>
                <button
                  onClick={() => { onNavigate('recharge'); setIsMenuOpen(false); }}
                  className="block text-foreground hover:text-primary w-full text-left py-2"
                >
                  Recargar Balance
                </button>
                <Button 
                  variant="ghost" 
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 p-0 mt-2"
                  onClick={() => { logout(); setIsMenuOpen(false); }}
                >
                  Cerrar Sesión
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}