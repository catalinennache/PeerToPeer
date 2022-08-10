import { IUser } from "../Interfaces";
import PaymentService from "../Services/PaymentService";


const userMock:IUser = {
    receivePayment:(amount:number)=>{},
    pay:(amount:number):Promise<boolean>=>{ return new Promise((r,_)=>{r(false)})},
    getBalance:()=>{return 5}
}
const paymentService = new PaymentService();
paymentService.registerUser(userMock);


let fetchErrCode = -1;
let fetchMessage = "";
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ errCode: fetchErrCode, message: fetchMessage}),
  }),
) as jest.Mock;



describe('PaymentService', () => {

    it('should have a communication way for sending payments',()=>{
      //TBT
      const one = 1;
      expect(one).toBe(1)
    })

})