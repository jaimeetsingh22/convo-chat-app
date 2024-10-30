// export const POST = async (req, res) => {
//   // Use upload as a middleware
//   // upload.single('avatar')(req,res,next())         ;
//   const formData = await req.formData();
//   const { name, username, password, bio } = Object.fromEntries(formData);
//   console.log(name,bio); 

//   try {
//     await connectToDB();

//     const user = await User.findOne({ username });
//     if (user) {
//       return Response.json({ message: "User already exists" }, { status: 409 });
//     }

//     const avatar = {
//       public_id: "lkjasd",
//       url: "lkjkj",
//     };

//     const hashedPassword = await hash(password, 10);

//     await User.create({
//       name,
//       username,
//       password: hashedPassword,
//       bio,
//       avatar,
//     });

//     return Response.json(
//       { message: "User created successfully" },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.log(error);
//     return Response.json({ message: "Failed to create user" },{status:500});
//   }
// };

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
      CredentialProvider({
        name: "Credentials",
        async authorize(credentials) {
          if (!credentials) {
            throw new Error("No user. Please provide all the fields.");
          }
          const { username, password } = credentials;
  
          await connectToDB();
  
          const user = await User.findOne({ username }).select("+password");
          if (!user) {
            throw new Error("Invalid username or password");
          }
  
          const isValidPassword = compare(password, user.password);
          if (!isValidPassword) {
            throw new Error("Invalid username or password");
          }
  
          return user;
        },
      }),
    ],
    session: {
      strategy: "jwt",
      maxAge: 15 * 24 * 60 * 60, // 15 days
    },
  });
