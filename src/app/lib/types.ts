export interface DiaryEntry {
  id: string;
  photoUrl: string;
  imageHint: string;
  date: Date;
  location: {
    lat: number;
    lng: number;
    description: string;
  };
  text: string;
  stats?: {
    distance?: number;
    time?: number;
    steps?: number;
  };
}
