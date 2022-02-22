export const validatePassword = (password: string, password2: string) => {
  const validLength = password.length >= 8;
  const mixOfCharacters =
    !!password.match(/\d/) &&
    !!password.match(/\w/) &&
    !!password.match(/[\?\!\@\%\*\&]/);
  const mixOfUpperAndLower =
    !!password.match(/[A-Z]/) && !!password.match(/[a-z]/);
  const passwordsMatch = password === password2;

  return {
    validLength,
    mixOfCharacters,
    mixOfUpperAndLower,
    passwordsMatch,
    valid:
      validLength && mixOfCharacters && mixOfUpperAndLower && passwordsMatch,
  };
};
