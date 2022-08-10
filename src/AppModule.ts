import { Module } from '@nestjs/common';
import { IPaymentService } from './Interfaces';
import CLI from './Models/CLI';
import User from './Models/User';
import PaymentService from './Services/PaymentService';


@Module({
  imports:[User,CLI],
  providers:[ {
    useClass: PaymentService,
    provide: 'IPaymentService'
  }]

})
export class AppModule {}