export var validatePassword = function (password, password2) {
    var validLength = password.length >= 8;
    var mixOfCharacters = !!password.match(/\d/) &&
        !!password.match(/\w/) &&
        !!password.match(/[\?\!\@\%\*\&]/);
    var mixOfUpperAndLower = !!password.match(/[A-Z]/) && !!password.match(/[a-z]/);
    var passwordsMatch = password === password2;
    return {
        validLength: validLength,
        mixOfCharacters: mixOfCharacters,
        mixOfUpperAndLower: mixOfUpperAndLower,
        passwordsMatch: passwordsMatch,
        valid: validLength && mixOfCharacters && mixOfUpperAndLower && passwordsMatch,
    };
};
