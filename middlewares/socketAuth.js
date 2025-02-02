import { decode } from "next-auth/jwt";


const socketAuthenticator = async (err, socket, next) => {
  try {
    if (err) {
      console.log("error of socket",err)
      return next(err);
    }
    // const nextAuthToken = socket.request.cookies["__Secure-authjs.session-token"]; // for production
    const nextAuthToken = socket.request.cookies["authjs.session-token"];// for development
    if (!nextAuthToken) {
      return next(
       Response.json(
          {
            error: "Unauthorized",
            message: "please login to access this",
          },
          { status: 401 }
        )
      );
    }

    const decodedData = await decode({
      token: nextAuthToken,
      // salt: "authjs.session-token",// for development
      salt: "__Secure-authjs.session-token",// for production
      secret: process.env.AUTH_SECRET,
    });
    if (!decodedData) {
      return next(
        Response.json(
          {
            error: "Unauthorized",
            message: "please login to access this",
          },
          { status: 401 }
        )
      );
    }
    socket.user = decodedData;
    return next();

  } catch (error) {
    console.log(error.message);
    return next(new Error("Authentication error check server logs"));
  }
};

export { socketAuthenticator };
