import { ILocation } from './air-quality.entity';

export interface IAirQuality {
  ts: Date;
  aqius: number;
  mainus: string;
  aqicn: number;
  maincn: string;
  city: string;
  country: string;
  state: string;
  location?: ILocation;
}

export interface IPollution {
  ts: Date;
  aqius: number;
  mainus: string;
  aqicn: number;
  maincn: string;
}
export interface IAirQualityResponse {
  result: { pollution: IPollution };
}
