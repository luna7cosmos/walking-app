import Image from 'next/image';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { DiaryEntry } from '@/app/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Route, Timer, Footprints } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type DiaryCardProps = {
  entry: DiaryEntry;
  index: number;
};

export default function DiaryCard({ entry, index }: DiaryCardProps) {
  const hasStats = entry.stats && (entry.stats.distance != null || entry.stats.time != null || entry.stats.steps != null);

  return (
    <Card 
      className="overflow-hidden transition-transform transform hover:scale-[1.02] hover:shadow-xl duration-300 ease-in-out opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardHeader className="p-0">
        <div className="relative aspect-video w-full">
          <Image
            src={entry.photoUrl}
            alt={entry.location.description}
            fill
            className="object-cover"
            data-ai-hint={entry.imageHint}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="font-headline text-xl mb-2">{format(entry.date, 'yyyy년 M월 d일', { locale: ko })}</CardTitle>
        <CardDescription className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
          <MapPin className="w-4 h-4" />
          {entry.location.description}
        </CardDescription>
        <p className="text-sm text-foreground/80 line-clamp-3">{entry.text}</p>
        
        {hasStats && (
          <>
            <Separator className="my-4" />
            <div className="flex flex-wrap justify-start gap-x-6 gap-y-2 items-center text-xs text-muted-foreground">
              {entry.stats?.distance != null && (
                <div className="flex items-center gap-1.5" title="거리">
                  <Route className="w-4 h-4" />
                  <span>{entry.stats.distance.toLocaleString()}m</span>
                </div>
              )}
              {entry.stats?.time != null && (
                <div className="flex items-center gap-1.5" title="시간">
                  <Timer className="w-4 h-4" />
                  <span>{entry.stats.time}분</span>
                </div>
              )}
              {entry.stats?.steps != null && (
                <div className="flex items-center gap-1.5" title="걸음 수">
                  <Footprints className="w-4 h-4" />
                  <span>{entry.stats.steps.toLocaleString()}</span>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
