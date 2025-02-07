import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";
import { Users } from "@/model/users";

export async function GET() {
  await dbConnect();

  const token = (await cookies()).get("token")?.value || "";
  console.log(token);
  

  if (!token) {
    return NextResponse.json({ status: 401, message: "Token not found" });
  }

  try {
    const user = await Users.findOne({ token });

    if (user) {
      return NextResponse.json({
        status: 200,
        message: "User authenticated",
        data: user,
      });
    } else {
      return NextResponse.json({ status: 401, message: "User not authenticated" });
    }
  } catch (err) {
    return NextResponse.json({ status: 500, message: "Server error", error: err });
  }
}
