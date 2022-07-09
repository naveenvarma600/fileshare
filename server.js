require("dotenv").config()
const express =require("express")
const app =express()
const multer = require("multer")
const mongoose = require("mongoose")
//const bcrypt = require("bcrypt")
const File = require("./models/File")
const db = require("./db")
const path = require('path');

app.use(express.urlencoded({ extended: true }))

const upload = multer({dest:"uploads"})

mongoose.connect(process.env.DATABASE_URL)

app.set("view engine", "ejs")

//app.use(express.static(path.join(__dirname,'/file', '/public')));

app.use( express.static("public" ) );

db.on('error', console.error.bind(console, 'MongoDB connection error:'))
//mongoose.connect(process.env.DATABASE_URL,)

app.get("/",(req,res)=>{
    res.render("index")
})

app.post("/upload", upload.single("file"), async (req,res)=>{
    const fileData = {
        path: req.file.path,
        originalName: req.file.originalname,
      }
      if (req.body.password != null && req.body.password !== "") {
        //fileData.password = await bcrypt.hash(req.body.password, 10)
        fileData.password =  req.body.password

      }
      const file = await File.create(fileData)

      res.render("index", { fileLink: `${req.headers.origin}/file/${file.id}` })
})

//app.route("/file/:id").get(handleDownload).post(handleDownload)
app.get("/file/:id",async (req,res)=>{
  //handleDownload(req,res)
  res.render("password")
})
app.post("/file/:id",async (req,res)=>{
  handleDownload(req,res)
})

async function handleDownload(req, res) {
  
    const file = await File.findById(req.params.id)
  
    if (file.password != null) {
      if (req.body.password == null) {
        res.render("password")
        return
      }
  
      if (await req.body.password != file.password) {
        res.render("password", { error: true })
        return
      }
    }
  
    file.downloadCount++
    await file.save()
    console.log(file.downloadCount)
  
    res.download(file.path, file.originalName)
    
  }

app.listen(3000)