export const formatErrorMsg = (errorMessage: any) => {
  switch (errorMessage) {
    case "internal":
      return "Uh Oh! It looks like there was an error processing your request!";
    case "passwordInvalid":
      return "Please make sure your passwords match, are at least 8 characters long, have a mix of upper and lower characters, and use a special character!";
    case "usernameTaken":
      return "Sorry! It looks like this username is already taken - please try another!";
    case "emailTaken":
      return "Sorry! It looks like someone already signed up with this email. Please use a different email or, if this is your account, please login!";
    case "usernameAndEmailTaken":
      return "Sorry! It looks like both the username and email you provided are already registered with an account. Did you sign up already? If so, please login!";
    default:
      return;
  }
};
