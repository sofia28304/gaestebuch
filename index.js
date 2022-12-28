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
        // if (!errors.isEmpty()) {
        //     return res.render("index", { contacts, errors })
        // }
        fs.readFile("./public/data/data.json", (err, data) => {
            if (err) console.log(err)
            contacts = JSON.parse(data)
            if (!errors.isEmpty()) {
                return res.render("index", { contacts, errors })
            }
            const neueDaten = { name: req.body.personname, kommentar: req.body.kommentar }
            contacts.push(neueDaten)

            console.log(contacts)
            fs.writeFileSync('./public/data/data.json', JSON.stringify(contacts, null, 2), (err) => {
                if (err) console.log(err)
            })
            res.render("index", { contacts, Error: { errors } })
            contacts = []
        })

    })
app.listen(PORT, (() => {
    console.log("server läuft auf ", PORT)
}))