import express from "express"
import { body, validationResult } from "express-validator"
import fs from "fs"

const app = express()
const PORT = 4787

let contacts = []

app.set("view engine", "ejs")
app.use(express.static("./public"))
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.render("index", { contacts })
})

app.post("/add",
    body('personname').isLength({ min: 3, max: 50 }),
    body('kommentar').isLength({ min: 5, max: 50 }),
    // body('zeit').isDate(new Date()),
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.render("index", { persons: contacts, errors })
        }
        fs.readFile("./public/data/data.json", (err, data) => {
            if (err) console.log(err)
            contacts = JSON.parse(data)
            const neueDaten = { name: req.body.personname, kommentar: req.body.kommentar }
            contacts.push(neueDaten)

            console.log(contacts)
            // res.render("index", { persons: contacts })
            //Daten in eine neue Json Datei schreiben:
            // let data = JSON.stringify(contacts, null, 2);
            // let data2 = data.concat(data2)
            fs.writeFileSync('./public/data/data.json', JSON.stringify(contacts, null, 2), (err) => {
                if (err) console.log(err)
            })
            // ohne sync beim writeFile schreibt er es mir in den Brower aber nicht in die Json.
            res.render("index", { contacts, Error: { errors } })
        })
    })
app.listen(PORT, (() => {

    console.log("server läuft auf ", PORT)
}))