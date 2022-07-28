const mongoose = require('mongoose');

// connect to mongoDB using mongoose
mongoose
  .connect('mongodb://127.0.0.1:27017/cobaMongo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('success connected to Mongodb'))
  .catch(() => console.log('fail to connected!'));
