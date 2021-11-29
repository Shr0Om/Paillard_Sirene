var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


function main(id: number, count: number) {
    let cline = 1;
    MongoClient.connect(url, function (err, client) {
        if (err) throw err;
        console.log(`./../Parsed_dir/Pdir-${count*id}`)
        var dbo = client.db("Paillard_Sirene").collection("sirene");
        var bulk = dbo.initializeUnorderedBulkOp();

        var lineReader = require('readline').createInterface({
            input: require('fs').createReadStream(`./../Parsed_dir/Pdir-${count*id}`)
        });
        lineReader.on('line', function (line: string,) {
            if (cline > 1 && cline < 54000) {
                const words = line.split(',');
                bulk.insert({
                    siren: words[0],
                    nic: words[1],
                    siret: words[2],
                    dateCreationEtablissement: words[3],
                    dateDernierTraitementEtablissement: words[4],
                    typeVoieEtablissement: words[5],
                    libelleVoieEtablissement: words[6],
                    codePostalEtablissement: words[7],
                    libelleCommuneEtablissement: words[8],
                    codeCommuneEtablissement: words[9],
                    dateDebut: words[10],
                    etatAdministratifEtablissement: words[11],
                });
            }
            cline = cline + 1;
        });
        lineReader.on('close', async function () {
            await bulk.execute();
            client.close()
            if (count < id * 50){
                console.log("next")
                main(id, count + 1)
            }
        });
    });
}

if (require.main === module) {
    main(1, 1);
}