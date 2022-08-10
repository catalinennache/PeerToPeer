import {  Inject, Module } from "@nestjs/common";
import { Observable } from "rxjs-observable";
import { Subscriber } from "rxjs-observable/dist/src/Subscriber";
import { IPaymentService, IUser } from "../Interfaces";
import PaymentService from "../Services/PaymentService";

@Module({
    providers:[ {
        useClass: PaymentService,
        provide: 'IPaymentService'
      }]
})
export default class User extends Observable<number> implements IUser{
    private balance:number = 0;
    private paymentNotifications = (null as unknown as Subscriber<number>);

    public constructor(@Inject('IPaymentService') private readonly paymentService: IPaymentService){
        super((obs) => { 
             this.paymentNotifications = obs;
        })
        this.paymentService.registerUser(this);
    }

    getBalance():number{
        return this.balance;
    };

 

    receivePayment(amount:number):void{
        if(!amount || amount < 0) throw Error("Bad amount to receive!");
        this.balance += amount;

        if(this.paymentNotifications)
            this.paymentNotifications.next(amount);    
    }


    async pay(amount:number):Promise<boolean>{
        if(amount <= 0) throw Error("Cannot receive a negative or zero amount!");
        
        const success = await this.paymentService.pay(amount);
        if(success)
            this.balance-=amount;

        return success; 
    }
}