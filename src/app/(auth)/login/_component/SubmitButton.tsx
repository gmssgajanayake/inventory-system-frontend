import {useFormStatus} from "react-dom";

export  default function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button type="submit" disabled={pending}>
            {pending ? 'Logging in...' : 'Login'}
        </button>
    );
}