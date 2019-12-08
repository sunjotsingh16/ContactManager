import React, { useState, useContext, useEffect } from "react";
import ContactContext from "../../context/contact/contactContext";

const ContactForm = () => {

    const contactContext = useContext(ContactContext);

    const { addContact, current, updateContact, clearCurrent } = contactContext;

    useEffect(() => {
    if (current !== null) {
        setContact(current);
    }       
    else {
        setContact({
            name:"",
            email: "",
            phone: "",
            type: "personal"
        });
    }
    }, [current, contactContext]);
    

    const [contact, setContact] = useState({
        name:"",
        email: "",
        phone: "",
        type: "personal"
    });

    const { name, email, phone, type } = contact;

    const onChange = (e) => {
        setContact({
            ...contact,
            [e.target.name]: e.target.value});
    }

    const onSubmit = (e) => {
        e.preventDefault();

        if ( current === null) {
        // call add contact action
        addContact(contact);
        }
        else {
            updateContact(contact);
        }


        // Clear form fields
        setContact({
            name:"",
            email: "",
            phone: "",
            type: "personal"
        });
    }

    const clearAll = () => {
        clearCurrent();
    }

    return (<form onSubmit={onSubmit}>
<h2 className="text-dark"> <u> {current ? "Edit Contact" : "Add Contact"} </u></h2>
        <input type="text" placeholder="Name" name="name" value={name} onChange={onChange} />
        <input type="email" placeholder="Email" name="email" value={email} onChange={onChange} />
        <input type="text" placeholder="Phone" name="phone" value={phone} onChange={onChange} />
        <h5>Contact Type</h5>
        <input type="radio" name="type" value="personal" checked={type === "personal"} onChange={onChange} /> Personal {"  "}
        <input type="radio" name="type" value="professional" checked={type === "professional"} onChange={onChange} /> Professional {"  "}
        <div>
            <input type="submit" value={current ? "Update Contact" : "Add Contact"} className="btn btn-primary btn-block" />
        </div>
        { current && (
        <div>
            <button className="btn btn-block btn-light" onClick={clearAll}>Clear All</button>
        </div>
            )}
    </form>)
}

export default ContactForm;