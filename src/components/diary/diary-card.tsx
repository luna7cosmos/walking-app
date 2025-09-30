import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { DiaryEntry } from '@/app/lib/types';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

type DiaryCardProps = {
  entry: DiaryEntry;
  index: number;
};

export default function DiaryCard({ entry, index }: DiaryCardProps) {

  return (
    <Card 
      className="overflow-hidden transition-transform transform hover:scale-[1.02] hover:shadow-xl duration-300 ease-in-out opacity-0 animate-fade-in-up flex flex-col h-full justify-center items-center"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardHeader>
        <CardTitle className="font-headline text-xl mb-2">{format(entry.date, 'yyyy년 M월 d일', { locale: ko })}</CardTitle>
      </CardHeader>
    </Card>
  );
}
