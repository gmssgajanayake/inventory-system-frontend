import {getUserInfo} from "@/lib/actions";


function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function Dashboard() {

    await delay(500)

    const data = await getUserInfo();
    console.log(data)

    return (
        <div className={""}>
            <h1>Protected Dashboard</h1>
            <p>Only visible to authenticated users</p>
        </div>
    );
}