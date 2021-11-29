const os = require('os');
const cpuCount = os.cpus().length
var fs = require('fs');
var dir = './../Working_dir';
var Pdir = './../Parsed_dir';
let file = "./../file/StockEtablissement_utf8.csv";
const bytesToRead = 10000000;
let start = 0;
let id = 0;
import pm2 from 'pm2';


function CreateWorkingDir() {
    if (!fs.existsSync(dir)) {
        console.log("---Workding Dir Doesnt exist");
        console.log("---Creating");
        try {
            (fs.mkdirSync(dir))
            console.log("--- Done");
        } catch {
            console.error(`---Error while creating ${dir}.`);
        }
    } else {
        try {
            fs.rmSync(dir, { recursive: true });
            console.log(`---${dir} is deleted!`);
        } catch (err) {
            console.error(`---Error while deleting ${dir}.`);
        }
        try {
            (fs.mkdirSync(dir))
            console.log("--- Done");
        } catch {
            console.error(`Error while creating ${dir}.`);
        }
    }
}

function CreateParsedDir() {
    if (!fs.existsSync(Pdir)) {
        console.log("---Parsed Dir Doesnt exist");
        console.log("---Creating");
        try {
            (fs.mkdirSync(Pdir))
            console.log("--- Done");
        } catch {
            console.error(`---Error while creating ${Pdir}.`);
        }
    } else {
        try {
            fs.rmSync(Pdir, { recursive: true });
            console.log(`---${Pdir} is deleted!`);
        } catch (err) {
            console.error(`---Error while deleting ${Pdir}.`);
        }
        try {
            (fs.mkdirSync(Pdir))
            console.log("--- Done");
        } catch {
            console.error(`Error while creating ${Pdir}.`);
        }
    }
}


function CreateSubWorkingFiles() {
    for (let thread = 1; thread <= cpuCount; thread++) {
        CreateSubWorkingFile(thread);
    }
}



function CreateSubWorkingFile(id: number) {
    let location = `./../Working_dir/process_thread_${id}`

    if (!fs.existsSync(location)) {
        console.log("--- Workding file Doesnt exist");
        console.log("--- Creating");
        try {
            fs.closeSync(fs.openSync(location, 'w'))
            console.log("--- Done");
        } catch {
            console.error(`---Error while creating process_thread_${id}.`);
        }
    } else {
        try {
            fs.rm(location);
            console.log(`process_thread_${id} is deleted!`);
        } catch (err) {
            console.error(`--- Error while deleting process_thread_${id}`);
        }
        try {
            fs.closeSync(fs.openSync(location, 'w'))
            console.log("--- Done");
        } catch {
            console.error(`--- Error while deleting process_thread_${id}`);
        }
    }
}


function ParsingFile() {
    console.log(`Open file`)
    let start = 0
    let id = 0


    fs.open(file, 'r', function (errOpen: any, fd: any) {
        console.log(`Done`);
        console.log('Parsingc...')
        while (true) {
            let location = `${Pdir}/Pdir-${id}`
            const buffer = Buffer.alloc(bytesToRead)
            const bytesRead = fs.readSync(fd, buffer, 0, bytesToRead, start);
            if (bytesRead < bytesToRead) {
                console.log("out")
                return
            }
            fs.closeSync(fs.openSync(location, 'w'))
            fs.writeFile(location, buffer.toString('utf8'), function (err: any) { })
            start = start + bytesToRead
            id++;
        }
    });
}

function initiateWorker(workerName: String) {
    for (let i = 1; i < cpuCount-1; i++) {
        pm2.connect((err) => {
            if (err) {
                console.error(err)
                process.exit(2)
            }
            pm2.start({
                script: 'ts-node ./worker.ts',
                name: `${workerName}${i}`,
                args: `${i}`
            }, (err, apps) => {
                console.log(apps);
                console.log(err)
            });
        });
    }
}

function main() {
    console.log(`Starting`)
    console.log(`CPU INFO`)
    console.log(`---Cpu Model ${os.model}`)
    console.log(`---Cpu Freq ${os.speed} MHz`)
    console.log(`---Cpu Available ${cpuCount}`)

    console.log("Creating Working Directory");
    CreateWorkingDir();
    console.log("Creating SubDirectory");
    CreateSubWorkingFiles();
    console.log("Creating Parsed Directory");
    CreateParsedDir();
    console.log("Parse File");
    ParsingFile();
    initiateWorker("worker");
}

if (require.main === module) {
    main();
}