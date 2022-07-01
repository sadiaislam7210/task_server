const express=require("express")
const app=express()

require('dotenv').config()
const cors=require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express')
app.use(cors())
const port = process.env.PORT || 5000;
app.use(express.json());
app.get('/',(req,res)=>{
    res.send("Hello Task app sever")
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7auxx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const collection=client.db("daily-task").collection("task")
        app.post("/task", async (req, res) => {
          const query=req.body
           const result =await collection.insertOne(query);
          
           res.send(result);
         });
         app.get('/task',async(req,res)=>{
          const query={}
          const result=collection.find(query)
        const task=await result.toArray()
        res.send(task)
         })
         app.delete('/task/:id',async(req,res)=>{
          const id=req.params.id
          const query ={_id:ObjectId(id)}
          const result = await collection.deleteOne(query);
          res.send(result)
      })
      app.get('/task/:id',async(req,res)=>{
        const id=req.params.id
          const query ={_id:ObjectId(id)}
          const result = await collection.findOne(query);
          res.send(result)
      })
      app.put('/task/:id',async(req,res)=>{
        const id=req.params.id
        const updateTask=req.body
          const filter ={_id:ObjectId(id)}
          const options = { upsert: true };
          const updateDoc={
            $set:{
               taskname:updateTask.taskname,
               duration:updateTask.duration,
               details:updateTask.details
            }
          }
          const result = await collection.updateOne(filter,updateDoc,options);
          res.send(result)
      })

    }
    finally{

    }

}
run().catch(console.dir)
app.listen(port,()=>{
    console.log(`Running server ${port}`);
})