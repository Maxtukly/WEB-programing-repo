import { program } from "commander";
import fs from "fs";
import defchar from './RPGPlayer_example.json' with { type: 'json' };

program
.name('lab3p')
.version('0.0.1')
.option('-f, --file <string>', 'шлях до JSON файлу')

program.command('getPilotName') 
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

program.command('descItem')
.description('повертає повну інформацію про предмет інвентарю')
.requiredOption('-n, --name <string>', 'назва предмету, обов\'язковий аргумент', null)
.option('-i, --insensitive', 'ігнорує регістр під час пошуку предмету')
.action((options) => {
    if(options.name == null){
        console.log('ПОМИЛКА: назва цільового предмету не вказана');
        return;
    }
    let target_name = options.name;
    if(options.insensitive){
        target_name = target_name.toLowerCase();
    }
    let char = getCharacter();
    const inv = char.inventory;
    if(inv == null){
        console.log('ПОМИЛКА: інвентар персонажа відсутній');
        return;
    }
    const inv_length = inv.length;
    let found = false;
    for(let i = 0; i < inv_length; i++){
        let item = inv[i];
        let item_name = item.item_name;
        if(options.insensitive){
            item_name = item_name.toLowerCase();
        }
        if(item_name == target_name){
            found = true;
            console.log(item.item_name);
            checkAndLog(item.item_description, 'ПОПЕРЕДЖЕННЯ: опис предмету відсутній');
            console.log('Кількість використань:');
            if(item.is_limited){
            checkAndLog(item.uses, 'ПОПЕРЕДЖЕННЯ: кількість використань не вказана');
            }
            else{
                console.log('Необмежено');
            }
        }
    }
    if(!found){
        console.log('ПОПЕРЕДЖЕННЯ: предмету з таким ім\'ям не знайдено');
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