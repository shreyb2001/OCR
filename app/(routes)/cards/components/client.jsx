"use client";

import React, { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";

const CardClient = ({ data }) => {
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight">Cards (2)</h2>
          <p className="text-sm text-muted-foreground">
            View all your scanned cards.
          </p>
        </div>
        <Button onClick={() => router.push("/")}>Scan a new card</Button>
      </div>
      <Separator />
      <DataTable
        searchKey={"identificationNumber"}
        columns={columns}
        data={data}
      />
    </>
  );
};

export default CardClient;
