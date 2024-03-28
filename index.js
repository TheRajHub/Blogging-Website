import express from "express";
import {dirname} from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import upload from "express-fileupload";
const app=express();
const _dirname=dirname(fileURLToPath(import.meta.url));
app.use(upload());
app.use(express.static(_dirname+"\\public"));
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');
const port=4000||process.env.PORT;
const db=new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"TEST",
    password:"kaki12345",
    port:5432
});
db.connect();
app.get("/y",async(req,res)=>{
    var id=req.query.id;
    try{
        var result=await db.query('SELECT * FROM BLOGS WHERE ID=$1',[id]);
        res.render(_dirname+"\\views\\work.ejs",{result: result.rows[0]});
    }
    catch(err){
        console.log(err);
    }
});
app.get("/",async(req,res)=>{
    try{
        var result=await db.query("SELECT * FROM BLOGS;");
        if(result){
            res.render(_dirname+"\\views\\index.ejs",{result:result.rows});
        }
        else{
            res.render(_dirname+"\\views\\index.ejs");
        }
    }
    catch(err){
        console.log("2nd err:");
        console.log(err);
    }
    
});

app.get("/edit",(req,res)=>{
    res.render(_dirname+"\\views\\editor.ejs");
});
app.post("/post",async(req,res)=>{
    var topic=req.body.head;
    var blog=req.body.bod;

    
    var d=new Date;
    var year=d.getFullYear();
    var month=d.getMonth();
    var date=d.getDate();
    var fd = `${year}-${month+1}-${date}`;
    try{
        if(req.files){
            var file=req.files.photo.data;
            await db.query("INSERT INTO BLOGS (D,BLOG,TOPIC,IMG) VALUES ($1,$2,$3,$4);",[fd,blog,topic,file]);
        }
        else{
            await db.query("INSERT INTO BLOGS (D,BLOG,TOPIC) VALUES ($1,$2,$3);",[fd,blog,topic]);
        }
    }
    catch(err){
        console.log("1st err");
        console.log(err);
    }
    try{
        var result=await db.query("SELECT * FROM BLOGS WHERE BLOG=$1 AND TOPIC=$2",[blog,topic]);
        
        res.render(_dirname+"\\views\\work.ejs",{result: result.rows[0]});
    }
    catch(err){
        console.log("2nd err:");
        console.log(err);
    }
});
app.listen(port,()=>{
    console.log("http://localhost:"+port);
});