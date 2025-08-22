import {getUserInfo} from "@/lib/actions";


function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function Dashboard() {

    await delay(500)

    const data = await getUserInfo();


    return (

        <div>
            <div className={"w-full flex rounded-xl flex-col gap-4 md:gap-6 p-6 bg-[#05070A]"}>
                <div
                    className="rounded-2xl flex justify-between items-center bg-gray-300/5 backdrop-blur-md border border-white/10 shadow-xl p-4">
                    <p>Hi {data?.username}, welcome to your dashboard!</p>
                </div>

                <div
                    className="w-full flex gap-y-4 md:flex-row flex-col md:gap-y-0 md:gap-x-6 justify-center md:justify-between items-center">
                    <div
                        className="rounded-2xl w-full md:w-1/2 flex justify-between items-center bg-gray-300/5 backdrop-blur-md border border-white/10 shadow-xl p-4 md:p-6">
                        <p>ID Number : {data?.id}</p>
                    </div>
                    <div
                        className="rounded-2xl w-full md:w-1/2 flex justify-between items-center bg-gray-300/5 backdrop-blur-md border border-white/10 shadow-xl p-4 md:p-6">
                        <p>Your Role : {data?.role}</p>
                    </div>
                </div>

            </div>
            {
                data?.role === "ADMIN" && (
                    <div className="w-full flex flex-col gap-6 p-6 mt-6 bg-gray-300/5 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl">
                        <h3 className={" font-extrabold text-gray-200"}>
                            Admin Role Description :
                        </h3>
                        <p className={" font-extralight text-gray-200"}>
                            As Admin, you have full control of the system—managing users, data, settings, and activities.
                            Use this authority responsibly, as all changes you make are under your accountability
                        </p>
                    </div>
                )
                ||
                data?.role === "USER" && (
                    <div className="w-full flex flex-col gap-6 p-6 mt-6 bg-gray-300/5 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl">
                        <h3 className={" font-extrabold text-gray-200"}>
                            User Role Description :
                        </h3>
                        <p className={" font-extralight text-gray-200"}>
                            As a User, you have access to view and manage items, but you cannot modify system-wide
                            settings or manage other users. Your actions are limited to your own account.
                        </p>
                    </div>
                )
            }
        </div>


    );
}