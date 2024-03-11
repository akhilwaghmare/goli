"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, FieldPath, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";

import { createShortlink } from "@/app/actions";

export const LinkFormSchema = z.object({
  slug: z.string().min(1),
  url: z.string().url(),
});

const LinkForm = () => {
  const form = useForm<z.infer<typeof LinkFormSchema>>({
    resolver: zodResolver(LinkFormSchema),
    defaultValues: {
      slug: "",
      url: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LinkFormSchema>) => {
    console.log(values);

    const shortlink = await createShortlink(values.slug, values.url);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 w-96 max-w-4/5"
      >
        <LinkFormField
          name="url"
          label="URL"
          placeholder="https://go.akhil.app"
          formControl={form.control}
        />
        <LinkFormField
          name="slug"
          label="Slug"
          placeholder="resume"
          formControl={form.control}
        />

        <Button type="submit">Shorten link</Button>
      </form>
    </Form>
  );
};

interface LinkFormFieldProps {
  name: FieldPath<z.infer<typeof LinkFormSchema>>;
  label: string;
  placeholder: string;
  description?: string;
  inputType?: string;
  formControl: Control<z.infer<typeof LinkFormSchema>, any>;
}

const LinkFormField: React.FC<LinkFormFieldProps> = ({
  name,
  label,
  placeholder,
  description,
  inputType,
  formControl,
}) => {
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              type={inputType || "text"}
              {...field}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LinkForm;
