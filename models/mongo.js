/* eslint-disable linebreak-style */
const mongoose = require('mongoose')

// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URL

console.log('connecting to database')

mongoose.connect(url)
// eslint-disable-next-line no-unused-vars
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB', error.message)
  })


const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3,'the name should be at least 3 characters long'],
    unique: true,
    validation: function (value) {
      if (value.length < 3) {
        throw new Error ('Name must be at least 3 characters long.')
      } 
    }
  },
  phone: {
    type: String,
    minLength: [8,'the phone number should be at least 8 digits long'],
    unique: true,
    validation: function (value){
      if (value.length < 8) {
        throw new Error ('Phone number must be at least 8 characters long.')
      }
    }
  }
})

contactSchema.set('toJSON', {
  transform: (document, returnedObject) =>{
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Contact', contactSchema)

