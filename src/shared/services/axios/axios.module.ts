import { Module, Global } from '@nestjs/common';
import axios from 'axios';

@Global()
@Module({
  providers: [
    {
      provide: 'AXIOS_INSTANCE',
      useValue: axios.create({
        timeout: 5000, // Timeout in milliseconds
      }),
    },
  ],
  exports: ['AXIOS_INSTANCE'],
})
export class AxiosModule {}
