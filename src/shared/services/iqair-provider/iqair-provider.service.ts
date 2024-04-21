import { Injectable, Inject, HttpStatus, HttpException } from '@nestjs/common';
import { AxiosInstance, AxiosResponse } from 'axios';
import { AirQualityQueryDto } from 'src/air-quality/air-quality.dto';
import { CustomLogger } from 'src/shared/custom-logger/custom-logger.service';
import { IiqirProviderService } from './iqair-provider-service.interface';

@Injectable()
export class IQAirProviderService implements IiqirProviderService {
  constructor(
    @Inject('AXIOS_INSTANCE') private readonly _axiosInstance: AxiosInstance,
  ) {}

  async getAirQualityDataFromIQAirProvider(
    airQualityQueryDto: AirQualityQueryDto,
  ): Promise<AxiosResponse> {
    const apiUrl = process.env.AIR_QUALITY_URL;
    const apiKey = process.env.AIR_QUALITY_API_KEY;
    const logger = new CustomLogger(
      IQAirProviderService.name,
      this.getAirQualityDataFromIQAirProvider.name,
    );
    try {
      const res: AxiosResponse = await this._axiosInstance.get(
        `${apiUrl}?lat=${airQualityQueryDto.lat}&lon=${airQualityQueryDto.lon}&key=${apiKey}`,
      );
      logger.log('success');
      return res;
    } catch (error) {
      if (error instanceof HttpException) {
        // forward HttpException
        throw error;
      } else {
        logger.error(error);
        throw new HttpException(
          'internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
