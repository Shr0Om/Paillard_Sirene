var fs = require('fs');
let file = "./../file/StockEtablissementHistorique_utf8.csv";
let start = 0;
const bytesToRead = 1000000;

export function giveMeSomeJob(who: any) {
    console.log("starting with" + start )
    const locat = `./../Working_dir/${who}`
    fs.open(file, 'r', function (errOpen: any, fd: any) {
        fs.read(fd, Buffer.alloc(bytesToRead), 0, bytesToRead, start, function (errRead: any, bytesRead: any, buffer: { toString: (arg0: string) => any; }) {
            //console.log(buffer.toString('utf8'));
            fs.writeFile(locat, buffer.toString('utf8'), function (err: any) {
                if (err) return console.log(err);
            });
            start = start + bytesToRead
        });
    });
}

