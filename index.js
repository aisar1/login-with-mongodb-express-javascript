 const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const override = require('method-override');
const bcrypt = require('bcrypt');
const session = require('express-session');

app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true})); //for normal req.body
app.use(express.json()); //for json req.body
app.use(override('_method'));
app.use(session({secret:"little secret"}));

mongoose.connect('mongodb://localhost:27017/datalogin2', {useNewUrlParser: true, useUnifiedTopology: true})
.then(function(){
	console.log('mongo connected')
})
.catch(function(err){
	console.log('eror connection')
})


const loginSchema = new mongoose.Schema({
	name: String,
	password: String
});

const Loginfrm = mongoose.model('Loginfrm', loginSchema);


app.get('/',async function(req,res){
	
	res.render('registerlogin');
})

//app.get('/secret',async function(req,res){
	
//	res.render('secret');
//})

app.get('/secret',async function(req,res){
	if(!req.session._id){
		res.redirect('/login');
	}
	else{
	res.render('secret');
	}
})

app.post('/deletesession',async function(req,res){
req.session._id=null;
req.session.destroy();
res.redirect('login');
})

app.post('/register',async function(req,res){
const custname = req.body.namecust;
const passform = req.body.passw;
	
console.log(custname);
console.log(passform);
const hash = await bcrypt.hash(passform ,12);
const lo = new Buyer ({name:custname,password: hash});
await lo.save();
res.redirect('/login')
})

app.get('/login',async function(req,res){
	
	res.render('loginonline');
})

app.get('/testsession',async function(req,res){
	if(!req.session._id){
		res.redirect('/login');
	}
	else{
	res.send('something');
	}
})

app.post('/login',async function(req,res){
const name = req.body.namecust;
const passform = req.body.passw;
const findcustname = await Loginfrm.findOne({name:name})
const checkpassword = await bcrypt.compare(passform,findcustname.password);
if(!findcustname){
	res.redirect('/login')
}
else{
	req.session._id = findcustname._id;
	res.render('secret')
}

})


app.listen(3000,function(res,req){
		   console.log('app is listening to port 3000');
		   });