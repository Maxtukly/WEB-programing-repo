import { program } from "commander";
import char from './RPGPlayer_example.json' with { type: 'json' };

console.log(char.callsign);


program
.option('--show')

program.parse()

