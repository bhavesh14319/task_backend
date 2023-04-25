const express = require('express');

const User = require("./model/UserModel");

const app = express();
const cors = require("cors")
const dotenv= require("dotenv")

app.use(cors())
dotenv.config()

const data =  require("./data");


// console.log(data);

const mongoose = require('mongoose');

const dbName = 'myDatabase';
const dbURI = process.env.URL + dbName;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {console.log('MongoDB connected...')
                //  User.insertMany(data)
                 
})
  .catch(err => console.log(err));

mongoose.connection.on('connected', () => console.log('Mongoose connected to ' + dbURI));
mongoose.connection.on('error', err => console.log('Mongoose connection error: ' + err));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));


app.get('/users/bmw-mercedes-income', async (req, res) => {
    const users = await User.find({
      income: { $lt: 5 },
      car: { $in: ['BMW', 'Mercedes'] }
    });
    res.json(users);
  });

  
  app.get('/users/male-expensive-phone', async (req, res) => {
    let users = await User.find({
      gender: 'Male',
    });

    users = users.filter((user)=>Number(user.phone_price) >= 10000) 
    res.json(users);
  });

  
  app.get('/users/long-quote-email', async (req, res) => {
    const users = await User.find({
      last_name: /^M/,
      $expr: {
        $gt: [{ $strLenCP: "$quote" }, 15]
      },
      $expr: {
        $regexMatch: {
          input: "$email",
          regex: { $concat: [".*", "$last_name", ".*"] },
          options: "i"
        }
      }
    });
    res.json(users);
  });
  

  app.get('/users/german-car-no-digit-email', async (req, res) => {
    const users = await User.find({
      car: { $in: ['BMW', 'Mercedes', 'Audi'] },
      email: { $not: /\d/ }
    });
    res.json(users);
  });



    app.get('/users/top-cities', async (req, res) => {
        const result = await User.aggregate([
          { $group: {
            _id: "$city",
            count: { $sum: 1 },
            avgIncome: { $avg: { $toDouble: { $substr: ["$income", 1, -1] } } }
          }},
          { $sort: { count: -1 } },
          { $limit: 10 },
        //   { $project: { city: "$_id", avgIncome: 1, _id: 0 } }
        ]);
      
        res.json(result);
      });
    
    
    
    
    
    
    
    




    // const pipeline = [
    //   {
    //     $group: {
    //       _id: '$city',
    //       count: { $sum: 1 },
    //       avgIncome: { $avg: '$income' }
    //     }
    //   },
    //   { $sort: { count: -1 } },
    //   { $limit: 10 }
    // ];
    // const results = await User.aggregate(pipeline);
    // res.json(results);
  


app.listen(3000,()=>{
    console.log("server started on: "+ 3000)
    
})



app.use(express.json());


