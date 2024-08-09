import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../Button";
import Input from "../Input";

import { ButtonVariant, FormField } from "../../appConstants/enum";
import { fetchWithAuth } from "../../../api";
import withNoAuth from "../../middleWare/withNoAuth";
import { regexPatterns } from "../../utils/regex";

interface FormState {
  [FormField.NAME]: string;
  [FormField.CONTACT_NUMBER]: string;
  [FormField.EMAIL]: string;
  [FormField.PASSWORD]: string;
  [FormField.CONFIRM_PASSWORD]: string;
}

interface FormErrors {
  [FormField.NAME]?: string;
  [FormField.CONTACT_NUMBER]?: string;
  [FormField.EMAIL]?: string;
  [FormField.PASSWORD]?: string;
  [FormField.CONFIRM_PASSWORD]?: string;
}

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormState>({
    [FormField.NAME]: "",
    [FormField.CONTACT_NUMBER]: "",
    [FormField.EMAIL]: "",
    [FormField.PASSWORD]: "",
    [FormField.CONFIRM_PASSWORD]: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key in FormField]?: boolean }>({});
  const [isFormValid, setIsFormValid] = useState(false);

  const validateEmail = (email: string) => {
    return regexPatterns.email.test(email);
  };

  const validateContactNumber = (number: string) => {
    return regexPatterns.contactNumber.test(number);
  };

  const validateForm = () => {
    const validationErrors: FormErrors = {};

    if (touched[FormField.NAME] && !formData[FormField.NAME].trim()) {
      validationErrors[FormField.NAME] = "Name is required";
    }

    if (
      touched[FormField.CONTACT_NUMBER] &&
      !validateContactNumber(formData[FormField.CONTACT_NUMBER])
    ) {
      validationErrors[FormField.CONTACT_NUMBER] =
        "Contact number must be 10 digits long.";
    }

    if (touched[FormField.EMAIL] && !validateEmail(formData[FormField.EMAIL])) {
      validationErrors[FormField.EMAIL] = "Please enter a valid email address.";
    }

    if (
      touched[FormField.PASSWORD] &&
      formData[FormField.PASSWORD].length < 6
    ) {
      validationErrors[FormField.PASSWORD] =
        "Password must be at least 6 characters long.";
    }

    if (
      touched[FormField.CONFIRM_PASSWORD] &&
      formData[FormField.PASSWORD] !== formData[FormField.CONFIRM_PASSWORD]
    ) {
      validationErrors[FormField.CONFIRM_PASSWORD] = "Passwords do not match.";
    }

    setErrors(validationErrors);

    const isValid =
      Object.keys(validationErrors).length === 0 &&
      Object.values(formData).every((value) => value.trim() !== "");
    setIsFormValid(isValid);
  };

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });

      if (!touched[name as FormField]) {
        setTouched({ ...touched, [name]: true });
      }
    },
    [formData, touched]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isFormValid) {
      try {
        const response = await fetchWithAuth<{ token: string }>(
          "https://reqres.in/api/register",
          "POST",
          "",
          {
            email: formData[FormField.EMAIL],
            password: formData[FormField.PASSWORD],
          }
        );

        if (response.token) {
          localStorage.setItem("token", response.token);
          navigate("/dashboard");
        }
      } catch (error) {
        console.error(error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          [FormField.EMAIL]: "Signup failed. Please try again.",
        }));
      }
    }
  };

  useEffect(() => {
    validateForm();
  }, [formData, touched]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

        <form onSubmit={handleSubmit}>
          <Input
            label="Name"
            name={FormField.NAME}
            value={formData[FormField.NAME]}
            onChange={handleChange}
            error={errors[FormField.NAME]}
            placeholder="Enter your name"
          />

          <Input
            label="Contact Number"
            name={FormField.CONTACT_NUMBER}
            type="text"
            value={formData[FormField.CONTACT_NUMBER]}
            onChange={handleChange}
            error={errors[FormField.CONTACT_NUMBER]}
            placeholder="Enter your contact number"
            startAdornment={<span className="text-gray-600">+91</span>}
          />

          <Input
            label="Email"
            name={FormField.EMAIL}
            type="email"
            value={formData[FormField.EMAIL]}
            onChange={handleChange}
            error={errors[FormField.EMAIL]}
            placeholder="Enter your email"
          />

          <Input
            label="Password"
            name={FormField.PASSWORD}
            type="password"
            value={formData[FormField.PASSWORD]}
            onChange={handleChange}
            error={errors[FormField.PASSWORD]}
            placeholder="Enter your password"
          />

          <Input
            label="Confirm Password"
            name={FormField.CONFIRM_PASSWORD}
            type="password"
            value={formData[FormField.CONFIRM_PASSWORD]}
            onChange={handleChange}
            error={errors[FormField.CONFIRM_PASSWORD]}
            placeholder="Confirm your password"
          />

          <Button
            variant={ButtonVariant.SOLID}
            disabled={!isFormValid}
            className="w-full"
          >
            Sign Up
          </Button>
        </form>

        <div className="text-center mt-4">
          Already have an account? &nbsp;
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default withNoAuth(SignUp);
