import { program } from "commander";
import char from './RPGPlayer_example.json' with { type: 'json' };

program
.name('lab3p')
.version('0.0.1')

program.command('identeficate')
.option('-c, --callsign', "returns callsign after name")
.action((options) => {
    let output = char.name;
    if (options.callsign){
        output += '\n' + char.callsign;
    }
    console.log(output)

})

program.parse()

