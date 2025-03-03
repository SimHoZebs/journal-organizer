const mongoose = require('mongoose');

// increment plugin
const AutoIncrement = require('mongoose-auto-increment');

// Define the summary schema
const summarySchema = new mongoose.Schema({
    summaryId: { //auto generated summary id (PK)
        type: Number,
        unique: true
    },
    summaryTitle: { //title of the summary, which is generated from tag
        type: String,
        trim: true
    },
    summaryContent: { //content of the summary profile that OpenAI generates
        type: String,
        required: true,
        trim: true
    },
    tagId: [{type: Number}], //array of notebook Ids that have the tag we're looking for ([FK])
    
    userId: { //assigns the summary to the user (FK)
        type: Number,
        required: true
    }
}, {
    timestamps: { createdAt: 'timeCreated', updatedAt: 'timeUpdated' } //timestamps for time summary is created/updated
});

// creates unique summary id
summarySchema.plugin(AutoIncrement, {
    inc_field: "summaryId",
    start_seq: 1
});

module.exports = mongoose.model('Summary', summarySchema);