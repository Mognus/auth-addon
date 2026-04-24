"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { authAPI } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { toastError } from "@/lib/api/toast";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/addons/ui-core-addon/frontend/components/card";
import { FloatingInput } from "@/addons/ui-core-addon/frontend/components/floating-input";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

type LoginValues = z.infer<typeof loginSchema>;

export interface LoginFormStyle {
    card?: string;
    title?: string;
    description?: string;
    input?: string;
    forgotPassword?: string;
    button?: string;
}

interface LoginFormProps {
    redirectTo?: string;
    style?: LoginFormStyle;
}

export function LoginForm({ redirectTo = "/", style = {} }: LoginFormProps) {
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
        <Card className={style.card ?? "w-full max-w-md border rounded-lg p-6 space-y-6"}>
            <div className="space-y-1">
                <CardTitle className={style.title}>{t("title")}</CardTitle>
                <CardDescription className={style.description}>{t("description")}</CardDescription>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormControl>
                                    <FloatingInput
                                        label={t("fields.email")}
                                        type="email"
                                        autoComplete="email"
                                        aria-invalid={!!fieldState.error}
                                        className={style.input}
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
                                <FormControl>
                                    <FloatingInput
                                        label={t("fields.password")}
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        aria-invalid={!!fieldState.error}
                                        className={style.input}
                                        action={
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((v) => !v)}
                                                aria-label={showPassword ? t("a11y.hidePassword") : t("a11y.showPassword")}
                                                className="text-muted-foreground hover:text-foreground"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        }
                                        {...field}
                                    />
                                </FormControl>
                                <Link
                                    href="/forgot-password"
                                    className={style.forgotPassword ?? "text-sm text-muted-foreground hover:text-foreground"}
                                >
                                    {t("actions.forgotPassword")}
                                </Link>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className={style.button ?? "w-full"}
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? t("actions.submitting") : t("actions.submit")}
                    </Button>
                </form>
            </Form>
        </Card>
    );
}
