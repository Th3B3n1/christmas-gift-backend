import express from "express";
import mysql from 'mysql2';
import bodyParser from "body-parser";
import cors from 'cors';

const app = express();
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'christmas-gifts',
}).promise();
const jsonParser = bodyParser.json();

app.use(cors());

app.get("/", (req, res) => 
{
    res.sendStatus(200);
})

app.get("/gifts", async (req, res) => 
{
    try
    {
        let query = await db.query("SELECT * FROM gifts");
        res.status(200);
        res.send(query[0]);
    }
    catch (error)
    {
        res.status(503);
        res.send({"error": "Service unavaiable"}).end();
    }
})

app.get("/gift", async (req, res) =>
{
    if (req.query.id != undefined && parseInt(req.query.id) > 0)
    {
        try
        {
            let query = await db.query("SELECT * FROM gifts WHERE id = ?", req.query.id);
            res.status(200);
            res.send(query[0]);
        }
        catch (error)
        {
            res.status(503);
            res.send({"error": "Service unavaiable"}).end();
        }
    }
    else
    {
        res.status(404);
        res.send({"error": "An invalid query parameter was given."}).end();
    }
})

app.post("/gift", jsonParser, async (req, res) => 
{
    if (req.body != undefined)
    {
        if ((req.body.name != undefined && req.body.price != undefined) && (req.body.avaiable != undefined))
        {
            if ((req.body.name.length > 0 && parseInt(req.body.price) > 0) && (typeof(req.body.avaiable) == "boolean"))
            {
                try
                {
                    await db.query('INSERT INTO gifts(name, price, avaiable) VALUES (?, ?, ?)', [req.body.name, req.body.price, req.body.avaiable]);
                    res.sendStatus(200).end();
                }
                catch (error)
                {
                    res.status(503);
                    res.send({"error": "Service unavaiable"}).end();
                }
            }
            else
            {
                res.status(400);
                res.send({"error": "Invalid data was given."}).end();
            }
        }
        else
        {
            res.status(400);
            res.send({"error": "Values are not defined."}).end();
        }
    }
    else
    {
        res.status(400);
        res.send({"error": "The request's body is empty."}).end();
    }
})

app.delete("/gift", async (req, res) => 
{
    if (req.query.id != undefined && parseInt(req.query.id) > 0)
    {
        try
        {
            await db.query('DELETE FROM gifts WHERE id = ?', req.query.id);
            res.sendStatus(200).end();
        }
        catch (error)
        {
            res.status(503);
            res.send({"error": "Service unavaiable"}).end();
        }
    }
    else
    {
        res.status(404);
        res.send({"error": "An invalid query parameter was given."}).end();
    }
})

app.put("/gift", jsonParser, async (req, res) => 
{
    if ((req.query.id != undefined && parseInt(req.query.id) > 0))
    {
        if (req.body != undefined)
        {
            if ((req.body.name != undefined && req.body.price != undefined) && (req.body.avaiable != undefined))
            {
                if ((req.body.name.length > 0 && parseInt(req.body.price) > 0) && (typeof(req.body.avaiable) == "boolean"))
                {
                    try
                    {
                        await db.query('UPDATE gifts SET name = ?, price = ?, avaiable = ? WHERE id = ?', [req.body.name, req.body.price, req.query.id]);
                        res.sendStatus(200).end();
                    }
                    catch (error)
                    {
                        res.status(503);
                        res.send({"error": "Service unavaiable"}).end();
                    }
                }
                else
                {
                    res.status(400);
                    res.send({"error": "New values are not valid."}).end();
                }
            }
            else
            {
                res.status(400);
                res.send({"error": "New values are not defined."}).end();
            }
        }
        else
        {
            res.status(400);
            res.send({"error": "The request's body is empty."}).end();
        }
    }
    else
    {
        res.status(404);
        res.send({"error": "An invalid query parameter was given."}).end();
    }
})

app.listen(5555, () => {
    console.log("Backend up! Avaiable at: localhost:5555")
});