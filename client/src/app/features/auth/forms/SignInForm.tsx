import { useLocation, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUpFormSchema } from "@/lib/validations";
import ActionPrompt from "@/components/ui/action-prompt";
import { useLoginMutation } from "../authApi";
import { useAppDispatch } from "@/app/hooks";
import { receivedToken } from "../authSlice";

const SignInForm = () => {
  const [loginMutation, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signUpFormSchema>) {
    loginMutation(values)
      .unwrap()
      .then((response) => {
        dispatch(receivedToken({ access_token: response.access_token }));
        console.log(response);
        navigate("/", { state: { from: location } });
      })
      .catch((error) => {
        console.error(error.data.message);
      });
  }

  return (
    <Form {...form}>
      <div className="w-full max-w-lg space-y-8 rounded-xl border border-border px-6 py-8">
        <div className="text-center">
          <h1>Sign In</h1>
          <p>Welcome back to Intelliger</p>
        </div>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center gap-y-4"
        >
          <div className="w-full space-y-4">
            <FormField
              control={form.control}
              name="usernameOrEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username or email</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <ActionPrompt
            question="Don't have an account?"
            answer="Sign up"
            route="/sign-up"
          />
          <Button
            disabled={isLoading}
            size="lg"
            type="submit"
            className="w-full"
          >
            {isLoading ? "Loading..." : "Sign in"}
          </Button>
          <ActionPrompt
            question="Forgot password?"
            answer="Reset"
            route="/forgot-password"
          />
        </form>
      </div>
    </Form>
  );
};

export default SignInForm;
