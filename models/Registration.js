const mongoose = require(mongoose);

const registration = new mongoose.Schema({
    personname: { type: String , required: true },
    eventid: {type: mongoose.Schema.Types.objectId, ref: "event" , requered: true},
    registeredAt: {type: Date , default: Date.now}
});

module.exports = mongoose.model('Registration', registrationSchema);