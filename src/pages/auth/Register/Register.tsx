import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpWithCredentials } from "@/firebase/credentialsAuth";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ButtonLoading } from "@/components/ui/loadingButton";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { GoogleAuth } from "../GoogleAuth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { handleExtLogin } from "@/lib/helpers/extensionAuth";

const registrationSchema = z.object({
  name: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .min(1, "Password is required"),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isHidden, setIsHidden] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const queryParams = new URLSearchParams(location.search);
  const isExtensionAuth = queryParams.get("extensionAuth") ?? "";

  //
  useEffect(() => {
    if (isExtensionAuth && isAuthenticated) return window.close();
  }, [isAuthenticated, isExtensionAuth, location.search]);

  useEffect(() => {}, [isAuthenticated]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  // Handle form submission
  const onSubmit = async (data: RegistrationFormData) => {
    setIsLoading(true);

    try {
      const userCredential = await signUpWithCredentials(
        data.email,
        data.password,
      );

      if (userCredential) {
        toast({ title: "Signin successfully" });
        return navigate("/");
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
        });
      }
    } catch (error) {
      const err = error as Error;
      toast({
        variant: "destructive",
        title: err.message.replace(/Firebase|auth|\(|\)/g, ""),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle password visibility
  const togglePassword = () => {
    setIsHidden((prev) => !prev);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="Max" {...register("name")} />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={isHidden ? "text" : "password"}
                    placeholder="******"
                    {...register("password")}
                  />
                  {isHidden ? (
                    <AiOutlineEyeInvisible
                      className="absolute right-3 top-[10px] cursor-pointer text-black dark:text-white"
                      onClick={togglePassword}
                    />
                  ) : (
                    <AiOutlineEye
                      className="absolute right-3 top-[10px] cursor-pointer text-black dark:text-white"
                      onClick={togglePassword}
                    />
                  )}
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {isLoading ? (
                <ButtonLoading />
              ) : (
                <Button type="submit" className="w-full">
                  Create an account
                </Button>
              )}

              <GoogleAuth
                callBack={async (uid: string) => {
                  await handleExtLogin(uid).then(() => navigate("/"));
                }}
                text="Sign up with Google"
              />
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/auth/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
