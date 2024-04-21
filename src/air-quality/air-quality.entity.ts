import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AirQualityRecordDocument = AirQualityRecord & Document;

export interface ILocation {
  type: string;
  coordinates: number[];
}

export interface IAirQualityRecord {
  _id?: string;
  ts: Date;
  maincn: string;
  mainus: string;
  aqius: number;
  aqicn: number;
  location: ILocation;
}

@Schema({ timestamps: true })
export class AirQualityRecord {
  @Prop({ required: true })
  ts: Date;

  @Prop({ required: true })
  maincn: string;

  @Prop({ required: true })
  mainus: string;

  @Prop({ required: true })
  aqius: number;

  @Prop({ required: true })
  aqicn: number;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  city: string;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
    },
  })
  location: {
    type: 'Point';
    coordinates: number[];
  };
}

const AirQualityRecordSchema = SchemaFactory.createForClass(AirQualityRecord);

// Adding indexes using the index method
AirQualityRecordSchema.index({ ts: 1 });
AirQualityRecordSchema.index({ aqius: 1 });
AirQualityRecordSchema.index({ location: '2dsphere' });
// Create a compound unique index on ts and location
AirQualityRecordSchema.index({ ts: 1, city: 1 }, { unique: true });

export { AirQualityRecordSchema };
