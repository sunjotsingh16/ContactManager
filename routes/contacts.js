const express = require("express");
const Contact = require("../models/Contact");
const User = require("../models/User");
const { check, validationResult } = require('express-validator');
const auth = require("../middleware/authorize");

const router = express.Router();


// @route GET api/contacts
// @desc Get all contacts related to the user
// @access Private
router.get("/", auth, async(req, res) => {
    try {
        const contacts = await Contact.find({ user: req.user.id }).sort({ date: -1 });
        res.json(contacts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
});



// @route POST api/contacts
// @desc Add a new contact for the authorized user
// @access Private
router.post("/", [auth, [
    check("name", "Please enter a Name").not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, type } = req.body;

    try {
        const newContact = new Contact({
            name,
            email,
            phone,
            type,
            user: req.user.id
        });

        const contact = await newContact.save();
        res.json(contact);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
});

// @route PUT api/contacts/:id
// @desc Update an existing contact for the user
// @access Private
router.put("/:id", auth, async (req, res) => {
    const { name, email, phone, type } = req.body;

    const editContact = {};
    if (name) editContact.name = name;
    if (email) editContact.email = email;
    if (phone) editContact.phone = phone;
    if (type) editContact.type = type;

    try {
        let contact = await Contact.findById(req.params.id);

        if (!contact){
            return res.status(404).json({ msg: "Contact Not Found"});
        }

        // Verify that the logged-in user owns contact
        if (contact.user.toString() !== req.user.id){
            return res.status(401).json({ msg: "Not Authorized to Edit Contact"});
        }

        contact = await Contact.findByIdAndUpdate(req.params.id, {
            $set: editContact
        },
        { new: true });

        res.json(contact);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
});


// @route DELETE api/contacts/:id
// @desc Delete an existing contact for the user
// @access Private
router.delete("/:id", auth, async (req, res) => {
    try {
        let contact = await Contact.findById(req.params.id);

        if (!contact){
            return res.status(404).json({ msg: "Contact Not Found"});
        }

        // Verify that the logged-in user owns contact
        if (contact.user.toString() !== req.user.id){
            return res.status(401).json({ msg: "Not Authorized to Delete Contact"});
        }

        contact = await Contact.findByIdAndRemove(req.params.id);
        res.json({ msg: "Contact Removed"});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router;