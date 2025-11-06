import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Play, Star } from 'lucide-react';

interface GameCardProps {
  title: string;
  image: string;
  category: string;
  rating?: number;
  isNew?: boolean;
  isHot?: boolean;
}

export function GameCard({ title, image, category, rating, isNew, isHot }: GameCardProps) {
  return (
    <Card className="bg-slate-800 border-slate-700 overflow-hidden group hover:border-green-500 transition-all duration-300 hover:scale-105">
      <CardContent className="p-0">
        <div className="relative">
          <img 
            src={image} 
            alt={title}
            className="w-full h-48 object-cover"
          />
          
          {/* Overlay with play button */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button className="bg-green-600 hover:bg-green-700 rounded-full p-3">
              <Play className="h-6 w-6 fill-white" />
            </Button>
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-2">
            {isNew && (
              <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                NUEVO
              </span>
            )}
            {isHot && (
              <span className="bg-red-600 text-white px-2 py-1 rounded text-xs animate-pulse">
                HOT
              </span>
            )}
          </div>

          {/* Rating */}
          {rating && (
            <div className="absolute top-2 right-2 bg-black/70 rounded px-2 py-1 flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-white text-xs">{rating}</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-white mb-1">{title}</h3>
              <p className="text-gray-400 text-sm">{category}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}