import { Injectable } from '@nestjs/common';
import { createServer, IncomingMessage, Server, ServerResponse } from 'http';

import { IPaymentService, IUser, PaymentReceivingRequest, PaymentSendingResponse } from '../Interfaces';
import fetch from 'node-fetch';

@Injectable()
export default class PaymentService implements IPaymentService {

    private user?: IUser;
    private receiver?: Server;
    private peerPort?:number;

    private getUser() {
        if (!this.user) throw new Error("No user attached to service!");
        return this.user;
    }

    setUpPaymentTransmitter(port:number){
        this.peerPort = port;
    }

    setUpPaymentReceiver(port: number) {
        if (!port) throw Error("No port provided for payment receiver!");

        this.receiver = createServer(async (req: IncomingMessage, res: ServerResponse) => {
            const buffer = [];
            for await (const chunk of req) {
                buffer.push(chunk);
            }
            const err = this.receivePayment(buffer);
            if (!err) {
                res.setHeader("Content-Type", "application/json");
                res.writeHead(200);
                res.end(JSON.stringify({ errCode: -1, message: "" }));
            } else {
                res.writeHead(400);
                res.end(JSON.stringify(err));
            }

        });

        this.receiver.listen(port);
    }

    private receivePayment(dataBuffer: any[]) {
        if (!dataBuffer || dataBuffer.length === 0) return { errCode: 0, message: "Empty request!" };
        try {
            let rawData = Buffer.concat(dataBuffer).toString();
            let data = (JSON.parse(rawData) as PaymentReceivingRequest);

            if ((typeof data.amount) !== 'number')
                return { errCode: 1, message: "Amount field missing or not a number!" };

            this.getUser().receivePayment(data.amount);
        } catch (e) {
            console.log(e);
            return { errCode: 2, message: "Malformed payload!" };
        }

    }

    registerUser(user: IUser) {
        this.user = user;
    };


    async pay(amount: number): Promise<boolean> {
        if(!this.peerPort) throw new Error("Transmitter not configured!");
        if(!amount || amount <= 0) throw new Error("Invalid amount to pay!");
        
        try {
            const response = await fetch(`http://localhost:${this.peerPort}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount })
            });

            const data = (await response.json() as PaymentSendingResponse);
            return data.errCode == -1;
        } catch (e) {
            return false;
        }
    }

}