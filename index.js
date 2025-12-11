#!/usr/bin/env node

const { program } = require("commander");
const fs = require("fs");

const DB_PATH = "./data.json";

function readDB()
{
    var fileContent = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(fileContent);
}
function writeDB(data)
{
    var jsonString = JSON.stringify(data, null, 2);
    fs.writeFileSync(DB_PATH, jsonString);
}

program
    .command("add")
    .requiredOption("--description <description>")
    .requiredOption("--amount <amount>")
    .action((option)=>{
        const db = readDB();
        let id;
        if(db.length===0)
        {
            id=1;
        }
        else{
            id=db[db.length - 1].id+1;
        }
        let date = new Date();
        let year = date.getFullYear();
        let month = String(date.getMonth() + 1).padStart(2, "0"); 
        let day = String(date.getDate()).padStart(2, "0");
        let dateFinal = `${year}-${month}-${day}`;
        const amount = Number(option.amount);
        const description = option.description;
        newExpense = {
            id,
            date: dateFinal,
            description,
            amount
        };
        db.push(newExpense);
        writeDB(db);
        console.log("Expense added successfully ID: " + newExpense.id);
    });

program
    .command("list")
    .action(
        ()=>{
            const db = readDB();
            if(db.length===0)
            {
                console.log("No entries found");
                return;
            }
            else{
                db.forEach(element => {
                    let id = element.id;
                    let date = element.date;
                    let description = element.description;
                    let amount = element.amount;
                    console.log(`${id} | ${date} | ${description} | ${amount}`);});
            }
        }
    );


program
    .command("delete")
    .requiredOption("--id <id>")
    .action(
        (option)=>{
            const db = readDB();
            let idDelete = Number(option.id);
            const index = db.findIndex(expense => expense.id === idDelete);
            if(index === -1)
            {
                console.log(`Expense at not found at id: ${idDelete}`);
                return;
            }
            else{
                db.splice(index, 1);
                writeDB(db);
                console.log(`Successfully deleted ID: ${idDelete}`);
            }
        }
    );

program
    .command("summary")
    .option("--month <month>")
    .action(
        (option)=>{
            const db = readDB();
            if(db.length===0)
            {
                console.log("No entries found");
                return;
            }
            else{
                let total=0;
                if(!(option.month===undefined))
                {
                    let filterMonth = String(option.month).padStart(2,"0");
                    db.forEach( expense =>
                        {
                            let expenseMonth = expense.date.split("-")[1]; // "MM"
                            if(expenseMonth===filterMonth)
                            {
                                total+=expense.amount;
                            }
                        }
                    );
                    console.log(`Total expenses for ${option.month}: $${total}`);
                }
                else{
                    db.forEach(
                        expense =>{
                            total += expense.amount;
                        }
                    );
                    console.log(`Total expenses: $${total}`);
                }
            }
        }
    );
program.parse(process.argv);