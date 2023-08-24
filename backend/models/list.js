const mongoose = require("mongoose");

const listSchema = new mongoose.Schema(
    {
        Title: {
            type: String,
            require: true,
            max: 50,
        },
        Complete: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("list", listSchema);
