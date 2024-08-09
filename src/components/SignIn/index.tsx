import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../Input";
import Button from "../Button";

import { ButtonVariant, LoginField } from "../../appConstants/enum";
import { fetchWithAuth } from "../../../api";
import withNoAuth from "../../middleWare/withNoAuth";
import { regexPatterns } from "../../utils/regex";

interface LoginState {
  [LoginField.EMAIL]: string;
  [LoginField.PASSWORD]: string;
}

interface LoginErrors {
  [LoginField.EMAIL]?: string;
  [LoginField.PASSWORD]?: string;
}

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginState>({
    [LoginField.EMAIL]: "",
    [LoginField.PASSWORD]: "",
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [touched, setTouched] = useState<{ [key in LoginField]?: boolean }>({});
  const [isFormValid, setIsFormValid] = useState(false);

  const validateEmail = (email: string) => {
    return regexPatterns.email.test(email);
  };

  const validateForm = () => {
    const validationErrors: LoginErrors = {};

    if (
      touched[LoginField.EMAIL] &&
      !validateEmail(formData[LoginField.EMAIL])
    ) {
      validationErrors[LoginField.EMAIL] =
        "Please enter a valid email address.";
    }

    if (
      touched[LoginField.PASSWORD] &&
      formData[LoginField.PASSWORD].length < 6
    ) {
      validationErrors[LoginField.PASSWORD] =
        "Password must be at least 6 characters long.";
    }

    setErrors(validationErrors);

    const isValid =
      Object.keys(validationErrors).length === 0 &&
      Object.values(formData).every((value) => value.trim() !== "");
    setIsFormValid(isValid);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (!touched[name as LoginField]) {
      setTouched({ ...touched, [name]: true });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      try {
        const response = await fetchWithAuth<{ token: string }>(
          "https://reqres.in/api/login",
          "POST",
          "",
          {
            email: formData[LoginField.EMAIL],
            password: formData[LoginField.PASSWORD],
          }
        );

        if (response.token) {
          localStorage.setItem("token", response.token);
          navigate("/dashboard");
        }
      } catch (error) {
        console.error(error);
        setErrors({
          ...errors,
          [LoginField.EMAIL]: "User does not exist. Please sign up first.",
        });
      }
    }
  };

  useEffect(() => {
    validateForm();
  }, [formData, touched]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            name={LoginField.EMAIL}
            value={formData[LoginField.EMAIL]}
            onChange={handleChange}
            error={errors[LoginField.EMAIL]}
            placeholder="Enter your email"
          />
          <Input
            label="Password"
            name={LoginField.PASSWORD}
            type="password"
            value={formData[LoginField.PASSWORD]}
            onChange={handleChange}
            error={errors[LoginField.PASSWORD]}
            placeholder="Enter your password"
          />

          <Button
            variant={ButtonVariant.SOLID}
            disabled={!isFormValid}
            className="w-full mt-4"
          >
            Sign In
          </Button>
        </form>

        <div className="text-center mt-4">
          Don't have an account? &nbsp;
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default withNoAuth(Login);
