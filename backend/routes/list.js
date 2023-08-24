const router = require("express").Router();
const listModel = require("../models/list");

router.post("/add", async (req, res) => {
    try {
        console.log(req.body.title);
        //create new item
        const newItem = new listModel({
            Title: req.body.title,
            Details: req.body.details,
            Complete: req.body.complete,
        });
        //save user and respond
        const item = await newItem.save();
        res.status(200).json(item);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        // Find item by id
        const item = await listModel.findById(req.params.id);

        // Check if item exists
        if (!item) {
            return res.status(404).json({ message: "Item not found." });
        }

        // Delete item and respond
        await item.deleteOne();
        res.status(200).json(item);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.put("/:id/complete", async (req, res) => {
    const { id } = req.params;
    const { complete } = req.body;

    if (complete === undefined) {
        return res
            .status(400)
            .json({ error: "Please provide the Complete status to update." });
    }

    try {
        const itemToUpdate = await listModel.findById(id);

        if (!itemToUpdate) {
            return res.status(404).json({ error: "Item not found." });
        }

        itemToUpdate.Complete = complete;

        await itemToUpdate.save();
        res.status(200).json(itemToUpdate);
    } catch (error) {
        res.status(500).json({ error: "Error updating item." });
    }
});

module.exports = router;
