import pm2 from 'pm2';
const os = require('os');
const cpuCount = os.cpus().length

export function initiateWorker(workerName: String) {
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
