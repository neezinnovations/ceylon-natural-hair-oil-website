const messages = {
  "app/account-setup-incomplete": "Account setup could not be completed. Please contact support before registering again.",
  "auth/invalid-credential": "Email or password is incorrect.",
  "auth/wrong-password": "Email or password is incorrect.",
  "auth/user-not-found": "Email or password is incorrect.",
  "auth/email-already-in-use": "Unable to create this account. Try signing in or resetting your password.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/weak-password": "Please choose a stronger password.",
  "auth/password-does-not-meet-requirements": "Your password does not meet the account password policy.",
  "auth/too-many-requests": "Too many attempts. Please wait before trying again.",
  "auth/network-request-failed": "Unable to connect. Check your connection and try again.",
  "permission-denied": "You do not have permission to complete this action.",
  unavailable: "The service is temporarily unavailable. Please try again.",
};

export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  return messages[error?.code] || fallback;
}

export function safeReceiptUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "res.cloudinary.com" && !url.username && !url.password
      ? url.href : "";
  } catch {
    return "";
  }
}
