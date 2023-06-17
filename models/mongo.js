const mongoose = require('mongoose')

const url = process.env.MONGODB_URL

console.log('connecting to database')

mongoose.connect(url)
.then(result => {
console.log('connected to MongoDB')
})
.catch((error) => {
    console.log('error connecting to MongoDB', error.message)
})


const contactSchema = new mongoose.Schema({
    name: String,
    phone: String,
})

contactSchema.set('toJSON', {
    transform: (document, returnedObject) =>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject._v
    }
})

module.exports = mongoose.model('Contact', contactSchema)

/*
const contact = new Contact({
    name: process.argv[3],
    phone: process.argv[4],
})

contact.save().then(result => {
    console.log('contact saved!')
    mongoose.connection.close()
})
*/
