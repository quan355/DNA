const express = require('express')
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const path = require('path');
const port = process.env.PORT || 5000;
//kidetmon2k3_db_user
//TbvsjFQskCMiipmp
app.use(express.json());
app.use(cors(
  {
    origin: 'http://localhost:5173', // Chỉ cho phép frontend Vite
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true // Cho phép gửi cookie/localStorage
  }
));
async function main() {
  await mongoose.connect('mongodb+srv://kidetmon2k3_db_user:RH00R0zWByjRsMj7@DNA-web.5bmdctu.mongodb.net/DNA-web?retryWrites=true&w=majority&appName=DNA-web');
}
// Phục vụ file tĩnh từ thư mục public
app.use(express.static(path.join(__dirname, 'public')));
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/fav-icon.png'), {
    headers: { 'Content-Type': 'image/png' }
  });
});
app.get('/', (req, res) => {
  res.send('DNA Sever is running!')
})
main().then(()=>console.log("Mongodb Connected Succesfully")).catch(err => console.log(err));
//routes
const ItemRoutes = require("./src/routes/itemRoute");
const CategoryRoutes = require("./src/routes/categoryRoute");
const LoginRoutes  = require("./src/routes/loginRoute");
const RegisterRoutes = require("./src/routes/registerRoute");
app.use('/api', CategoryRoutes);            
app.use('/api', ItemRoutes);
app.use('/api', LoginRoutes);
app.use('/api', RegisterRoutes);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})