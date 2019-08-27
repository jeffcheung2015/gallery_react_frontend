export const BASE_URL = "http://localhost:8000"
export const routeName = {
  HOME : "/",
  LOGIN : "/login",
  SIGNUP : "/signup",
  PROFILE : "/profile",
  UPLOAD : "/upload"
}

export const urlPathToTitle = {
  "/" : "Gallery",
  "/login" : "Login",
  "/signup" : "Sign up",
  "/profile" : "Profile",
  "/upload" : "Upload"
}
export const respCodes = {
  SUCCESS_REQ: "00000",
  UNEXPECTED_SERVER_ERROR: "99999",
  INVALID_INPUTS: "00001",
  DUP_CRED: "00002",
  USER_NOT_EXIST: "00003",
  INVALID_CRED: "00004",
  USERID_NOT_FOUND: "00005",
  PASSWORD_LT_8: "00006",
  SIGNUP_EMAIL_INVALID: "00007",
  UPLOAD_FAIL: "00011",
  NO_USER_OWNED_IMAGE: "00012",
  DELETE_IMAGE_FAIL: "00013"
}

export const respCodeToMsg = {
  "00000": "Successful Request",
  "99999": "Unexpected server error occurs",
  "00001": "Some user input fields are invalid",
  "00002": "Username or email are duplicated",
  "00003": "User doesn't exist",
  "00004": "User password is incorrect",
  "00005": "User Id not found",
  "00006": "User password must be greater than 8",
  "00007": "Invalid email address",
  "00011": "Image name or image descriptions are empty or unexpected upload error.",
  "00012": "No images owned by that user.",
  "00013": "Delete image fail unexpectedly."
}
