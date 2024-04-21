import { Module, Global } from '@nestjs/common';

import { AxiosModule } from '../axios/axios.module';
import { IQAirProviderService } from './iqair-provider.service';

@Global()
@Module({
  imports: [AxiosModule],
  providers: [IQAirProviderService],
  exports: [IQAirProviderService],
})
export class IQAirProviderModule {}
