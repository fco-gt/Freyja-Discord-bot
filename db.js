const mongoose = require('mongoose');

mongoose.connect(process.env.MONGOOSE_URL, { 
    useUnifiedTopology: true,
    useNewUrlParser: true 
})
.then(db => console.log('Conectado a Mongoose'))
.catch(err => console.error(err))