export interface DbData {
  AITags: string | null;
  fileId: string;
  filePath: string;
  fileType: string;
  height: number;
  name: string;
  size: number;
  thumbnailUrl: string;
  url: string;
  width: number;
}

export interface IImage {
  isLoading: boolean;
  error: string;
  dbData: DbData | null;
  file: File | null;
}
