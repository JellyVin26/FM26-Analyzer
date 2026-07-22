const express = require('express'); const app = express(); app.get('/err', async (req, res) => { throw new Error('Boom'); }); app.listen(5174, () => console.log('Ready'));
