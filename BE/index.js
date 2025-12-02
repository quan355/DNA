require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const path = require('path');
const port = process.env.PORT;
//kidetmon2k3_db_user
//TbvsjFQskCMiipmp
app.use(express.json());
app.use(cors(
  {
    origin: 'http://localhost:5173', // Chỉ cho phép frontend Vite
    methods: ['GET', 'POST', 'OPTIONS','PUT','DELETE','PATCH'],
    credentials: true // Cho phép gửi cookie/localStorage
  }
));
async function main() {
  await mongoose.connect(''+process.env.MONGO_URL);
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
const CommentRoutes = require('./src/routes/commentRoute');
app.use('/api/comments', CommentRoutes);
const ItemRoutes = require("./src/routes/itemRoute");
const CategoryRoutes = require("./src/routes/categoryRoute");
const LoginRoutes  = require("./src/routes/loginRoute");
const RegisterRoutes = require("./src/routes/registerRoute");
const AuthRoutes = require('./src/routes/authRoute');
const UserRoutes = require('./src/routes/userRoute');
const UploadRoutes = require('./src/routes/uploadRoute');

const AdminRoutes = require('./src/routes/adminRoute');
const ContactRoutes = require('./src/routes/contactRoute');

app.use('/uploads', express.static('uploads'));
app.use('/api/user', UserRoutes);
app.use('/api/admin',AdminRoutes );
app.use('/api', UploadRoutes);
app.use('/api', CategoryRoutes);            
app.use('/api', ItemRoutes);
app.use('/api', LoginRoutes);
app.use('/api', RegisterRoutes);
app.use('/api', AuthRoutes);

app.use('/api',ContactRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})