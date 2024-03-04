const express = require("express");
const cors = require("cors");


//jdiojdhaihai
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
app.use(express.json());
app.use(cors({
    origin: "https://cicada-ai.web.app",
    methods: [
        "GET", "POST", "PUT", "DELETE"
    ]
}));
const port = process.env.PORT || 5000;

const API_KEY = `${process.env.GPT_API_KEY}`;


const prompts = [
    "Act as a medical Specialist to create a clinical DAP note from a given text and make the template like the below- Data: The client presents for psychotherapy due to struggling to focus on his college classes. The client finds they procrastinate and need help completing their homework by assigned deadlines. The client has consistently been late in turning in homework since the semester began. He also reports problems getting to class on time since the semester started three months ago. give only DAP DATA based on my below text-",
    "Act as a medical Specialist to create a clinical DAP note from a given text and make the template like the below- Assessment: The client’s symptoms are consistent with ADHD. The counsellor will work with him on strategies to help with task initiation as well as recognizing unhelpful thoughts he may be having that inhibit his ability to get his work done. The counsellor will also speak with him about getting a formal assessment done for ADHD and potential medication. give only DAP ASSESSMENT based on my below text:",
    "Act as a medical Specialist to create a clinical DAP note from a given text and make the template like the below- Plan: The client will meet with the counsellor weekly to work on strategies for coping with ADHD. The counsellor will give him an outside referral to a Psychologist who does ADHD testing. give only DAP PLAN based on my below text:",
    "Act as a medical specialist and Create a clinical BIRP Note from the given text and create it inn accordance to below template sample - Behavior: The client presents for therapy to work on challenges related to childhood trauma. The client reports that they are having flashbacks and nightmares regarding a sexual abuse incident that occurred in childhood. Additionally, the client reports that these nightmares have affected their sleep quality, causing fatigue issues during the day. Give only BIRP BEHAVIOR based on my below text: ",
    "Act as a medical specialist and Create a clinical BIRP Note from the given text and create it inn accordance to below template sample -  Intervention: The counsellor will utilize EMDR techniques to help treat the client’s trauma. The counsellor spent the first part of the session identifying coping skills and resources they use to process trauma and what hasn’t helped. give only BIRP INTERVENTION based on my below text: ",
    "Act as a medical specialist and Create a clinical BIRP Note from the given text and create it inn accordance to below template sample - Response: The client was on time for therapy and attentive. The client is receptive to starting EMDR, which will begin in the next session.give only BIRP RESPONSE based on my below text: ",
    "Act as a medical specialist and Create a clinical BIRP Note from the given text and create it inn accordance to below template sample - Plan: The client and counsellor will start working on the first phase of EMDR in the next session. The counsellor and client will meet weekly to work on the client’s past trauma. give only BIRP PLAN based note the below text: ",
    "Act as a medical specialist and create a SOAP note from the given text and make the Note template just like the below sample. - Subjective: The client presents for therapy, wanting to work on symptoms associated with their Borderline Personality Disorder diagnosis. The client reports having trouble with their interpersonal relationships and often feels like the people close to them will abandon them. The client says they struggle to relate to their coworkers and maintain friendships. The client states they have had these problems throughout their life but noticed the relationship difficulties increasing in the last few months.give only SOAP SUBJECTIVE based on my below text:",
    "Act as a medical specialist and create a SOAP note from the given text and make the Note template just like the below sample - Objective: The client presents with a disheveled appearance. They are on time for the session and have a depressed presentation. The client appears in a low mood. give only SOAP OBJECTIVE based on my below text: ",
    "Act as a medical specialist and create a SOAP note from the given text and make the Note template just like the below sample - Assessment: The client appears to meet the Borderline Personality Disorder criteria. They have a history of challenges with maintaining friendships, which has increased in the last few months with increased stress. give only SOAP ASSESSMENT based on my below text: ",
    "Act as a medical specialist and create a SOAP note from the given text and make the Note template just like the below sample - Plan: The client will meet with the therapist weekly to work on symptoms associated with Borderline Personality Disorder. The therapist will utilize DBT techniques such as helping the client learn interpersonal effectiveness skills. In addition, the therapist will work towards helping the client identify a DBT group in the area they can join. give only SOAP PLAN based on my below text: "

]

app.post("/completions", async (req, res) => {
    try {
        const completions = [];

        for (const prompt of prompts) {
            const options = {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "gpt-4",
                    messages: [
                        { role: "user", content: prompt + req.body.message },
                    ],
                    max_tokens: 100,
                }),
            };

            const response = await fetch(
                "https://api.openai.com/v1/chat/completions",
                options
            );

            const data = await response.json();
            completions.push(data);
        }

        res.json({ completions: completions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ro4rymx.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const noteCollection = client.db("cicada-ai").collection("notes");

        app.get("/", (req, res) => {
            res.send("Server for Cicada Ai");
        });

        app.get("/notes", async (req, res) => {
            const cursor = await noteCollection.find().toArray();
            res.send(cursor);
        });

        app.post("/add-note", async (req, res) => {
            const newNote = await noteCollection.insertOne(req.body);

            newNote.acknowledged
                ? res.status(200).json({
                    note: newNote,
                    message: "Note successfully added",
                })
                : res.status(400).json({ error: "Bad Request" });
        });

        app.delete("/delete-note/:id", async (req, res) => {
            const objId = new ObjectId(req.params.id);
            const deleteNote = await noteCollection.deleteOne({ _id: objId });

            deleteNote.acknowledged
                ? res
                    .status(200)
                    .json({ message: "product successfully deleted" })
                : res.status(400).json({ error: "Bad Request" });
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );
    } finally {
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
