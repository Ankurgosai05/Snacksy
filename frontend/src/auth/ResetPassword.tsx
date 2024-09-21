import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/useUserStore";
import { Loader2, LockKeyholeIcon, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false); // State for password visibility
    const { token } = useParams<{ token: string }>();
    const { loading, resetPassword } = useUserStore();
    const navigate = useNavigate();

    const togglePasswordVisibility = () => setShowPassword(!showPassword); // Toggle function

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            toast.error("Invalid or missing token");
            return;
        }
        try {
            await resetPassword(token, newPassword); // Call the function from your store
            toast.success("Password has been reset successfully");
            navigate('/login'); // Redirect to login after successful reset
        } catch (error) {
            toast.error("Failed to reset password");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen w-full">
            <form onSubmit={handleResetPassword} className="flex flex-col gap-5 md:p-8 w-full max-w-md rounded-lg mx-4">
                <div className="text-center">
                    <h1 className="font-extrabold text-2xl mb-2">Reset Password</h1>
                    <p className="text-sm text-gray-600">Enter your new password to reset the old one</p>
                </div>
                <div className="relative w-full">
                    <Input
                        type={showPassword ? "text" : "password"} // Change input type based on state
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter your new password"
                        className="pl-10"
                    />
                    <LockKeyholeIcon className="absolute inset-y-2 left-2 text-gray-600 pointer-events-none" />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-2 right-2 text-gray-600 focus:outline-none"
                    >
                        {showPassword ? <EyeOff /> : <Eye />} {/* Toggle icon */}
                    </button>
                </div>
                {loading ? (
                    <Button disabled className="bg-green-600">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                    </Button>
                ) : (
                    <Button className="bg-green-600">Reset Password</Button>
                )}
                <span className="text-center">
                    Back to <Link to="/login" className="text-blue-500">Login</Link>
                </span>
            </form>
        </div>
    );
};

export default ResetPassword;
