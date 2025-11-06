import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Gift, Star, Trophy, Zap, Users, Calendar } from 'lucide-react';

export function PromotionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white mb-2">Promociones</h1>
        <p className="text-gray-400">Aprovecha nuestras mejores ofertas y bonificaciones</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Welcome Bonus */}
        <Card className="bg-gradient-to-br from-green-600 to-green-700 border-green-500">
          <CardContent className="p-6">
            <Gift className="h-12 w-12 text-white mb-4" />
            <h3 className="text-white text-xl mb-2">Bono de Bienvenida</h3>
            <p className="text-white/90 mb-4">
              Recibe 100% de tu primer depósito hasta $500
            </p>
            <div className="bg-white/20 rounded-lg p-3 mb-4">
              <p className="text-white text-sm">Código: <span className="font-bold">WELCOME100</span></p>
            </div>
            <Button className="w-full bg-white text-green-700 hover:bg-gray-100">
              Reclamar Ahora
            </Button>
          </CardContent>
        </Card>

        {/* Cashback */}
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500">
          <CardContent className="p-6">
            <Star className="h-12 w-12 text-white mb-4" />
            <h3 className="text-white text-xl mb-2">Cashback Semanal</h3>
            <p className="text-white/90 mb-4">
              Recupera hasta 15% de tus pérdidas cada semana
            </p>
            <div className="bg-white/20 rounded-lg p-3 mb-4">
              <p className="text-white text-sm">Válido hasta: <span className="font-bold">Domingo</span></p>
            </div>
            <Button className="w-full bg-white text-blue-700 hover:bg-gray-100">
              Ver Detalles
            </Button>
          </CardContent>
        </Card>

        {/* Monthly Tournament */}
        <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-purple-500">
          <CardContent className="p-6">
            <Trophy className="h-12 w-12 text-white mb-4" />
            <h3 className="text-white text-xl mb-2">Torneo Mensual</h3>
            <p className="text-white/90 mb-4">
              Compite por $10,000 en premios
            </p>
            <div className="bg-white/20 rounded-lg p-3 mb-4">
              <p className="text-white text-sm">Posición actual: <span className="font-bold">#45</span></p>
            </div>
            <Button className="w-full bg-white text-purple-700 hover:bg-gray-100">
              Participar
            </Button>
          </CardContent>
        </Card>

        {/* Free Spins */}
        <Card className="bg-gradient-to-br from-orange-600 to-orange-700 border-orange-500">
          <CardContent className="p-6">
            <Zap className="h-12 w-12 text-white mb-4" />
            <h3 className="text-white text-xl mb-2">Giros Gratis</h3>
            <p className="text-white/90 mb-4">
              50 giros gratis en slots seleccionados
            </p>
            <div className="bg-white/20 rounded-lg p-3 mb-4">
              <p className="text-white text-sm">Disponibles: <span className="font-bold">50 giros</span></p>
            </div>
            <Button className="w-full bg-white text-orange-700 hover:bg-gray-100">
              Usar Giros
            </Button>
          </CardContent>
        </Card>

        {/* Refer a Friend */}
        <Card className="bg-gradient-to-br from-pink-600 to-pink-700 border-pink-500">
          <CardContent className="p-6">
            <Users className="h-12 w-12 text-white mb-4" />
            <h3 className="text-white text-xl mb-2">Refiere un Amigo</h3>
            <p className="text-white/90 mb-4">
              Gana $50 por cada amigo que se registre
            </p>
            <div className="bg-white/20 rounded-lg p-3 mb-4">
              <p className="text-white text-sm">Tu código: <span className="font-bold">UV-M3T45</span></p>
            </div>
            <Button className="w-full bg-white text-pink-700 hover:bg-gray-100">
              Compartir
            </Button>
          </CardContent>
        </Card>

        {/* VIP Program */}
        <Card className="bg-gradient-to-br from-yellow-600 to-yellow-700 border-yellow-500">
          <CardContent className="p-6">
            <Calendar className="h-12 w-12 text-white mb-4" />
            <h3 className="text-white text-xl mb-2">Programa VIP</h3>
            <p className="text-white/90 mb-4">
              Beneficios exclusivos y recompensas especiales
            </p>
            <div className="bg-white/20 rounded-lg p-3 mb-4">
              <p className="text-white text-sm">Nivel: <span className="font-bold">Bronce</span></p>
            </div>
            <Button className="w-full bg-white text-yellow-700 hover:bg-gray-100">
              Ver Niveles
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Terms and Conditions */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <h3 className="text-white mb-3">Términos y Condiciones</h3>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>• Las promociones están sujetas a términos y condiciones específicos</li>
            <li>• El bono de bienvenida requiere un depósito mínimo de $20</li>
            <li>• El cashback se calcula sobre pérdidas netas semanales</li>
            <li>• Los requisitos de apuesta varían según la promoción</li>
            <li>• UVMBet se reserva el derecho de modificar o cancelar promociones</li>
            <li>• Solo mayores de 18 años. Juega responsablemente</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}