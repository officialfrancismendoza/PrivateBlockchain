/* Programmer: Francis Mendoza
 * Purpose: levelDB helper methods
*/
/* ============= Persist data with LevelDB =============
|  Learn more: level - https://github.com/Level/level  |
===================================================== */

const levelSandbox = require('level');
const chainDB = './chaindata';
const db = levelSandbox(chainDB);

// Add data to levelDB with key/value pair
async function addLevelDBData(key, value) {
    return new Promise(function (resolve, reject) {
        db.put(key, value, function (err) {
            if (err) {
                console.log('Block # ' + key + ' Submission failed', err);
                reject(err);
            }
            else {
                resolve('Added Block # ' + key + ', value: ' + value);
            }
        });
    });
}
//--------------------------------------------------------------------
// Get data from levelDB with key
async function getLevelDBData(key) {
    return new Promise(function (resolve, reject) {
        db.get(key, function (err, value) {

            //(!!!)nA: PASSED
            if (value) {
                //If for promise contingency- resolve 
                console.log('Value = ' + value);
                resolve(value);
            }

            else //nA: else if
            {
                //Else for promise contingency- reject 
                console.log('Not found!', err);
                reject(err);
            }
        });
    });
}
//--------------------------------------------------------------------
// Add data to levelDB with value
async function addDataToLevelDB(value) {
    let blockNum = 0;
    db.createReadStream().on('data', function (data) {
        blockNum++;
    }).on('error', function (err) {
        return console.log('Unable to read data stream!', err)
    }).on('close', function () {
        console.log('Block #' + blockNum);
        addLevelDBData(blockNum, value);
    });
}
//--------------------------------------------------------------------
// Get the height of blockchain
async function getHeight() {
    let blockHeight = -1;
    return new Promise(function (resolve, reject) {
        db.createReadStream().on('data', function (data) {
            blockHeight++;
        }).on('error', function (err) {
            console.log('Error: ' + err);
            reject(err);
        }).on('close', function () {
            resolve(blockHeight);
        });
    });
}

module.exports.addLevelDBData = addLevelDBData;
module.exports.getLevelDBData = getLevelDBData;
module.exports.addDataToLevelDB = addDataToLevelDB;
module.exports.getHeight = getHeight;