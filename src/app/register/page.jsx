"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  Button,
  Description,
  FieldError,
  Fieldset,
  Form,
  Input,
  Label,
  Surface,
  ListBox,
  Select,
  TextField,
} from "@heroui/react";
import { imageUploader } from "@/lib/imageUpload";

export default function SignUpPage() {
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const imageFile = formData.get("image");
const image = await imageUploader(imageFile);

    const user = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      image: image.url,
      role: formData.get("role"),
      plan: "isBlocked"
    };


    console.log("SENDING USER:", user);

    try {
      const { error } = await authClient.signUp.email(user);

      if (error) {
        console.log("SIGNUP ERROR:", error);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      console.log("SIGNUP ERROR:", err);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 p-6 max-w-lg mx-auto mt-8 rounded-2xl border">

      <Surface className="w-full">

        <Form onSubmit={onSubmit}>

          <Fieldset>

            <Fieldset.Legend className="text-2xl font-bold">
              Create Your Account
            </Fieldset.Legend>

            <Description>
              Join StartupForge as Founder or Collaborator
            </Description>

            <Fieldset.Group className="space-y-4 mt-4">

              {/* NAME */}
              <TextField isRequired name="name">
                <Label>Name</Label>
                <Input placeholder="John Doe" variant="secondary" />
              </TextField>

              {/* EMAIL */}
              <TextField isRequired name="email">
                <Label>Email</Label>
                <Input placeholder="john@example.com" variant="secondary" />
              </TextField>

              {/* IMAGE */}
              <TextField>
                <Label>Profile Image URL</Label>
                <input name="image" type="file" placeholder="https://i.ibb.co/xxx.jpg" variant="secondary" />
              </TextField>

              {/* PASSWORD */}
              <TextField isRequired name="password">
                <Label>Password</Label>
                <Input type="password" variant="secondary" />
              </TextField>

              {/* ROLE FIXED */}
              <Select isRequired name="role" placeholder="Select role">
                <Label>Signup As</Label>

                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>

                <Select.Popover>
                  <ListBox>

                    {/* IMPORTANT: value fix */}
                    <ListBox.Item id="founder">
                      Founder
                    </ListBox.Item>

                    <ListBox.Item id="collaborator">
                      Collaborator
                    </ListBox.Item>

                  </ListBox>
                </Select.Popover>

              </Select>

            </Fieldset.Group>

            <Button type="submit" className="w-full mt-5">
              Create Account
            </Button>

          </Fieldset>

        </Form>

      </Surface>

    </div>
  );
}
