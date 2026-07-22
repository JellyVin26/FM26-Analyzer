const {exec} = require('child_process'); require('express')().listen(5173, () => { exec('start "" "http://localhost:5173"'); console.log('Listening'); });
