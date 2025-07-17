export type Song = {
  title: string;
};

export type Vinyl = {
  id: string;
  artist: string;
  year?: string | null;
  imageUri?: string | null;
  sideA: Song;
  sideB: Song;
  isInJukebox: boolean;
};

export type Jukebox = {
  vinyls: Vinyl[];
  maxVinyls: number;
};