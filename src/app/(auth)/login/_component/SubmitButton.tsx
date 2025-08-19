import {useFormStatus} from "react-dom";

export default function SubmitButton() {
    const {pending} = useFormStatus();

    return (
        <button
            className={`
                text-xl text-white bg-purple-600 cursor-pointer rounded-xl py-3 mt-4 w-full
                transition-all duration-300 ease-in-out
                hover:bg-purple-700 hover:scale-105
                active:scale-95
                disabled:opacity-70 disabled:cursor-not-allowed
            `}
            type="submit"
            disabled={pending}
        >
            {pending ? 'Logging in...' : 'Login'}
        </button>
    );
}
