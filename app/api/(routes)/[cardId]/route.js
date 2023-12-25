import dbConnect from "@/lib/mongodb";
import IdCard from "@/models/idCardModel";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  await dbConnect();

  try {
    const data = await IdCard.findOneAndDelete({
      _id: params.cardId,
    });
    return NextResponse.json(data);
  } catch (error) {
    console.log("CARD_DELETE", error);
    return new NextResponse("CARD_DELETE", error);
  }
}
