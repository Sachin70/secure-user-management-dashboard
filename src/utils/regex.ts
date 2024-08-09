export const regexPatterns = {
  name: /^[a-zA-Z\s]+$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^[0-9]\d{9}$/,
  password:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@!%*#?&])[A-Za-z\d$@!%*#?&]{8,}$/,
  contactNumber: /^(\+91[-\s]?)?[0]?(91)?[123456789]\d{9}$/,
};
