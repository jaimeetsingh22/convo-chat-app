import { User } from "@/models/user";
import { uploadFilesToCloudinary } from "@/utils/cloudinaryWork";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (req, res) => {
  try {
    const formData = await req.formData();
    const { name, username, password, bio } = Object.fromEntries(formData);
    const avatar = formData.get("avatar");

    const errors = [];
    if (!name) errors.push({ field: "name", message: "Please enter name" });
    if (!username) errors.push({ field: "username", message: "Please enter username" });
    if (!password) errors.push({ field: "password", message: "Please enter password" });
    // if (!avatar) errors.push({ field: "avatar", message: "Please add an avatar" });

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }



    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    // if (!(avatar instanceof Blob)) {
    //   return NextResponse.json({ message: "Invalid avatar file or Missing" }, { status: 400 });
    // }
    let avatardata = {};
    if(avatar){
    const fileSizeInBytes = avatar.size;

    const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

    if (fileSizeInMB > 5) {
      return NextResponse.json({ message: "File size should be less than 5MB" }, { status: 400 });
    }

    const arrayBuffer = await avatar.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadFilesToCloudinary([buffer]);

    const avatarData = {
      public_id: result[0].public_id,
      url: result[0].url,
    };
    avatardata = avatarData;
  }
    const hashedPassword = await hash(password, 10);

    await User.create({
      name,
      username,
      password: hashedPassword,
      bio,
      avatar: avatardata,
    });

    return NextResponse.json({ message: "Account created successfully!" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to create user", error: error.message }, { status: 500 });
  }
};
