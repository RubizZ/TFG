import AuthLayout from "@/components/layout/AuthLayout";
import AuthCard from "@/components/ui/AuthCard";
import { JSX } from "react";

export default function ForgotPassword(): JSX.Element {
    return (
        <AuthLayout>
            <AuthCard>
                <h1>Forgot Password</h1>
            </AuthCard>
        </AuthLayout>
    )
}