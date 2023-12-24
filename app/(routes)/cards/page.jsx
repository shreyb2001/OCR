import dbConnect from "@/lib/mongodb";
import IdCard from "@/models/idCardModel";
import React from "react";
import CardClient from "./components/client";

const CardsPage = async () => {
  await dbConnect();
  const cards = await IdCard.find({}).sort({ createdAt: 1 });
  const plainCards = JSON.parse(JSON.stringify(cards));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CardClient data={plainCards} />
      </div>
    </div>
  );
};

export default CardsPage;
