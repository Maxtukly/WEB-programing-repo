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

program.command('getInventory')
.description('повертає список наявних речей персонажа')
.option('-a, --amount <int>', 'кількість предметів, що повернуться', null)
.option('-l, --limited', 'повертає лише предмети з обмеженою кількістю використань')
.action((options) => {
    let char = getCharacter();
    
    if(char.inventory != null){
        let used_inv = [];
        if(options.limited){
            for(let i = 0; i < char.inventory.length; i++){
                if(char.inventory[i].is_limited){
                used_inv.push(char.inventory[i])
                }
            }
        }
        else{
            used_inv = char.inventory;
        }
        const inv_length = used_inv.length;
        if(inv_length < 1){
            console.log('Предмети відсутні');
            return;
        }
        let amount;
        if(options.amount != null){  
            amount = options.amount;
            if(amount <= 0){
            console.log('ПОМИЛКА: некоректне значення кількості(від\'ємне або 0)');
            return;
            }
            if(amount > inv_length){
                console.log('ПОПЕРЕДЖЕННЯ: вказана кількість перевищує максимальну');
                amount = inv_length;
            }
        }
        else{
            amount = inv_length;
        }
        for(let i = 0; i < amount; i++){
        checkAndLog(used_inv[i].item_name, 'ПОПЕРЕДЖЕННЯ: назва предмету не вказана');
        }
    }
    else{
        console.log('ПОМИЛКА: інвентар відсутній');
    }
})



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