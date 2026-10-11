import { program } from "commander";
import fs from "fs";
import defchar from './RPGPlayer_example.json' with { type: 'json' };

program
.name('lab3p')
.version('0.0.1')
.option('-f, --file <string>', 'шлях до JSON файлу')

program.command('identifyPilot')
.description('повертає ім\'я персонажа')
.option('-c, --callsign', 'додатково повертає позивний після імені')
.action((options) => {
    let char = getCharacter();
    checkAndLog(char.name, 'ПОПЕРЕДЖЕННЯ: у записі пілота відсутнє ім\'я');
    if (options.callsign){
        checkAndLog(char.callsign, 'ПОПЕРЕДЖЕННЯ: у записі пілота відсутний позивний');      
    }})



program.parse()

function getCharacter(){
    let char = defchar;
    const {file} = program.opts();
    if(file){
        char = JSON.parse(fs.readFileSync(file, 'utf-8'));
    }
    else{
        console.log('ПОПЕРЕДЖЕННЯ: цільовий файл не вказано, використано файл за замовчуванням');
    }
    return char;
}

function checkAndLog(value, warning){
    if(value){
        console.log(value);
    }
    else{
        console.log(warning);
    }
}