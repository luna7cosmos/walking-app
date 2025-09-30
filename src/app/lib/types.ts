export interface DiaryEntry {
  id?: string;
  date: Date;
  location: {
    description: string;
  };
  text: string;
  stats?: {
    distance?: number;
    time?: number; // duration in minutes
    steps?: number;
    startTime?: string; // HH:mm format
    endTime?: string; // HH:mm format
  };
}
