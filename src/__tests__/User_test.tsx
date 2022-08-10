import { IPaymentService, IUser } from '../Interfaces'
import User from '../Models/User'

let paymentResult = true;
const paymentServiceMock: IPaymentService = {
    pay: (amount: number): Promise<boolean> => {
        return new Promise<boolean>((resolve, reject) => {
            resolve(paymentResult);
        });
    },
    registerUser: (user: IUser) => { },
    setUpPaymentReceiver: (port: number) => { },
    setUpPaymentTransmitter: (port: number) => { }
}

describe('User', () => {

    const user = new User(paymentServiceMock);

    describe('getBalance', () => {
        it("must be able to increase or decrease balance based on paying or receiving money", async () => {
            paymentResult = true;

            await user.pay(20);
            user.receivePayment(10);

            expect(user.getBalance()).toEqual(-10);
        })
    });

    describe('pay', () => {
        it("should always send a valid amount", async () => {
            let throwedErr = false;
            try {
                await user.pay(-20);
            } catch (e) { throwedErr = true }

            expect(throwedErr).toEqual(true);
        })
    });

    describe('getting paid', () => {
        it("should always receive a valid amount", async () => {
            let throwedErr = false;
            try {
                await user.receivePayment(-20);
            } catch (e) { throwedErr = true }

            expect(throwedErr).toEqual(true);
        })
    });

    describe('unsuccessful payment', () => {
        it("should not decrease balance upon a failed payment", async () => {
            paymentResult = false;
            let originalBalance = user.getBalance();

            await user.pay(50);

            let afterFailedPaymentBalance = user.getBalance();
            expect(originalBalance).toEqual(afterFailedPaymentBalance);
        })
    });

    describe('successful payment', () => {
        it("should decrease balance upon a successful payment", async () => {
            paymentResult = true;
            let originalBalance = user.getBalance();

            await user.pay(50);

            let afterPaymentBalance = user.getBalance();
            expect(afterPaymentBalance).toBeLessThan(originalBalance);
        })
    });
})