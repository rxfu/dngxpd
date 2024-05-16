const {ipcMain} = require('electron');
const path = require('node:path');
const sqlite3 = require('sqlite3').verbose();

export function handleDatabaseApi() {
    ipcMain.handle('getRecords', (event, params) => {
        return new Promise((resolve, reject) => {
            let db = new sqlite3.Database(params.dbfile);
            let query = 'SELECT * FROM records WHERE 1 = 1';

            if (params.zone?.length) {
                let zones = params.zone.join("','");

                query = `${query} AND zone IN('${zones}')`;
            }

            if (params.type?.length) {
                let type = params.type.join("','");

                query = `${query} AND type IN ('${type}')`;
            }

            if (params.keyword?.length) {
                query = `${query} AND keyword LIKE '%${params.keyword}%'`;
            }

            db.all(query, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    });

    ipcMain.handle('getZones', (event, params) => {
        return new Promise((resolve, reject) => {
            let db = new sqlite3.Database(params.dbfile);
            let query = 'SELECT DISTINCT zone FROM records ORDER BY id';

            db.all(query, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    });

    ipcMain.handle('getTypes', (event, params) => {
        return new Promise((resolve, reject) => {
            let db = new sqlite3.Database(params.dbfile);
            let query = 'SELECT DISTINCT type FROM records ORDER BY id';

            db.all(query, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    });

    ipcMain.handle('getOverall', (event, params) => {
        return new Promise((resolve, reject) => {
            let db = new sqlite3.Database(params.dbfile);
            let query = `SELECT zone, 
                SUM(CASE WHEN type = '单字' THEN amount ELSE 0 END) as dz, 
                SUM(CASE WHEN type = '词汇' THEN amount ELSE 0 END) as ch, 
                SUM(CASE WHEN type = '语法' THEN amount ELSE 0 END) as yf, 
                SUM(CASE WHEN type = '口头文化' THEN amount ELSE 0 END) as ktwh 
                FROM (SELECT zone, type, ord_zone, ord_type, COUNT(*) AS amount FROM records GROUP BY zone, type) 
                GROUP BY zone
                ORDER BY ord_zone, ord_type`;

            db.all(query, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    });
}