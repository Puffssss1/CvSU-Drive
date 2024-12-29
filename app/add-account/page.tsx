"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

const type = [
    { value: "Faculty", label: "Faculty Account" },
    { value: "Chairperson", label: "Chairperson Account" },
    { value: "Admin", label: "Admin Account" },
];

const department = [
    { value: "Department of Information Technology", label: "Department of Information Technology" },
    { value: "Department of Education", label: "Department of Education" },
];

const sex = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
];

function AddAccount() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        contact: "",
        role: "Faculty",
        department: "Department of Information Technology",
        sex: "Male",
        birthday: "",
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(formData);
        try {
            const response = await fetch("/api/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                alert("Account created successfully!");
                console.log("Server Response:", result);
            } else {
                alert("Failed to create account.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred.");
        }
    };

    return (
        <Box
            component="form"
            className="flex flex-col items-center p-6 overflow-hidden"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
        >
            <div>
                <h1 className="font-bold text-3xl mb-4 px-6">| ADD ACCOUNT</h1>
            </div>

            {[
                { id: "name", label: "Name", type: "text" },
                { id: "email", label: "Email", type: "email" },
                { id: "password", label: "Password", type: "password" },
                { id: "contact", label: "Contact", type: "text" },
                { id: "role", label: "Role", options: type },
                { id: "department", label: "Department", options: department },
                { id: "sex", label: "Sex", options: sex },
            ].map((field) => (
                <div className="mb-4 w-full max-w-xs" key={field.id}>
                    <TextField
                        id={`outlined-${field.id}`}
                        label={field.label}
                        select={!!field.options}
                        type={field.type || "text"}
                        name={field.id}
                        value={formData[field.id as keyof typeof formData] || ""}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                    >
                        {field.options &&
                            field.options.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                    </TextField>
                </div>
            ))}

            <div className="mb-4 w-full max-w-xs">
                <TextField
                    label="Birthday"
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                        min: "1900-01-01",
                        max: new Date().toISOString().split("T")[0],
                    }}
                    variant="outlined"
                    fullWidth
                />
            </div>

            <Stack spacing={2} direction="row">
                <Button type="submit" variant="contained">
                    Create Account
                </Button>
            </Stack>
        </Box>
    );
}

export default AddAccount;
