import dbConnect from "@/lib/mongodb";
import { Users } from "@/model/users";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async (req: Request, res: NextResponse) => {

    await dbConnect();

    try 
    {
        const jwt = (await cookies()).get('token')

        if(!jwt || jwt == undefined) 
        {
            return NextResponse.json(
                { 
                    message: 'No token found' ,
                    status: 401,
                    function_name : 'Logout_user'
                }
            )
        }

        const user = await Users.findOne({token : jwt.value})

        if(!user)
        {
            return NextResponse.json(
                { 
                    message: 'Invalid token' ,
                    status: 401,
                    function_name : 'Logout_user'
                }
            )
        }

        (await cookies()).delete('jwt');
        (await cookies()).delete('token');

        user.token = ""
        await user.save();

        return NextResponse.json(
            {
                message: 'Logged out successfully',
                status: 200,
                function_name : 'Logout_user'
            }
        )
    }
    catch (error)
    {
        return NextResponse.json(
            {
                message: 'An error occurred while logging out',
                status: 500,
                function_name : 'Logout_user',
                error : error
            }
        )
    }
}