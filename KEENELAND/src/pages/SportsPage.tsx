import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Trophy, Users, TrendingUp } from 'lucide-react';

interface Match {
  id: number;
  teams: string;
  odds: string;
  time: string;
  league: string;
  status: 'live' | 'upcoming';
}

const matches: Match[] = [
  { id: 1, teams: 'Real Madrid vs Barcelona', odds: '2.1 / 3.2 / 2.8', time: '78:32', league: 'La Liga', status: 'live' },
  { id: 2, teams: 'Liverpool vs Manchester City', odds: '1.8 / 3.5 / 3.1', time: '65:18', league: 'Premier League', status: 'live' },
  { id: 3, teams: 'PSG vs Bayern Munich', odds: '2.3 / 2.9 / 2.7', time: '45:00', league: 'Champions League', status: 'live' },
  { id: 4, teams: 'Juventus vs AC Milan', odds: '2.0 / 3.0 / 3.5', time: 'Hoy 20:00', league: 'Serie A', status: 'upcoming' },
  { id: 5, teams: 'Chelsea vs Arsenal', odds: '2.4 / 3.1 / 2.6', time: 'Hoy 21:00', league: 'Premier League', status: 'upcoming' },
];

export function SportsPage() {
  const { user, updateBalance } = useAuth();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [betAmount, setBetAmount] = useState('10');
  const [selectedOdds, setSelectedOdds] = useState<{ type: string; value: number } | null>(null);

  const placeBet = async () => {
    if (!user || !selectedMatch || !selectedOdds) {
      toast.error('Selecciona un partido y una cuota');
      return;
    }

    const bet = parseFloat(betAmount);
    if (isNaN(bet) || bet <= 0) {
      toast.error('Ingresa una cantidad válida');
      return;
    }

    if (bet > user.balance) {
      toast.error('Saldo insuficiente');
      return;
    }

    await updateBalance(bet, 'subtract');
    toast.success(`Apuesta realizada: ${selectedMatch.teams} - ${selectedOdds.type} ($${bet})`);
    
    setSelectedMatch(null);
    setSelectedOdds(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white mb-2">Apuestas Deportivas</h1>
        <p className="text-gray-400">Las mejores cuotas en partidos en vivo y próximos</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-600 to-green-700 border-green-500">
          <CardContent className="p-6">
            <Trophy className="h-8 w-8 text-white mb-3" />
            <p className="text-white/80 text-sm">Partidos Hoy</p>
            <p className="text-white text-3xl">24</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500">
          <CardContent className="p-6">
            <Users className="h-8 w-8 text-white mb-3" />
            <p className="text-white/80 text-sm">Apostadores Activos</p>
            <p className="text-white text-3xl">1,342</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-purple-500">
          <CardContent className="p-6">
            <TrendingUp className="h-8 w-8 text-white mb-3" />
            <p className="text-white/80 text-sm">Apuestas Ganadas Hoy</p>
            <p className="text-white text-3xl">68%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Matches List */}
        <Card className="lg:col-span-2 bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Partidos Disponibles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {matches.map((match) => (
              <div key={match.id} className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge 
                        className={match.status === 'live' ? 'bg-red-600' : 'bg-blue-600'}
                      >
                        {match.status === 'live' ? 'EN VIVO' : 'PRÓXIMO'}
                      </Badge>
                      <span className="text-gray-400 text-xs">{match.league}</span>
                    </div>
                    <p className="text-white">{match.teams}</p>
                    <p className="text-gray-400 text-sm">
                      {match.status === 'live' ? `⚽ ${match.time}` : `🕐 ${match.time}`}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {match.odds.split(' / ').map((odd, idx) => {
                    const labels = ['Local', 'Empate', 'Visitante'];
                    return (
                      <Button
                        key={idx}
                        onClick={() => {
                          setSelectedMatch(match);
                          setSelectedOdds({ type: labels[idx], value: parseFloat(odd) });
                        }}
                        size="sm"
                        className={`${
                          selectedMatch?.id === match.id && selectedOdds?.type === labels[idx]
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-blue-600 hover:bg-blue-700'
                        } text-white`}
                      >
                        <div className="text-center">
                          <div className="text-xs">{labels[idx]}</div>
                          <div>{odd}</div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Bet Slip */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Boleto de Apuesta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedMatch && selectedOdds ? (
              <>
                <div className="bg-slate-700 rounded-lg p-3">
                  <p className="text-white text-sm mb-1">{selectedMatch.teams}</p>
                  <p className="text-green-500">{selectedOdds.type} - {selectedOdds.value}x</p>
                </div>

                <div>
                  <label className="text-gray-300 text-sm block mb-2">Cantidad a Apostar</label>
                  <Input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="bg-green-500/10 border border-green-500 rounded-lg p-3">
                  <p className="text-green-500 text-sm">Ganancia Potencial</p>
                  <p className="text-white text-2xl">
                    ${(parseFloat(betAmount || '0') * selectedOdds.value).toFixed(2)}
                  </p>
                </div>

                <Button 
                  onClick={placeBet}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={!user}
                >
                  Realizar Apuesta
                </Button>

                <Button 
                  onClick={() => {
                    setSelectedMatch(null);
                    setSelectedOdds(null);
                  }}
                  variant="outline"
                  className="w-full border-slate-600 text-gray-300 hover:bg-slate-700"
                >
                  Limpiar
                </Button>
              </>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>Selecciona un partido y una cuota para comenzar</p>
              </div>
            )}

            {user && (
              <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-3">
                <p className="text-blue-500 text-sm">Saldo actual</p>
                <p className="text-white text-2xl">${user.balance.toFixed(2)}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}