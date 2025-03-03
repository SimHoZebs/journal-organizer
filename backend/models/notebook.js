const mongoose = require('mongoose');

// increment plugin
const AutoIncrement = require('mongoose-sequence')(mongoose);

// Define the Notebook schema
const notebookSchema = new mongoose.Schema({
    notebookId: { //auto generated notebookId (PK)
        type: Number,
        unique: true
    },
    title: { //title of the notebook (user input)
        type: String,
        required: true,
        trim: true
    },
    content: { //content of notebook (user input)
        type: String,
        required: true,
        trim: true
    },
    tags: [{type: String, trim: true}], //array of tags that OpenAI generates for notebook,
                                        //which includes important info like people, tasks, etc.
    userId: { // assigns the notebook to the user (FK)
        type: Number,
        required: true
    } 
}, 
    {
    timestamps: { createdAt: 'timeCreated', updatedAt: 'timeUpdated' } 
});
// creates unique notebook id
notebookSchema.plugin(AutoIncrement, {
    inc_field: "notebookId",
    start_seq: 1
});

module.exports = mongoose.model('Notebook', notebookSchema);