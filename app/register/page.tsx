"use client";

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { TruckIcon, UserPlus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useAuth } from "@/components/auth-context";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "+233",
    accountType: "individual",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    marketingConsent: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, loading, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/client/dashboard");
    }
  }, [user, loading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePhoneCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    let number = formData.phone.replace(/^\+233|^\+1/, "");
    setFormData((prev) => ({ ...prev, phone: code + number }));
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = formData.phone.startsWith("+233") ? "+233" : "+1";
    setFormData((prev) => ({
      ...prev,
      phone: code + e.target.value.replace(/[^0-9]/g, ""),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all required fields");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!formData.agreeTerms) {
      setError("You must accept the Terms of Service to continue");
      return;
    }
    setIsLoading(true);
    try {
      // Call your registration API
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.firstName + " " + formData.lastName,
          rememberMe: formData.agreeTerms, // or another checkbox for rememberMe
          // phone: formData.phone, // Uncomment if you want to send phone
          // accountType: formData.accountType, // Uncomment if you want to send account type
          // marketingConsent: formData.marketingConsent, // Uncomment if you want to send marketing consent
        }),
      });
      if (res.ok) {
        // Optionally, call login to hydrate user state
        await login(formData.email, formData.password, formData.agreeTerms);
        router.push("/client/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  if (user) return null;

  return (
    <div className="flex mt-10 min-h-screen flex-col">
      <Navbar />
      <main
        className="flex-1 flex items-center justify-center px-4 py-12 bg-cover bg-center bg-no-repeat"
        style={{
          minHeight: "calc(100vh - 140px)",
          backgroundImage: "url('/login.jpg')",
        }}
      >
        <div className="w-full max-w-6xl mx-auto">
          <Card className="border-0 shadow-xl overflow-hidden rounded-2xl grid md:grid-cols-2">
            {/* Left side - Image */}
            <div className="relative h-64 md:h-full">
              <Image
                src="/deliver-man.jpg"
                alt="Logistics background"
                className="object-cover object-center"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-red-700/40 to-red-900/40 mix-blend-multiply" />
              {/* <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6">
                <TruckIcon size={48} className="mb-4" />
                <h2 className="text-3xl font-bold text-center mb-2">Join Our Network</h2>
                <p className="text-lg text-center max-w-xs">Create an account and experience premium delivery services</p>
              </div> */}
            </div>

            {/* Right side - Registration Form */}
            <div className="p-6 md:p-8 bg-white dark:bg-slate-800 overflow-y-auto max-h-screen">
              <CardHeader className="px-0 pb-4">
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">
                  Create Account
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  Get started with your personal account
                </CardDescription>
              </CardHeader>

              <CardContent className="px-0">
                {error && (
                  <Alert
                    variant="destructive"
                    className="mb-4 bg-red-50 dark:bg-red-900/20"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="first-name"
                        className="text-slate-700 dark:text-slate-200"
                      >
                        First Name *
                      </Label>
                      <Input
                        id="first-name"
                        name="firstName"
                        type="text"
                        placeholder="John"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="last-name"
                        className="text-slate-700 dark:text-slate-200"
                      >
                        Last Name *
                      </Label>
                      <Input
                        id="last-name"
                        name="lastName"
                        type="text"
                        placeholder="Doe"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-slate-700 dark:text-slate-200"
                    >
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-slate-700 dark:text-slate-200"
                    >
                      Phone Number
                    </Label>
                    <div className="flex gap-2">
                      <select
                        id="country-code"
                        className="h-10 rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 text-slate-700 dark:text-slate-200"
                        value={
                          formData.phone.startsWith("+233") ? "+233" : "+1"
                        }
                        onChange={handlePhoneCodeChange}
                        style={{ minWidth: 100 }}
                      >
                        <option value="+233">🇬🇭 +233</option>
                        <option value="+1">🇺🇸 +1</option>
                      </select>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="(555) 000-0000"
                        className="flex-1 bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                        value={formData.phone.replace(/^\+233|^\+1/, "")}
                        onChange={handlePhoneNumberChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-slate-700 dark:text-slate-200"
                    >
                      Password *
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirm-password"
                      className="text-slate-700 dark:text-slate-200"
                    >
                      Confirm Password *
                    </Label>
                    <Input
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            agreeTerms: !!checked,
                          }))
                        }
                        className="mt-1 text-red-600 dark:text-red-500 border-slate-300 dark:border-slate-500"
                      />
                      <Label
                        htmlFor="terms"
                        className="text-sm text-slate-600 dark:text-slate-300"
                      >
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className="text-red-600 hover:underline font-medium dark:text-red-400"
                        >
                          Terms of Service
                        </Link>{" "}
                        *
                      </Label>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="marketing"
                        checked={formData.marketingConsent}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            marketingConsent: !!checked,
                          }))
                        }
                        className="mt-1 text-red-600 dark:text-red-500 border-slate-300 dark:border-slate-500"
                      />
                      <Label
                        htmlFor="marketing"
                        className="text-sm text-slate-600 dark:text-slate-300"
                      >
                        I agree to receive marketing communications from your
                        company
                      </Label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-red-600 hover:bg-red-700 transition-all text-white shadow-md"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="inline-block w-5 h-5 border-2 border-red-300 border-t-transparent rounded-full animate-spin" />
                        Creating account...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <UserPlus className="w-5 h-5" />
                        Create Account
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4 pt-2 px-0">
                <Separator className="my-2 bg-slate-200 dark:bg-slate-700" />
                <div className="text-sm text-center w-full text-slate-600 dark:text-slate-300">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-red-600 hover:underline font-semibold dark:text-red-400"
                  >
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
