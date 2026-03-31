## 1. Register / Signup Controller(POST)

- First check if the user exists in the database
  if so, return a response saying it already exists.

- If the user doesn't exist:
  i. Hash the password
  ii. Create the user
  ii. Lastly generate a jwt token.

## 2. Login / sign in Controller(POST)

- Check if the user email exists in the table:
  if the user doesn't exist: return a generic message 'Invalid email or password'

- If the user exists, verify the password:
  i. If not return a generic message again
  ii. If the password is valid, generate a jwt token

## 3. Logout / sign out Controller(POST)

- You set the token to an empty string
- And return an appropriate response

## 4. Generating a token using jason web tokens

- Takes userId and res as parameters.
- token = jwt.sign(userId, secret_key, {expires_in: })
- After storing the token in the cookie
- return the token

## 5. Secure way of storing data in cookies

res.cookie("jwt", token, {
httpOnly: true,
secure: process.env.NODE_ENV === "production",
sameSite: "strict",
maxAge: 1000 _ 60 _ 60 _ 24 _ 7,
});
