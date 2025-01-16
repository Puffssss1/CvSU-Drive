"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Header from "@/components/Header";

const type = [
    { value: "Faculty", label: "Faculty Account" },
    { value: "Chairperson", label: "Chairperson Account" },
    { value: "Admin", label: "Admin Account" },
];

const department = [
    { value: "Department of Information Technology", label: "Department of Information Technology" },
    { value: "Teachers Education Department", label: "Department of Education" },
    { value: "Department of Arts & Sciences", label: "Department of Arts & Sciences" },
    { value: "Department of Management", label: "Department of Management" },
    
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

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        contact: "",
    });

    const router = useRouter();

    const validateInput = () => {
        let isValid = true;
        const newErrors: typeof errors = {
            name: "",
            email: "",
            password: "",
            contact: "",
        };
    
        // Validate name (at least 2 letters, no numbers or special characters)
        // Validate name (at least 2 letters, can include spaces, hyphens, or apostrophes)
        const namePattern = /^[A-Za-zÀ-ÿ\s'-]{2,}$/;
        const nameParts = formData.name.trim().split(/\s+/); // Split by whitespace

        if (!namePattern.test(formData.name) || nameParts.length < 2 || nameParts.some(part => part.length < 2)) {
            newErrors.name = "Name must contain at least 2 valid parts (e.g., first and last name) and can include spaces, hyphens, or apostrophes.";
            isValid = false;
        }
    
        // Validate email (valid email format ending with @gmail.com, no numbers or single letters)
        if (!/^[A-Za-z._%+-]+@gmail\.com$/.test(formData.email)) {
            newErrors.email = "Enter a valid email address ending with @gmail.com and containing only letters.";
            isValid = false;
        }
    
        // Validate password (at least 6 characters)
        if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long.";
            isValid = false;
        }
    
        // Validate contact (11 digits starting with 09)
        if (!/^09\d{9}$/.test(formData.contact)) {
            newErrors.contact = "Contact must be an 11-digit number starting with 09.";
            isValid = false;
        }
    
        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Clear errors on input change
        setErrors({ ...errors, [name]: "" });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateInput()) {
            return;
        }

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
                router.push("/accounts");
            } else {
                alert("Failed to create account.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred.");
        }
    };

    return (
        <>
            <div className="sticky top-0 z-50">
                <Header />
            </div>
            <Box
                component="form"
                className="flex flex-col items-center p-6 overflow-hidden  "
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
            >
                <div>
                    <h1 className="font-bold text-6xl mb-8 px-6 mt-2 font-sans text-[#FFB000]">ADD ACCOUNT</h1>
                </div>

                {[
                    { id: "name", label: "Name", type: "text", error: errors.name },
                    { id: "email", label: "Email", type: "email", error: errors.email },
                    { id: "password", label: "Password", type: "password", error: errors.password },
                    { id: "contact", label: "Contact", type: "text", error: errors.contact },
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
                            error={!!field.error}
                            helperText={field.error || ""}
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

                <div className="mb-10 w-full max-w-xs">
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
                    <Button type="submit" variant="contained" className="text-[#FFB000] bg-[#21094E] hover:bg-[#511281] rounded-full text-sm p-4">
                        Create Account
                    </Button>
                </Stack>
            </Box>
        </>
    );
}

export default AddAccount;
