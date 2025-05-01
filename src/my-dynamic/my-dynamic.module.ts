/* eslint-disable @typescript-eslint/no-unsafe-return */
import { DynamicModule, Module } from '@nestjs/common';

export type MyDynamicModuleConfigs = {
  apiKey: string;
  apiUrl: string;
};

export const MY_DYNAMIC_CONFIG = 'MY_DYNAMIC_CONFIG';

@Module({})
export class MyDynamicModule {
  static register(configs: any): DynamicModule {
    console.log('MyModuleConfigs', configs);
    //Aqui eu vou usar as minhas configs

    return {
      module: MyDynamicModule,
      imports: [],
      providers: [
        {
          provide: MY_DYNAMIC_CONFIG,
          useFactory: async () => {
            console.log('MyDynamicMOdule: Aqui posso ter logica');
            await new Promise(res => setTimeout(res, 3000));
            console.log('MyDynamicMOdule: TERMINOU A LOGICA');
            return configs;
          },
        },
      ],
      controllers: [],
      exports: [MY_DYNAMIC_CONFIG],
    };
  }
}
