"use client";

import React, { useEffect, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";

import CardDetails from "@/components/ui/card-details";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import toast from "react-hot-toast";

const formSchema = z.object({
  image: z.string(),
});

const App = () => {
  const [file, setFile] = useState();
  const [objectId, setObjectId] = useState();
  const [data, setData] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchDetails = async () => {
      let data;
      try {
        if (objectId) {
          data = await fetch(`api/${objectId}`);
        } else {
          data = await fetch(`api/`);
        }
        data = await data.json();
        setData(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDetails();
  }, [objectId]);

  const {
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: "",
    },
  });

  const onHandleChange = (e) => {
    const image = e.target.files?.[0];
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (!allowedTypes.includes(image?.type)) {
      toast.error("Invalid image file type ( Only PNG , JPEG , JPG)");
      return;
    }

    if (image.size > 2 * 1024 * 1024) {
      toast.error("File size exceeds 2MB limit.");
      return;
    }

    setFile(image);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.set("file", file);
    try {
      let result = await fetch(`api/`, {
        method: "POST",
        body: data,
      });

      result = await result.json();
      setObjectId(result?._id);
      toast.success("Scan successful");
      console.log(result);
    } catch (error) {
      toast.error("Scan Unsuccessful");
      setObjectId();
      setData(null);
      console.log(error);
    } finally {
      setFile(undefined);
    }
  };

  return (
    <div className="my-auto max-h-[90%] w-2/3 lg:w-1/2 xl:w-1/3">
      <Card className="flex flex-col p-4">
        <Card className="flex-grow">
          <CardHeader>
            <CardTitle className="text-3xl tracking-tight">Scan Card</CardTitle>
            <CardDescription>Scan your card in one-click.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit}>
              <input
                type="file"
                {...register("image", { required: true })}
                onChange={onHandleChange}
                id="image-upload"
                hidden
              />
              {file && (
                <Image
                  src={URL.createObjectURL(file)}
                  width={220}
                  height={220}
                  alt="Preview"
                  className="pb-4"
                />
              )}
              {!file && (
                <label
                  htmlFor="image-upload"
                  className="flex items-center gap-1 bg-primary-foreground p-2 rounded-md w-[45%] cursor-pointer"
                  typeof="span"
                >
                  <ImagePlus className="h-4 w-4 mr-2" />
                  Upload an Image
                </label>
              )}

              <div className="flex items-center justify-end gap-3">
                <Button variant="outline" onClick={() => setFile(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!file}>
                  Scan
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        {data && <CardDetails data={data} />}
      </Card>
      <Button
        onClick={() => router.push("/cards")}
        className="flex ml-auto my-4 "
      >
        View All Cards
      </Button>
    </div>
  );
};

export default App;
