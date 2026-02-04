import { Button, Input, Label } from "@ryugibo/ui";
import { parseZodError, resolveParentPath } from "@ryugibo/utils";
import { useState } from "react";
import { data, Form, redirect } from "react-router";
import z from "zod";
import { Hero } from "~/common/components/hero.tsx";
import InputPair from "~/common/components/input-pair.tsx";
import SelectPair from "~/common/components/select-pair.tsx";
import { createSSRClient } from "~/supabase-client.ts";
import { createProduct } from "../mutations.ts";
import { getCategories } from "../queries.ts";
import type { Route } from "./+types/product-submit-page";

export const meta = () => [
  { title: "Submit Product | wemake" },
  { name: "description", content: "Share your product with the world" },
];

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { pathname } = new URL(request.url);
  const { supabase, getAuthUser, headers } = createSSRClient(request);
  const user = await getAuthUser();
  if (!user) {
    return redirect(resolveParentPath({ pathname, steps: 1 }), { headers });
  }
  const categories = await getCategories({ supabase });
  return data({ categories }, { headers });
};

export const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  tagline: z.string().min(1, "Tagline is required"),
  url: z.url("Invalid URL"),
  description: z.string().min(1, "Description is required"),
  category: z.coerce.number().min(1, "Category is required"),
  how_it_works: z.string().min(1, "How it works is required"),
  icon: z
    .instanceof(File)
    .refine((file) => file.size <= 1024 * 1024 * 2, "File size must be less than 2MB")
    .refine((file) => file.type.startsWith("image/"), "Invalid file type"),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const { pathname } = new URL(request.url);
  const { supabase, getAuthUser, headers } = createSSRClient(request);

  const defaultReturn = {
    data: null,
    formError: null,
    uploadError: null,
  };

  const user = await getAuthUser();
  if (!user) {
    return redirect(resolveParentPath({ pathname, steps: 1 }), { headers });
  }
  const { id: profileId } = user;
  const formData = await request.formData();
  const {
    success: successForm,
    data: dataForm,
    error: formZodError,
  } = formSchema.safeParse(Object.fromEntries(formData));

  if (!successForm) {
    return data({ ...defaultReturn, formError: parseZodError(formZodError) }, { headers });
  }

  const { icon, ...rest } = dataForm;

  const { data: dataUpload, error: errorUpload } = await supabase.storage
    .from("wemake.icons")
    .upload(`${profileId}/${Date.now()}`, icon, { contentType: icon.type });

  if (errorUpload) {
    console.log(errorUpload.message);
    return data(
      {
        ...defaultReturn,
        uploadError: { icon: [{ key: 0, message: "Failed to upload icon" }] },
      },
      { headers },
    );
  }

  const {
    data: { publicUrl: iconUrl },
  } = supabase.storage.from("wemake.icons").getPublicUrl(dataUpload.path);

  const { id } = await createProduct({
    supabase,
    data: {
      name: rest.name,
      tagline: rest.tagline,
      description: rest.description,
      how_it_works: rest.how_it_works,
      icon: iconUrl,
      url: rest.url,
      profile_id: profileId,
      category_id: rest.category,
    },
  });
  return redirect(`/products/${id}`, { headers });
};

export default function ProductSubmitPage({ loaderData, actionData }: Route.ComponentProps) {
  const { categories } = loaderData;
  const [icon, setIcon] = useState<string | null>(null);
  const onChangeIcon = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0];
    if (file) {
      setIcon(URL.createObjectURL(file));
    }
  };
  return (
    <div>
      <Hero title="Submit Your Product" description="Share your product with the world" />
      <Form
        method="post"
        encType="multipart/form-data"
        className="grid grid-cols-2 gap-10 max-w-5xl mx-auto"
      >
        <div className="space-y-5">
          <InputPair
            label="Name"
            description="The name of your product"
            name="name"
            id="name"
            type="text"
            required
            placeholder="Name of your product"
          />
          {actionData?.formError?.name?.map(({ key, message }) => (
            <p key={key} className="text-red-500">
              {message}
            </p>
          ))}
          <InputPair
            label="Tagline"
            description="(60 characters or less)"
            name="tagline"
            id="tagline"
            required
            type="text"
            placeholder="A concise description of your product"
          />
          {actionData?.formError?.tagline?.map(({ key, message }) => (
            <p key={key} className="text-red-500">
              {message}
            </p>
          ))}
          <InputPair
            label="URL"
            description="The URL of your product"
            name="url"
            id="url"
            required
            type="url"
            placeholder="https://example.com"
          />
          {actionData?.formError?.url?.map(({ key, message }) => (
            <p key={key} className="text-red-500">
              {message}
            </p>
          ))}
          <InputPair
            label="Description"
            description="A detailed description of your product"
            name="description"
            id="description"
            required
            placeholder="A detailed description of your product"
            textarea
          />
          {actionData?.formError?.description?.map(({ key, message }) => (
            <p key={key} className="text-red-500">
              {message}
            </p>
          ))}
          <InputPair
            label="How it works"
            description="Step-by-step guide on how your product works"
            name="how_it_works"
            id="how_it_works"
            required
            placeholder="How your product works"
            textarea
          />
          {actionData?.formError?.how_it_works?.map(({ key, message }) => (
            <p key={key} className="text-red-500">
              {message}
            </p>
          ))}
          <SelectPair
            label="Category"
            description="The category of your product"
            name="category"
            required
            placeholder="Select a category"
            options={categories.map((category) => ({
              label: category.name,
              value: `${category.id}`,
            }))}
          />
          {actionData?.formError?.category?.map(({ key, message }) => (
            <p key={key} className="text-red-500">
              {message}
            </p>
          ))}
          <Button type="submit" className="w-full" size="lg">
            Submit
          </Button>
        </div>
        <div className="flex flex-col space-y-2 items-start">
          <div className="size-40 rounded-xl shadow-xl overflow-hidden">
            {icon && <img src={icon} alt="icon-preview" className="w-full h-full object-cover" />}
          </div>
          <Label htmlFor="icon" className="flex flex-col items-start">
            Icon
            <small className="text-muted-foreground">The icon of your product</small>
          </Label>
          <Input
            type="file"
            onChange={onChangeIcon}
            name="icon"
            id="icon"
            required
            className="w-1/2"
          />
          {actionData?.formError?.icon?.map(({ key, message }) => (
            <p key={key} className="text-red-500">
              {message}
            </p>
          ))}
          {actionData?.uploadError?.icon?.map(({ key, message }) => (
            <p key={key} className="text-red-500">
              {message}
            </p>
          ))}
          <div className="flex flex-col text-xs">
            <span className="text-muted-foreground">Recommended size: 128x128</span>
            <span className="text-muted-foreground">Allowed formats: PNG, JPEG</span>
            <span className="text-muted-foreground">Max file size: 2MB</span>
          </div>
        </div>
      </Form>
    </div>
  );
}
