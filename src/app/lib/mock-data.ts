import type { DiaryEntry } from './types';

export const initialDiaryEntries: DiaryEntry[] = [
  {
    id: '1',
    date: new Date('2024-05-20T10:30:00'),
    location: {
      description: '서울숲 공원',
    },
    text: '오랜만에 서울숲으로 산책을 나갔다. 날씨가 정말 좋아서 기분도 상쾌해졌다. 푸른 나무들 사이를 걸으니 마음이 평화로워지는 느낌이었다.',
    stats: { distance: 3500, time: 60, steps: 4500, startTime: '10:30', endTime: '11:30' },
  },
  {
    id: '2',
    date: new Date('2024-05-18T15:00:00'),
    location: {
      description: '부산 시민공원',
    },
    text: '공원에서 우연히 예쁜 꽃을 발견했다. 작지만 강렬한 색깔이 인상적이었다. 잠시 멈춰서서 꽃을 감상하는 여유를 가질 수 있어 행복했다.',
  },
  {
    id: '3',
    date: new Date('2024-05-15T19:00:00'),
    location: {
      description: '대학로 거리',
    },
    text: '저녁에 대학로 거리를 걸었다. 활기찬 분위기와 젊음의 에너지가 느껴졌다. 가로등 불빛 아래에서 많은 생각을 정리할 수 있는 시간이었다.',
    stats: { distance: 2100, time: 40, steps: 2800, startTime: '19:00', endTime: '19:40' },
  },
  {
    id: '4',
    date: new Date('2024-05-12T08:00:00'),
    location: {
      description: '선유도 공원',
    },
    text: '아침 일찍 선유도 공원에 올랐다. 한강 위로 떠오르는 해를 보며 하루를 시작하니 감회가 새로웠다. 상쾌한 공기를 마시며 좋은 에너지를 얻었다.',
  },
];
