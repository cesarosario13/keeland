import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Zap, Radio, Video } from 'lucide-react';

export function LivePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white mb-2">En Vivo</h1>
        <p className="text-gray-400">Transmisiones en vivo y eventos deportivos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-red-600 to-red-700 border-red-500">
          <CardContent className="p-8 text-center">
            <Video className="h-16 w-16 text-white mx-auto mb-4" />
            <h3 className="text-white text-xl mb-2">Transmisiones</h3>
            <p className="text-white/90 text-sm mb-4">
              Ver partidos en vivo mientras apuestas
            </p>
            <Button className="bg-white text-red-700 hover:bg-gray-100">
              Próximamente
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600 to-green-700 border-green-500">
          <CardContent className="p-8 text-center">
            <Radio className="h-16 w-16 text-white mx-auto mb-4" />
            <h3 className="text-white text-xl mb-2">Casino en Vivo</h3>
            <p className="text-white/90 text-sm mb-4">
              Juega con dealers reales en tiempo real
            </p>
            <Button className="bg-white text-green-700 hover:bg-gray-100">
              Próximamente
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500">
          <CardContent className="p-8 text-center">
            <Zap className="h-16 w-16 text-white mx-auto mb-4" />
            <h3 className="text-white text-xl mb-2">Estadísticas en Vivo</h3>
            <p className="text-white/90 text-sm mb-4">
              Análisis en tiempo real de eventos deportivos
            </p>
            <Button className="bg-white text-blue-700 hover:bg-gray-100">
              Próximamente
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-12 text-center">
          <Zap className="h-24 w-24 text-green-500 mx-auto mb-6" />
          <h2 className="text-white text-2xl mb-4">¡Próximamente!</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-6">
            Estamos trabajando en traerte las mejores transmisiones en vivo, 
            casino con dealers reales y estadísticas en tiempo real. 
            Regístrate ahora para ser el primero en acceder cuando lancemos estas características.
          </p>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Notificarme al Lanzamiento
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}