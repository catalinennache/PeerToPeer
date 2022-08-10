
import minimist from 'minimist';
import * as readline from 'readline';
import { isAsyncFunction } from 'util/types';
import { ICommandLine } from '../Interfaces';

 


export default class CLI implements ICommandLine{

    private IO = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    private consoleBusy:boolean = false;
    private commandRegistry: any = {};

    private async readConsole(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.IO.question(">", (response) => {
                resolve(response);
            });
        })
    }

    async start(): Promise<void> {
        let response = "";
        while (1) {
            this.consoleBusy = true;
            response = await this.readConsole();
            this.consoleBusy = false;
            await this.proccessConsoleResponse(response);

        }
    }

    private async proccessConsoleResponse(response: string) {
        if (response == "") return;
        let args = minimist(response.split(" "));

        let callbacks = (this.commandRegistry[args._[0]] as Array<Function>);
        if (callbacks) {

            for(let cidx in callbacks){
                let callback = callbacks[cidx];
                try {
                    if(isAsyncFunction(callback)){
                        await callback(args);
                    }else if(typeof callback === 'function'){
                        callback(args);
                    }
                   
                } catch (e) { console.warn(e); }
            }
        }else{
            this.writeln(`${args._[0]} is not recognized as a command`);
        }
    }

    on(command: string, callback: Function) {
        if (!this.commandRegistry[command]) this.commandRegistry[command] = [];
        this.commandRegistry[command].push(callback);
    }

    writeln(data:string){
        if(this.consoleBusy) this.IO.write("\n"); // this will make the prompt pause a bit so we can write text to console without it considering to be a command
        this.IO.write(data+"\n");
    }





}