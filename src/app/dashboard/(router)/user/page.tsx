import {getAllUsers} from "@/lib/actions";

export default async function User(){

    const allUsers = await getAllUsers()

    console.log(allUsers);

    return(
        <div>
            User Manage Dashboard
        </div>
    );
}