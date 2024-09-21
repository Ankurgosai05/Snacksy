import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import axios from "axios";
import { LoginInputState, SignupInputState } from "@/schema/userSchema";
import { toast } from "sonner";

const API_END_POINT = "http://localhost:5000/api/v1/user";
axios.defaults.withCredentials = true;

type User = {
    fullname: string;
    email: string;
    contact: number;
    address: string;
    city: string;
    country: string;
    profilePicture: string;
    admin: boolean;
    isVerified: boolean;
};

type UserState = {
    user: User | null;
    isAuthenticated: boolean;
    isCheckingAuth: boolean;
    loading: boolean;
    signUp: (input: SignupInputState) => Promise<void>;
    login: (input: LoginInputState) => Promise<void>;
    verifyEmail: (verificationCode: string) => Promise<void>;
    checkAuthentication: () => Promise<void>;
    logout: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (token: string, newPassword: string) => Promise<void>;
    updateProfile: (input: any) => Promise<void>;
};

export const useUserStore = create<UserState>()(
    devtools(
        persist(
            (set) => ({
                user: null,
                isAuthenticated: false,
                isCheckingAuth: true,
                loading: false,
                signUp: async (input: SignupInputState) => {
                    console.log("signUp called");
                    try {
                        set({ loading: true });
                        const response = await axios.post(`${API_END_POINT}/signup`, input, {
                            headers: { 'Content-Type': 'application/json' },
                        });
                        if (response.data.success) {
                            toast.success(response.data.message);
                            set({ user: response.data.user, isAuthenticated: true });
                            return; // Indicate success
                        } else {
                            toast.error(response.data.message || "Sign-up failed");
                            throw new Error(response.data.message || "Sign-up failed"); // Throw an error if not successful
                        }
                    } catch (error: any) {
                        toast.error(error.response?.data?.message || "An error occurred");
                        throw error;
                    } finally {
                        set({ loading: false });
                    }
                },
                login: async (input: LoginInputState) => {
                    try {
                        set({ loading: true });
                        const response = await axios.post(`${API_END_POINT}/login`, input, {
                            headers: { 'Content-Type': 'application/json' },
                        });
                        if (response.data.success) {
                            toast.success(response.data.message);
                            set({ loading: false, user: response.data.user, isAuthenticated: true });
                            return; // Indicate success
                        } else {
                            toast.error(response.data.message || "Login failed");
                            throw new Error(response.data.message || "Login failed"); // Throw an error if not successful
                        }
                    } catch (error: any) {
                        toast.error(error.response?.data?.message || "An error occurred");
                        set({ loading: false });
                        throw error; // Re-throw error to be caught in component
                    }
                },
                
                verifyEmail: async (verificationCode: string) => {
                    try {
                        set({ loading: true });
                        const response = await axios.post(`${API_END_POINT}/verify-email`, { verificationCode }, {
                            headers: { 'Content-Type': 'application/json' },
                        });
                        if (response.data.success) {
                            toast.success(response.data.message);
                            set({ loading: false, user: response.data.user, isAuthenticated: true });
                            return; // Indicate success
                        } else {
                            toast.error(response.data.message || "Verification failed");
                            throw new Error(response.data.message || "Verification failed"); // Throw an error if not successful
                        }
                    } catch (error: any) {
                        toast.error(error.response?.data?.message || "An error occurred");
                        set({ loading: false });
                        throw error; // Re-throw error to be caught in component
                    }
                },
                
                checkAuthentication: async () => {
                    try {
                        set({ isCheckingAuth: true });
                        const response = await axios.get(`${API_END_POINT}/check-auth`);
                        if (response.data.success) {
                            set({
                                user: response.data.user,
                                isAuthenticated: true,
                                isCheckingAuth: false
                            });
                        } else {
                            // Handle the case where the response is not successful but no error was thrown
                            set({ isAuthenticated: false, isCheckingAuth: false });
                        }
                    } catch (error: any) {
                        // Handle errors that occur during the API request
                        set({ isAuthenticated: false, isCheckingAuth: false });
                        console.error("Authentication check failed:", error); // Optional: log the error for debugging
                    }
                },
                
                logout: async () => {
                    try {
                        set({ loading: true });
                        const response = await axios.post(`${API_END_POINT}/logout`);
                        if (response.data.success) {
                            toast.success(response.data.message);
                            set({ loading: false, user: null, isAuthenticated: false });
                        }
                    } catch (error: any) {
                        toast.error(error.response.data.message);
                        set({ loading: false });

                    }
                },
                forgotPassword: async (email: string) => {
                    try {
                        set({ loading: true }); // Set loading state to true while making the request
                        const response = await axios.post(`${API_END_POINT}/forgot-password`, { email });
                        if (response.data.success) {
                            toast.success(response.data.message); // Show success message
                            set({ loading: false }); // Reset loading state
                        } else {
                            toast.error(response.data.message || "Password reset request failed"); // Handle unsuccessful response
                            set({ loading: false }); // Reset loading state
                            throw new Error(response.data.message || "Password reset request failed"); // Throw an error if not successful
                        }
                    } catch (error: any) {
                        toast.error(error.response?.data?.message || "An error occurred"); // Show error message
                        set({ loading: false }); // Reset loading state
                        throw error; // Re-throw error to be caught in component
                    }
                },
                
                resetPassword: async (token: string, newPassword: string) => {
                    try {
                        set({ loading: true }); // Set loading state to true while making the request
                        const response = await axios.post(`${API_END_POINT}/reset-password/${token}`, { newPassword });
                        if (response.data.success) {
                            toast.success(response.data.message); // Show success message
                        } else {
                            toast.error(response.data.message || "Password reset failed"); // Show error message
                            throw new Error(response.data.message || "Password reset failed"); // Throw an error if not successful
                        }
                    } catch (error: any) {
                        toast.error(error.response?.data?.message || "An error occurred"); // Show error message
                        throw error; // Re-throw error to be caught in component
                    } finally {
                        set({ loading: false }); // Always reset loading state
                    }
                },
                
                
                updateProfile: async (input: any) => {
                    try {
                        
                        const response = await axios.put(`${API_END_POINT}/profile/update`, input, {
                            headers: { 'Content-Type': 'application/json' },
                        });
                        if (response.data.success) {
                            toast.success(response.data.message); // Show success message
                            set({ user: response.data.user, isAuthenticated: true }); // Update user state
                        } else {
                            toast.error(response.data.message || "Profile update failed"); // Handle unsuccessful response
                            throw new Error(response.data.message || "Profile update failed"); // Throw an error if not successful
                        }
                    } catch (error: any) {
                        toast.error(error.response?.data?.message || "An error occurred"); // Show error message
                        throw error; // Re-throw error to be caught in component
                    } 
                },
                
            }),
            {
                name: 'user-store',
                storage: createJSONStorage(() => localStorage),
            }
        )
    )
);
