const validateSignupInput = (email, password) => {
    // Email validation: More than 3 chars before @, 3 or more chars after @, and a domain name
    const emailRegex = /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]{3,}\.[a-zA-Z]{2,}$/;
  
    // Password validation: At least 8 characters, one uppercase, one lowercase, and one number
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  
    // Check email
    if (!emailRegex.test(email)) {
      return { isValid: false, message: "Invalid email format." };
    }
  
    // Check password
    if (!passwordRegex.test(password)) {
      return {
        isValid: false,
        message:
          "Password must be at least 8 characters long, contain one uppercase letter, and at least one number.",
      };
    }
  
    // If both are valid
    return { isValid: true, message: "Input is valid." };
  };

  export {validateSignupInput}