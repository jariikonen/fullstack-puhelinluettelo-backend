const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

let password = ''
let name = ''
let number = ''

if (process.argv.length < 3 || process.argv.length === 4) {
  console.log('usage: mongo.js <password> [<name> <number>]')
  process.exit(1)
}
if (process.argv.length > 2) {
  password = process.argv[2]
}
if (process.argv.length === 5) {
  name = process.argv[3]
  number = process.argv[4]
}

const url =
  `mongodb+srv://jikonen:${password}@cluster0.visrgh9.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: mongoose.Mixed
})

const Person = mongoose.model('Person', personSchema)

const savePerson = (name, number) => {
  const person = new Person({name, number})

  person.save().then(result => {
    console.log(`new contact '${name} ${number}' saved!`)
    mongoose.connection.close()
  })
}

const listPersons = () => {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

if (name && number) {
  savePerson(name, number)
}
else {
  listPersons()
}
