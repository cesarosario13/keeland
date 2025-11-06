import { Card, CardContent } from './ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
}

export function StatsCard({ title, value, change, isPositive, icon }: StatsCardProps) {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">{title}</p>
            <p className="text-white text-2xl font-bold">{value}</p>
            {change && (
              <div className="flex items-center gap-1 mt-2">
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {change}
                </span>
              </div>
            )}
          </div>
          {icon && (
            <div className="text-green-500 opacity-75">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}