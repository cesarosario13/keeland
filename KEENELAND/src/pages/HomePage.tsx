import { StatsCard } from '../components/StatsCard';
import { GameCard } from '../components/GameCard';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { HeroCarousel } from '../components/HeroCarousel';
import { 
  Users, 
  Trophy, 
  TrendingUp,
  Clock,
  ChevronRight,
  Gamepad2,
  Zap
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const popularGames = [
    {
      title: 'Dice Roller',
      image: 'https://images.unsplash.com/photo-1719405731197-74fad3e7a7ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWNlJTIwZ2FtYmxpbmclMjBnYW1lfGVufDF8fHx8MTc1OTcwNzkwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Dados',
      rating: 4.8,
      isHot: true
    },
    {
      title: 'Blackjack Clásico',
      image: 'https://images.unsplash.com/photo-1688873157896-432c9a44eaae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXNpbm8lMjBnYW1pbmclMjBuZW9uJTIwbGlnaHRzfGVufDF8fHx8MTc1OTcwNzg5OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Cartas',
      rating: 4.6,
      isNew: true
    },
    {
      title: 'Ruleta Europea',
      image: 'https://images.unsplash.com/photo-1688873157896-432c9a44eaae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXNpbm8lMjBnYW1pbmclMjBuZW9uJTIwbGlnaHRzfGVufDF8fHx8MTc1OTcwNzg5OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Ruleta',
      rating: 4.9
    },
    {
      title: 'Slots Deluxe',
      image: 'https://images.unsplash.com/photo-1688873157896-432c9a44eaae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXNpbm8lMjBnYW1pbmclMjBuZW9uJTIwbGlnaHRzfGVufDF8fHx8MTc1OTcwNzg5OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Slots',
      rating: 4.7,
      isHot: true
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-white mb-4">
            ¡Bienvenido a UVMBet!
          </h1>
          <p className="text-white/90 max-w-2xl mb-6">
            La plataforma de apuestas más confiable de la Universidad Valle del Momboy. 
            Disfruta de juegos justos, pagos rápidos y la mejor experiencia de gaming.
          </p>
          <div className="flex gap-4">
            <Button 
              onClick={() => onNavigate('casino')}
              className="bg-white text-slate-900 hover:bg-gray-100"
            >
              <Gamepad2 className="mr-2 h-4 w-4" />
              Comenzar a Jugar
            </Button>
            <Button 
              onClick={() => onNavigate('promotions')}
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
            >
              Ver Promociones
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 translate-x-24"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Jugadores Activos"
          value="2,847"
          change="+12%"
          isPositive={true}
          icon={<Users className="h-8 w-8" />}
        />
        <StatsCard
          title="Jackpot Actual"
          value="$45,230"
          change="+$2,100"
          isPositive={true}
          icon={<Trophy className="h-8 w-8" />}
        />
        <StatsCard
          title="Apuestas Hoy"
          value="8,921"
          change="+5.7%"
          isPositive={true}
          icon={<TrendingUp className="h-8 w-8" />}
        />
        <StatsCard
          title="Tiempo Promedio"
          value="24min"
          change="-3min"
          isPositive={true}
          icon={<Clock className="h-8 w-8" />}
        />
      </div>

      {/* Popular Games */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white">Juegos Populares</h2>
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('casino')}
            className="text-green-500 hover:text-green-400 hover:bg-slate-800"
          >
            Ver Todos
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularGames.map((game, index) => (
            <GameCard key={index} {...game} />
          ))}
        </div>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card 
          className="bg-gradient-to-br from-green-600 to-green-700 border-green-500 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => onNavigate('casino')}
        >
          <CardContent className="p-8 text-center">
            <Gamepad2 className="h-16 w-16 text-white mx-auto mb-4" />
            <h3 className="text-white text-xl mb-2">Casino</h3>
            <p className="text-white/90 text-sm">
              Dados, Blackjack, Ruleta y más
            </p>
          </CardContent>
        </Card>

        <Card 
          className="bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => onNavigate('sports')}
        >
          <CardContent className="p-8 text-center">
            <Zap className="h-16 w-16 text-white mx-auto mb-4" />
            <h3 className="text-white text-xl mb-2">Deportes</h3>
            <p className="text-white/90 text-sm">
              Apuesta en tus equipos favoritos
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}