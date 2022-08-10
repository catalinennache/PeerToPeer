
export interface IPaymentService{
    pay: (amount:number) => Promise<boolean>
    registerUser: (user:IUser)=>void
    setUpPaymentReceiver: (port:number)=>void
    setUpPaymentTransmitter:(port:number)=>void
}

export interface IUser{
    receivePayment:(amount:number)=>void;
    pay:(amount:number)=>Promise<boolean>
    getBalance:()=>number
}


export interface ICommandLine{
    start:()=>Promise<void>;
    on:(command:string, callback:Function)=>void;
    writeln:(data:string)=>void;
}

export interface PaymentReceivingRequest{
    amount:number
}

export interface PaymentSendingResponse{
    errCode:number,
    message:string
}


