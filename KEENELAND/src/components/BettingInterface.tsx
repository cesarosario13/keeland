import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, RefreshCw } from 'lucide-react';

export function BettingInterface() {
  const [betAmount, setBetAmount] = useState('10.00');
  const [multiplier, setMultiplier] = useState(2.0);
  const [winChance, setWinChance] = useState(49.5);
  const [isRolling, setIsRolling] = useState(false);
  const [lastRoll, setLastRoll] = useState<number | null>(null);

  const quickAmounts = ['10', '25', '50', '100', '250'];

  const handleRoll = () => {
    setIsRolling(true);
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 100) + 1;
      setLastRoll(roll);
      setIsRolling(false);
    }, 2000);
  };

  const getDiceIcon = (value: number) => {
    const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
    const IconComponent = icons[Math.floor(value / 16.67)] || Dice1;
    return <IconComponent className="h-8 w-8" />;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Betting Panel */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            {getDiceIcon(lastRoll || 50)}
            Dice Game
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bet Amount */}
          <div>
            <label className="text-gray-300 text-sm mb-2 block">Cantidad de Apuesta</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
              <Input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white pl-8"
                step="0.01"
              />
            </div>
            <div className="flex gap-2 mt-2">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-gray-300 hover:bg-slate-700"
                  onClick={() => setBetAmount(amount)}
                >
                  ${amount}
                </Button>
              ))}
            </div>
          </div>

          {/* Win Chance */}
          <div>
            <label className="text-gray-300 text-sm mb-2 block">Probabilidad de Ganar</label>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                value={winChance}
                onChange={(e) => setWinChance(parseFloat(e.target.value) || 0)}
                className="bg-slate-700 border-slate-600 text-white"
                step="0.1"
                min="0.1"
                max="95"
              />
              <span className="text-gray-400">%</span>
            </div>
          </div>

          {/* Multiplier */}
          <div>
            <label className="text-gray-300 text-sm mb-2 block">Multiplicador</label>
            <div className="bg-slate-700 border border-slate-600 rounded-lg p-3">
              <div className="text-white text-lg">{multiplier.toFixed(2)}x</div>
              <div className="text-gray-400 text-sm">
                Ganancia potencial: ${(parseFloat(betAmount) * multiplier).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Roll Button */}
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
            onClick={handleRoll}
            disabled={isRolling}
          >
            {isRolling ? (
              <>
                <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                Rodando...
              </>
            ) : (
              'Rodar Dados'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Game Results */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Resultados Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="recent" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-700">
              <TabsTrigger value="recent" className="text-gray-300">Recientes</TabsTrigger>
              <TabsTrigger value="stats" className="text-gray-300">Estadísticas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="recent" className="space-y-3 mt-4">
              {lastRoll && (
                <div className="bg-slate-700 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getDiceIcon(lastRoll)}
                      <div>
                        <p className="text-white">Resultado: {lastRoll}</p>
                        <p className="text-gray-400 text-sm">
                          {lastRoll <= winChance ? 'GANASTE!' : 'Perdiste'}
                        </p>
                      </div>
                    </div>
                    <Badge variant={lastRoll <= winChance ? "default" : "destructive"}>
                      {lastRoll <= winChance ? '+$' + (parseFloat(betAmount) * multiplier).toFixed(2) : '-$' + betAmount}
                    </Badge>
                  </div>
                </div>
              )}
              
              {/* Simulated previous results */}
              {[73, 28, 91, 15, 67].map((roll, index) => (
                <div key={index} className="bg-slate-700 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getDiceIcon(roll)}
                      <div>
                        <p className="text-white">Resultado: {roll}</p>
                        <p className="text-gray-400 text-sm">
                          {roll <= 49.5 ? 'Ganaste' : 'Perdiste'}
                        </p>
                      </div>
                    </div>
                    <Badge variant={roll <= 49.5 ? "default" : "destructive"}>
                      {roll <= 49.5 ? '+$20.00' : '-$10.00'}
                    </Badge>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="stats" className="mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700 rounded-lg p-3 text-center">
                    <p className="text-gray-400 text-sm">Total Apostado</p>
                    <p className="text-white text-xl">$1,450</p>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-3 text-center">
                    <p className="text-gray-400 text-sm">Ganancia Total</p>
                    <p className="text-green-500 text-xl">+$324</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700 rounded-lg p-3 text-center">
                    <p className="text-gray-400 text-sm">Apuestas Ganadas</p>
                    <p className="text-white text-xl">67%</p>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-3 text-center">
                    <p className="text-gray-400 text-sm">Racha Actual</p>
                    <p className="text-white text-xl">3 wins</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}