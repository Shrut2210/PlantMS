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

export const PUT = async (req : Request, res : Response) => {
  await dbConnect();
  const token = (await cookies()).get("token")?.value || "";

  const { name, phone, street, city, state, postalCode, country } = await req.json();

  if (!token) {
    return NextResponse.json({ status: 401, message: "Token not found" });
  }

  try {
    const user = await Users.findOne({ token });

    if (!user) {
        return NextResponse.json({ status: 401, message: "User not authenticated" });
    }

    const addressExists = user.addresses.some((addr:any) =>
        addr.name == name &&
        addr.phone == phone &&
        addr.street == street &&
        addr.city == city &&
        addr.state == state &&
        addr.postalCode == postalCode &&
        addr.country == country
    );

    if (addressExists) {
        return NextResponse.json({ status: 409, message: "Address already exists" });
    }

    const updatedUser = await Users.findOneAndUpdate(
        { token },
        { $push: { addresses: { name, phone, street, city, state, postalCode, country } } },
        { new: true } 
    );

    return NextResponse.json({ status: 200, message: "Address added successfully", data: updatedUser });

} catch (err) {
    return NextResponse.json({ status: 500, message: "Server error", error: err });
}

}
