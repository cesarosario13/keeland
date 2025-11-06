import { DiceGame } from '../components/games/DiceGame';
import { BlackjackGame } from '../components/games/BlackjackGame';
import { RouletteGame } from '../components/games/RouletteGame';
import { SlotsGame } from '../components/games/SlotsGame';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dice6, Spade, CircleDot, Cherry } from 'lucide-react';

export function CasinoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white mb-2">Casino</h1>
        <p className="text-gray-400">Disfruta de nuestros juegos de casino más populares</p>
      </div>

      <Tabs defaultValue="dice" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800 border border-slate-700">
          <TabsTrigger 
            value="dice" 
            className="text-gray-300 data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            <Dice6 className="mr-2 h-4 w-4" />
            Dados
          </TabsTrigger>
          <TabsTrigger 
            value="blackjack" 
            className="text-gray-300 data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            <Spade className="mr-2 h-4 w-4" />
            Blackjack
          </TabsTrigger>
          <TabsTrigger 
            value="roulette" 
            className="text-gray-300 data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            <CircleDot className="mr-2 h-4 w-4" />
            Ruleta
          </TabsTrigger>
          <TabsTrigger 
            value="slots" 
            className="text-gray-300 data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            <Cherry className="mr-2 h-4 w-4" />
            Slots
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dice" className="mt-6">
          <DiceGame />
        </TabsContent>

        <TabsContent value="blackjack" className="mt-6">
          <BlackjackGame />
        </TabsContent>

        <TabsContent value="roulette" className="mt-6">
          <RouletteGame />
        </TabsContent>

        <TabsContent value="slots" className="mt-6">
          <SlotsGame />
        </TabsContent>
      </Tabs>
    </div>
  );
}