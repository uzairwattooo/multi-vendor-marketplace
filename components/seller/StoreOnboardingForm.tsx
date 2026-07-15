"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Loader2,
  MapPin,
  ShieldCheck,
  Store,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createStoreSchema,
  type CreateStoreInput,
} from "@/lib/validations/store";
import { createStore } from "@/services/store-service";

type StoreOnboardingFormProps = {
  defaultEmail: string;
};

const categories = [
  "Electronics",
  "Fashion",
  "Home & Living",
  "Beauty & Personal Care",
  "Sports & Fitness",
  "Books & Stationery",
  "Kids & Toys",
  "Food & Grocery",
  "Other",
];

export default function StoreOnboardingForm({
  defaultEmail,
}: StoreOnboardingFormProps) {
  const router = useRouter();

  const form = useForm<CreateStoreInput>({
    resolver: zodResolver(createStoreSchema),

    defaultValues: {
      name: "",
      category: "",
      description: "",
      email: defaultEmail,
      phone: "",
      address: "",
      city: "",
      country: "Pakistan",
    },
  });

  const mutation = useMutation({
    mutationFn: createStore,

    onSuccess: (data) => {
      toast.success(data.message);

      router.push(
        `/seller/onboarding/success?store=${data.store.slug}`,
      );

      router.refresh();
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to submit store application",
      );
    },
  });

  function handleSubmit(values: CreateStoreInput) {
    mutation.mutate(values);
  }

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-8"
    >
      {/* Basic information */}
      <section className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
        <SectionTitle
          icon={Store}
          title="Store information"
          description="Enter the basic information customers will see on your store."
        />

        <div className="mt-7 grid gap-6 md:grid-cols-2">
          <FormField
            label="Store name"
            htmlFor="name"
            error={form.formState.errors.name?.message}
          >
            <Input
              id="name"
              placeholder="e.g. Uzair Tech Store"
              {...form.register("name")}
            />
          </FormField>

          <FormField
            label="Store category"
            htmlFor="category"
            error={form.formState.errors.category?.message}
          >
            <select
              id="category"
              {...form.register("category")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <option value="">Select a category</option>

              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>
          </FormField>

          <div className="md:col-span-2">
            <FormField
              label="Store description"
              htmlFor="description"
              error={
                form.formState.errors.description?.message
              }
            >
              <Textarea
                id="description"
                rows={6}
                placeholder="Describe your products, customers and what makes your store different."
                {...form.register("description")}
              />

              <div className="mt-2 flex justify-end">
                <span className="text-xs text-muted-foreground">
                  {form.watch("description")?.length || 0}/1000
                </span>
              </div>
            </FormField>
          </div>
        </div>
      </section>

      {/* Contact information */}
      <section className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
        <SectionTitle
          icon={Building2}
          title="Business contact"
          description="This information will be used for store communication."
        />

        <div className="mt-7 grid gap-6 md:grid-cols-2">
          <FormField
            label="Business email"
            htmlFor="email"
            error={form.formState.errors.email?.message}
          >
            <Input
              id="email"
              type="email"
              placeholder="store@example.com"
              {...form.register("email")}
            />
          </FormField>

          <FormField
            label="Phone number"
            htmlFor="phone"
            error={form.formState.errors.phone?.message}
          >
            <Input
              id="phone"
              type="tel"
              placeholder="03001234567"
              {...form.register("phone")}
            />
          </FormField>
        </div>
      </section>

      {/* Address */}
      <section className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
        <SectionTitle
          icon={MapPin}
          title="Business address"
          description="Provide the primary location from where your store operates."
        />

        <div className="mt-7 grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <FormField
              label="Complete address"
              htmlFor="address"
              error={form.formState.errors.address?.message}
            >
              <Input
                id="address"
                placeholder="Street, area and nearby landmark"
                {...form.register("address")}
              />
            </FormField>
          </div>

          <FormField
            label="City"
            htmlFor="city"
            error={form.formState.errors.city?.message}
          >
            <Input
              id="city"
              placeholder="e.g. Sargodha"
              {...form.register("city")}
            />
          </FormField>

          <FormField
            label="Country"
            htmlFor="country"
            error={form.formState.errors.country?.message}
          >
            <select
              id="country"
              {...form.register("country")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <option value="Pakistan">Pakistan</option>
            </select>
          </FormField>
        </div>
      </section>

      {/* Notice and submit */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />

          <div>
            <h3 className="font-semibold">
              Application review
            </h3>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Your store will remain pending until an administrator
              reviews and approves the application.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          You can add your logo and banner after approval.
        </p>

        <Button
          type="submit"
          size="lg"
          disabled={mutation.isPending}
          className="min-w-52"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Submitting application...
            </>
          ) : (
            <>
              Submit application
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
};

function FormField({
  label,
  htmlFor,
  error,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>
        {label}
      </Label>

      {children}

      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

type SectionTitleProps = {
  icon: React.ElementType;
  title: string;
  description: string;
};

function SectionTitle({
  icon: Icon,
  title,
  description,
}: SectionTitleProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>

      <div>
        <h2 className="text-lg font-semibold">
          {title}
        </h2>

        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}