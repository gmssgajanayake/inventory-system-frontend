import {getUserInfo} from "@/lib/actions";

export default async function Dashboard() {

    const data = await getUserInfo();
    console.log(data)

    return (
        <div>
            <h1>Protected Dashboard</h1>
            <p>Only visible to authenticated users</p>

        </div>
    );
}