import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Trophy, User } from 'lucide-react';

interface Match {
  id: number;
  player1: string;
  player2: string;
  score1?: number;
  score2?: number;
  winner?: string;
  round: number;
  position: number;
}

interface TournamentBracketProps {
  participants: number;
}

export default function TournamentBracket({ participants = 8 }: TournamentBracketProps) {
  // Generar participantes mock
  const mockParticipants = Array.from({ length: participants }, (_, i) => `Jugador ${i + 1}`);
  
  // Calcular número de rondas
  const rounds = Math.ceil(Math.log2(participants));
  
  // Generar matches para cada ronda
  const generateMatches = (): Match[] => {
    const matches: Match[] = [];
    let matchId = 1;
    
    // Primera ronda
    for (let i = 0; i < participants / 2; i++) {
      matches.push({
        id: matchId++,
        player1: mockParticipants[i * 2] || 'TBD',
        player2: mockParticipants[i * 2 + 1] || 'TBD',
        score1: Math.random() > 0.5 ? Math.floor(Math.random() * 5) : undefined,
        score2: Math.random() > 0.5 ? Math.floor(Math.random() * 5) : undefined,
        round: 1,
        position: i,
      });
    }
    
    // Rondas siguientes
    for (let round = 2; round <= rounds; round++) {
      const matchesInRound = Math.pow(2, rounds - round);
      for (let i = 0; i < matchesInRound; i++) {
        const prevMatch1 = matches.find(m => m.round === round - 1 && m.position === i * 2);
        const prevMatch2 = matches.find(m => m.round === round - 1 && m.position === i * 2 + 1);
        
        const player1 = prevMatch1?.winner || (prevMatch1?.score1 !== undefined && prevMatch1?.score2 !== undefined 
          ? (prevMatch1.score1 > prevMatch1.score2 ? prevMatch1.player1 : prevMatch1.player2)
          : 'TBD');
        
        const player2 = prevMatch2?.winner || (prevMatch2?.score1 !== undefined && prevMatch2?.score2 !== undefined 
          ? (prevMatch2.score1 > prevMatch2.score2 ? prevMatch2.player1 : prevMatch2.player2)
          : 'TBD');
        
        matches.push({
          id: matchId++,
          player1,
          player2,
          score1: round < rounds && Math.random() > 0.3 ? Math.floor(Math.random() * 5) : undefined,
          score2: round < rounds && Math.random() > 0.3 ? Math.floor(Math.random() * 5) : undefined,
          round,
          position: i,
        });
      }
    }
    
    return matches;
  };

  const [matches] = useState<Match[]>(generateMatches());

  const getRoundName = (round: number) => {
    if (round === rounds) return 'Final';
    if (round === rounds - 1) return 'Semifinal';
    if (round === rounds - 2) return 'Cuartos';
    return `Ronda ${round}`;
  };

  const getMatchesForRound = (round: number) => {
    return matches.filter(m => m.round === round);
  };

  const MatchCard = ({ match }: { match: Match }) => {
    const isCompleted = match.score1 !== undefined && match.score2 !== undefined;
    const winner = isCompleted 
      ? (match.score1! > match.score2! ? match.player1 : match.player2)
      : null;

    return (
      <div className="bg-card border-2 border-border rounded-lg p-3 min-w-[200px] hover:border-primary transition-colors">
        <div className="space-y-2">
          {/* Player 1 */}
          <div className={`flex items-center justify-between p-2 rounded ${
            winner === match.player1 ? 'bg-primary/10 border border-primary' : 'bg-secondary'
          }`}>
            <div className="flex items-center gap-2 flex-1">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className={`text-sm truncate ${winner === match.player1 ? 'font-semibold text-primary' : ''}`}>
                {match.player1}
              </span>
            </div>
            {isCompleted && (
              <span className={`text-sm font-semibold ml-2 ${winner === match.player1 ? 'text-primary' : 'text-muted-foreground'}`}>
                {match.score1}
              </span>
            )}
          </div>

          {/* Player 2 */}
          <div className={`flex items-center justify-between p-2 rounded ${
            winner === match.player2 ? 'bg-primary/10 border border-primary' : 'bg-secondary'
          }`}>
            <div className="flex items-center gap-2 flex-1">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className={`text-sm truncate ${winner === match.player2 ? 'font-semibold text-primary' : ''}`}>
                {match.player2}
              </span>
            </div>
            {isCompleted && (
              <span className={`text-sm font-semibold ml-2 ${winner === match.player2 ? 'text-primary' : 'text-muted-foreground'}`}>
                {match.score2}
              </span>
            )}
          </div>
        </div>

        {!isCompleted && match.player1 !== 'TBD' && match.player2 !== 'TBD' && (
          <Badge className="w-full mt-2 bg-yellow-100 text-yellow-800 border-yellow-300 justify-center">
            Pendiente
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className="py-6">
      <div className="flex items-center justify-center gap-3 mb-8">
        <Trophy className="h-8 w-8 text-primary" />
        <h2 className="text-2xl">Bracket del Torneo</h2>
        <Badge className="bg-primary/10 text-primary border-primary/30">
          {participants} Participantes
        </Badge>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-8 min-w-max px-4">
          {Array.from({ length: rounds }, (_, roundIndex) => {
            const round = roundIndex + 1;
            const roundMatches = getMatchesForRound(round);
            
            return (
              <div key={round} className="flex flex-col justify-center">
                <div className="text-center mb-4">
                  <Badge className="bg-primary text-primary-foreground">
                    {getRoundName(round)}
                  </Badge>
                </div>
                <div 
                  className="flex flex-col gap-6"
                  style={{
                    justifyContent: 'center',
                    minHeight: `${roundMatches.length * 120}px`
                  }}
                >
                  {roundMatches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Campeón */}
      {rounds > 0 && (
        <div className="mt-8 text-center">
          <div className="inline-block">
            <div className="flex items-center gap-3 bg-primary/10 border-2 border-primary rounded-lg p-6">
              <Trophy className="h-12 w-12 text-primary" />
              <div className="text-left">
                <p className="text-sm text-muted-foreground mb-1">Campeón</p>
                <p className="text-2xl text-primary">
                  {matches.find(m => m.round === rounds)?.score1 !== undefined 
                    ? (matches.find(m => m.round === rounds)?.score1! > matches.find(m => m.round === rounds)?.score2!
                      ? matches.find(m => m.round === rounds)?.player1
                      : matches.find(m => m.round === rounds)?.player2)
                    : 'Por definir'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
