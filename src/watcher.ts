import { giveMeSomeJob } from "./dispatcher";


var fs = require('fs');
var dir = './../Working_dir';
var watcher = fs.watch(dir);



function startWartcher(){
    watcher.on('change', function name(event, filename) {
        if (event == 'change'){
            console.log(`Work finished, new work for ${filename}`);
            giveMeSomeJob(filename)
        }
    })
}




if (require.main === module) {
    startWartcher();
}


