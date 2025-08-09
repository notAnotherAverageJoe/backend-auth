# backend/ Authentication

This project is a MVP(minimum viable product), make your own version of this project, if you get stuck reference this code base for help. It is functional but there are several improvements that can be made, we would like you to discover these issue and make those improvements in your version.

- Use the screenshots in the images folder if you would like a visual of the token and a update route.

## Build a backend API that can interact with a PSQL DB

- There is a schema example for you to use in the schema.sql file at the root of the project
- We want you to build your own backend API implementing registration and logins with the use of middleware
- Encryption is a must for sensitive data, if the user pw = flipsflops1 we want to encryp it with Bcrypt and looks something like this in our DB -> 2b$103$ZO2ws73AdepgB5feGIrfYdQa4fxp.....

# Feel free to change the schema around or the concept of the project, However it must cover these things.

1. users routes that allow registration and login using encrypted passwords using bcrypt, we never want an actual password stored in a DB unless its encrypted.
2. We should be able to update and delete our information as the user, once logged in, ensure we can change the username,password or email through an api call, deletion as well.
3. Instead of using the params for the users id, we should get it from the token like we do for the users other information.
4. Handle errors smoothly for instance

```js
const updateUser = async (req, res) => {
  /// we should request the id from the token instead of the params
  // it would be dangerous to allow someone to use router.patch("/users/:id", updateUser);
  // this would allow someone to keep guessing someones id number once they signed up and change their information.
  //
  const { id } = req.params;
  const { username, email, password } = req.body;
  try {
    const user = await userModels.userChanges(id, {
      username,
      email,
      password,
    });
    // we do check to see if there is a user
    // However we can add a few more checks in here to ensure we handled as many errors as possible.

    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    return res.json({ user });
  } catch (error) {
    console.error("Failed to update user", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
```

5. Routes that need authmiddleware should have it implemented.
