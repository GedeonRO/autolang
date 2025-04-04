import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { logoutFirebase } from "@/firebase/credentialsAuth";
import { FirebaseAuth as auth } from "@/firebase/config";
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ButtonLoading } from "../ui/loadingButton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export function AlertLogoutDialog({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleResetCookies = () => logout();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      // logout
      const isLogout: unknown = await logoutFirebase(handleResetCookies);

      if (isLogout) {
        setIsLoading(false);

        toast({ title: "You have been logged out successfully" });
      }
    } catch (error) {
      const err = error as Error;
      console.log(err.message);
      const errorMsg = err.message
        .replace("Firebase:", "")
        .replace("Error", "")
        .replace("(", "")
        .replace(")", "")
        .replace("auth", "")
        .replace("/", "");

      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: errorMsg || "There was a problem with your request.",
      });
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) navigate("/auth/login");
    });
  }, [navigate]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Logging out will end your current
            session.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {isLoading ? (
            <ButtonLoading />
          ) : (
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-400"
              onClick={handleLogout}
            >
              Continue
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
