import dbConnect from "@/lib/mongodb";
import IdCard from "@/models/idCardModel";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await dbConnect();

  try {
    const data = await IdCard.findOne({
      _id: params.cardId,
    });
    return NextResponse.json(data);
  } catch (error) {
    console.log("CARD_GET", error);
    return new NextResponse("RECENT_CARD_GET", error);
  }
}
