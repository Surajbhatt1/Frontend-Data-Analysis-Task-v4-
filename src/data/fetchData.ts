// src/data/fetchData.ts
export interface CropData {
    year: number;
    crop: string;
    production: number;
    yield: number;
    area: number;
  }
  
  const datasetUrl = 'https://gist.githubusercontent.com/username/gist_id/raw/agriculture_data.json';
  
  export async function fetchData(): Promise<CropData[]> {
    const response = await fetch(datasetUrl);
    const data = await response.json();
    return data.map((item: any) => ({
      year: item.year,
      crop: item.crop,
      production: item.production ?? 0,
      yield: item.yield ?? 0,
      area: item.area ?? 0,
    }));
  }
  