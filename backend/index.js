
// import express from "express"
// import cors from "cors"
// import mongoose from "mongoose"


const express = require('express')
const cors = require('cors')

const ObjectID = require('mongodb').ObjectId
const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())


const userSchema = new mongoose.Schema({

    name: {
        type: String,
    },
    email: {
        type: String,
    }
    ,
    password: {
        type: String,
    },
    Role: {
        type: String
    }

})


const CategorySchema = new mongoose.Schema({
    Cat_name: {
        type: String,
        required: true,
    }

})

const QuestionSchema = new mongoose.Schema({
    Question: {
        type: String,
        required: true,
    },
    Category: {
        type: String,
        required: true,
    },
    CreatedBy: {
        type: String,
        required: true
    },
    approved: {
        type: Boolean,

    },
    questionId: {
        type: String,
    }
})
//   user model made
const Questions = new mongoose.model("Question", QuestionSchema, "Questions")
const Category = new mongoose.model("Category", CategorySchema, "Categories")

const User = new mongoose.model("User", userSchema, "users")

// connections
mongoose.connect('mongodb://127.0.0.1:27017/myquery').then(() => console.log("connected")).catch((error) => {
    console.log(error)
})


//signup code
app.post("/signup", async (req, res) => {
  const { email, passUser, name } = req.body;
  console.log("in")

  const [checkEmail, checkName] = await Promise.all([
    User.findOne({ email: email }),
    User.findOne({ name: name })
  ]);

  if (checkEmail) {
    res.send({ response: "Email Already Exists" });
  } else if (checkName) {
    res.send({ response: "Name Already Exists" });
  } else {
    const user = new User({
      email,
      password: passUser,
      name,
      Role: "User",
    });
    user
      .save()
      .then(() => {
        res.send({ response: "ok", user });
      })
      .catch((e) => {
        console.log("error", e.message);
      });
  }
});




app.post("/profile", async (req, res) => {

    async function execute() {
        try {
            const { name } = req.body;
            const getProfileDetail = await User.findOne({ name: name })

            if (getProfileDetail) {
                res.json(getProfileDetail)
            }

        } catch (e) { console.log(e) }
    }
    execute()
})

//add a question or category check idk what is going to be 

app.post("/add", async (req, res) => {

    async function execute() {
        try {
            const { name } = req.body;

            const check = await Category.findOne({ Cat_name: name })

            if (!check) {
                const newCat = new Category({
                    Cat_name: name
                })

                newCat.save().then(() => {
                    res.json({ response: "Saved" })
                }).catch((e) => {
                    res.json({ response: "!Saved" })
                })
            } else {
                res.json({ response: "Category already present" })
            }
        } catch (e) {
            console.log(e)
        }
    }
    execute()
})

//becomeAdim

app.post("/BecomeAdmin", async (req, res) => {

    async function execute() {
        try {
            const { user, pass } = req.body

            const updateProfile = await User.findOneAndUpdate({ name: user, password: pass }, { Role: "Admin" }, { new: true })
            if (updateProfile) {
                res.json({ message: "success", role: updateProfile.Role })
            } else {
                res.json({ message: "password Incorrect" })
            }


        } catch (e) {
            console.log(e)
        }
    }

    execute()
})


//login code 
app.post("/login", async (req, res) => {

    async function execute() {
        try {
            const { name, passUser } = req.body
            const check = await User.findOne({ name: name, password: passUser })
            if (check) {

                const sessionId = uuidv4();

                res.json({ success: true, sessionId: sessionId, id: check._id, role: check.Role })

            } else {
                res.json({ success: false })
            }
        } catch (e) {
            res.json(e)

        }
    }

    execute();
})


//get all categories if exists!

app.get("/getCategory", async (req, res) => {

    async function execute() {
        try {
            const check = await Category.find()
            if (check) {
                res.json({ message: "Sucess", result: check })
            } else {
                res.json({ message: "NA" })
            }

        } catch (e) {
            console.log(e)
        }
    }
    execute()
})



//Question code

app.post("/addQuestion", async (req, res) => {
    async function execute() {

        try {
            const { question, user, approved, selectedCat } = req.body
            console.log(question, user, approved, selectedCat)
            const check = await Questions.findOne({ Question: question, Category: selectedCat })
            if (check) {
                res.json({ message: "Question Exists already" })
            } else {


                // const result = Math.random().toString(36).substring(2,7);

                const newQ = new Questions({
                    Question: question,
                    CreatedBy: user,
                    Category: selectedCat,
                    approved: approved,
                    questionId: uuidv4(),
                })

                newQ.save().then(() => {
                    console.log("saved")
                    res.json({ message: "created" })
                })
            }
        } catch (e) { }
    }
    execute()
})

//approvals ( approved == false) only fetch

app.get("/approve", async (req, res) => {
    async function execute() {
        try {

            const data = await Questions.find({ approved: false }).limit(4)

            if (data) {
                res.json({ response: data })
            } else {
                console.log({ response: "NA" })
            }
        }
        catch (e) {
            console.log(e)
        }
    }
    execute()
})

app.post("/delete", async (req, res) => {

    async function execute() {
        try {
            const { Question, Category } = req.body

            const data = await Questions.deleteOne({ Question: Question, Category: Category })


            //     const objectId = new ObjectID(id)  
            //    const da  ta = await Questions.findOne({_id:objectId})
            //     console.log(data)
        }
        catch (e) {
            console.log(e)
        }
    }
    execute()
})

app.post("/approveit", async (req, res) => {

    async function execute() {
        try {
            // const updateProfile = await User.findOneAndUpdate({ name: user, password: pass }, { Role: "Admin" }, { new: true })
            const { Question, Category } = req.body

            const data = await Questions.findOneAndUpdate({ Question: Question, Category: Category }, { approved: "true" }, { new: true })
            if (data) {
                res.json({ message: "success" })
            } else {

            }


        }
        catch (e) {
            console.log(e)
        }
    }
    execute()
})

//getAllQuestionMatchinTheQuery

app.get("/getQuery", async (req, res) => {
    try {
        const { term } = req.query;
        const searchWord = term;
        const searchRegex = new RegExp(searchWord, 'i') ;
        Questions.find({ Question: searchRegex , approved:true}).then((response) => {
            res.json({response:response})
         
        }).catch((e)=>[
            res.json({response:"NA"})
        ])
      
       
    } catch (e) {
        console.log(e);
    }
});


app.listen(8000, () => {
    console.log("started")
})