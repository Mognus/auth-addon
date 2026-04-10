"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { authAPI } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { toastError } from "@/lib/api/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

type LoginValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
    redirectTo?: string;
}

export function LoginForm({ redirectTo = "/" }: LoginFormProps) {
    const t = useTranslations("Auth.Login");
    const router = useRouter();
    const { setUser } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<LoginValues>({
        resolver: zodResolver(
            z.object({
                email: z.string().email(t("validation.email")),
                password: z.string().min(1, t("validation.password")),
            })
        ),
        defaultValues: { email: "", password: "" },
    });

    const handleSubmit = async (values: LoginValues) => {
        try {
            const response = await authAPI.login(values);
            setUser(response.user);
            router.replace(redirectTo);
        } catch (err) {
            toastError(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">{t("title")}</CardTitle>
                    <CardDescription>{t("description")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>{t("fields.email")}</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                autoComplete="email"
                                                aria-invalid={!!fieldState.error}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between">
                                            <FormLabel>{t("fields.password")}</FormLabel>
                                            <Link
                                                href="/forgot-password"
                                                className="text-sm text-muted-foreground hover:text-foreground"
                                            >
                                                {t("actions.forgotPassword")}
                                            </Link>
                                        </div>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    autoComplete="current-password"
                                                    aria-invalid={!!fieldState.error}
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword((v) => !v)}
                                                    aria-label={showPassword ? t("a11y.hidePassword") : t("a11y.showPassword")}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                    tabIndex={-1}
                                                >
                                                    {showPassword
                                                        ? <EyeOff className="h-4 w-4" />
                                                        : <Eye className="h-4 w-4" />
                                                    }
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting
                                    ? t("actions.submitting")
                                    : t("actions.submit")}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
