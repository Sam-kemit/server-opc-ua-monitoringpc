const os = require("os");
const fs = require('fs');

const { execFile } = require('child_process');
const { exec } = require('child_process');
let arrayListSoftware = new Array();
let tab = [];
let tab2 = [];
let varTabUserN, varUserN;
let str, strType = "";
let valueIdUser;


const child = execFile('wmic',['computersystem', 'get', 'username', '/format:CSV'], (error, stdout, stderr) => {
    if (error) {
        throw error;
    }
    arrayListSoftware = stdout.split("\n"); 
    arrayListSoftware.splice(0, 2);  
    console.log(arrayListSoftware);
    arrayListSoftware.pop(); 
    console.log(arrayListSoftware);

    for(let i in arrayListSoftware){        
        tab.push(arrayListSoftware[i].split(","));        
    } 
    varTabUserN = tab[0][1];
    str = varTabUserN.split("\\");
    strType = str.toString();
    console.log(typeof strType);
    console.log(varUserN);

    let SearchIdUser = strType.split("\r");
    SearchIdUser.splice(1,2);
    console.log(SearchIdUser);
    let SearchIdUserType = SearchIdUser.toString();
    let FoundIdUser = SearchIdUserType.split(",");
    valueIdUser = FoundIdUser.splice(1);
    console.log(valueIdUser);


    fs.stat('C:\\Users\\'+valueIdUser+'\\AppData\\Local\\Programs\\openssl', function(err) {
        if (!err) {
            console.log('file or directory exists');
        }
        else if (err.code === 'ENOENT') {
            exec('mkdir C:\\Users\\'+valueIdUser+'\\AppData\\Local\\Programs\\openssl', (error, stdout, stderr) => {
                if (error) {
                    throw error;
                }
                console.log("Folder create with success ...");
            });
        }
    });

    exec('xcopy .\\openssl\\* /s /i /c /y C:\\Users\\'+valueIdUser+'\\AppData\\Local\\Programs\\openssl', (error, stdout, stderr) => {
        if (error) {
            throw error;
        }
        console.log("Successfully");
    });
});

