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

export async function PUT (req: Request) {
  await dbConnect();
  const token = (await cookies()).get("token")?.value || "";

  const { update_name, update_phone, update_street, update_city, update_state, update_zip, add_name, add_phone, add_street, add_city, add_state, add_zip } = await req.json();

  console.log(update_name, update_phone, update_street, update_city, update_state, update_zip, add_name, add_phone, add_street, add_city, add_state, add_zip);
  
  if (!token) {
    return NextResponse.json({ status: 401, message: "Token not found" });
  }

  try {
    const user = await Users.findOne({ token });

    if (!user) {
      return NextResponse.json({ status: 401, message: "User not authenticated" });
    }

    const updateAddress = {
      name: update_name, phone: update_phone, street: update_street,
      city: update_city, state: update_state, zip: update_zip
    };

    const newAddress = {
      name: add_name, phone: add_phone, street: add_street,
      city: add_city, state: add_state, zip: add_zip
    };

    if (Object.values(updateAddress).every(value => value === "")) {
      const checkAddress = user.addresses.some((address: any) =>
        address.name === newAddress.name &&
        address.phone === newAddress.phone &&
        address.street === newAddress.street &&
        address.city === newAddress.city &&
        address.state === newAddress.state &&
        address.zip === newAddress.zip
      );

      if (checkAddress) {
        return NextResponse.json({ status: 409, message: "Address already exists" });
      }

      const updatedUser = await Users.findOneAndUpdate(
        { token },
        { $push: { addresses: {add_name, add_phone, add_street, add_city, add_state, add_zip} } },
        { new: true }
      );

      return NextResponse.json({ status: 200, message: "Address added successfully", data: updatedUser });
    }

    const updatedUser = await Users.findOneAndUpdate(
      { token, "addresses.phone": update_phone },
      { $set: { "addresses.$": {add_name, add_phone, add_street, add_city, add_state, add_zip} } },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ status: 404, message: "Old address not found" });
    }

    return NextResponse.json({ status: 200, message: "Address updated successfully", data: updatedUser });

  } catch (err) {
    return NextResponse.json({ status: 500, message: "Server error", error: err });
  }
};

export const DELETE = async (req: Request) => {
  await dbConnect();
  const token = (await cookies()).get("token")?.value || "";

  const { delete_name, delete_phone, delete_street, delete_city, delete_state, delete_zip } = await req.json();

  if (!token) {
    return NextResponse.json({ status: 401, message: "Token not found" });
  }

  try {
    const user = await Users.findOne({ token });

    if (!user) {
      return NextResponse.json({ status: 401, message: "User not authenticated" });
    }

    const addressToDelete = {
      name: delete_name, phone: delete_phone, street: delete_street,
      city: delete_city, state: delete_state, zip: delete_zip
    };

    const updatedUser = await Users.findOneAndUpdate(
      { token },
      { $pull: { addresses: addressToDelete } },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ status: 404, message: "Address not found" });
    }

    return NextResponse.json({ status: 200, message: "Address deleted successfully", data: updatedUser });

  } catch (err) {
    return NextResponse.json({ status: 500, message: "Server error", error: err });
  }
};