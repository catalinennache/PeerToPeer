import minimist from "minimist";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./AppModule";
import CLI from "./Models/CLI";
import User from "./Models/User";

let args = minimist(process.argv.slice(2));
const port = parseInt(args.port);
const peerPort = parseInt(args.peerPort);
if(!port || isNaN(port) || !peerPort || isNaN(peerPort))
    throw Error("Incorrect arguments! Example: node startup.js --port 8000 --peerPort 8001");

async function main() {
    try {
        const applicationContext = await NestFactory.createApplicationContext(
            AppModule,
            { logger: false },
        );

        const paymentService = applicationContext.get('IPaymentService');
        paymentService.setUpPaymentReceiver(port);
        paymentService.setUpPaymentTransmitter(peerPort);

        const user = applicationContext.get(User);
        const cli = applicationContext.get(CLI);
        
        user.subscribe((amountReceived)=>{
            cli.writeln(`You were paid ${amountReceived}!`);
        });

        cli.on("pay", async (commandArgs: minimist.ParsedArgs) => {
            let amount = parseInt(commandArgs._[1]);
            if(!commandArgs._[1] || isNaN(amount)) {
                cli.writeln("Incorrect argument for 'pay' command! Example: 'pay 20'");
                return;
            }
            let result = await user.pay(amount);
            cli.writeln(`Payment ${result ? "successful" : "unsuccessful"}`);
        });

        cli.on("balance", async (_: any) => {
            let balance = user.getBalance();
            cli.writeln(`Your balance is ${balance}`);
        });

        cli.on('exit', (_: any) => {
            cli.writeln("Bye!");
            process.exit(0);
        });


        cli.start();
    }
    catch (e) { console.warn(e) }
}


main();

