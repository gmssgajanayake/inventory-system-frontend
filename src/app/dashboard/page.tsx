import {getUserInfo} from "@/lib/actions";
import AOSWrapper from "@/app/_components/AOSWrapper";


function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function Dashboard() {

    await delay(500)

    const data = await getUserInfo();


    console.log(data)

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

            <div className="w-full flex flex-col gap-6 p-6 mt-6 ">
                <h3 className={" font-extrabold text-gray-200"}>
                    Admin Role Description :
                </h3>
                <p className={" font-extralight text-gray-200"}>


                    As Admin, you have full control of the system—managing users, data, settings, and activities. Use
                    this authority responsibly, as all changes you make are under your accountability
                </p>
            </div>

        </div>


    );
}