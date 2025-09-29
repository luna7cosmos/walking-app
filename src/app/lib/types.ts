export interface DiaryEntry {
  id: string;
  photoUrl: string;
  imageHint: string;
  date: Date;
  location: {
    description: string;
  };
  text: string;
  stats?: {
    distance?: number;
    time?: number;
    steps?: number;
  };
}
