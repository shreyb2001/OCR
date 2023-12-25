import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { Credentials, searchAfter, searchBefore } from "@/helpers";
import dbConnect from "@/lib/mongodb";
import IdCard from "@/models/idCardModel";

export async function POST(req) {
  await dbConnect();

  try {
    const data = await req.formData();
    const file = data.get("file");

    if (!file) return new NextResponse("No file found", { status: false });

    if (file.size > 2 * 1024 * 1024)
      return new NextResponse("File size exceeds 2MB limit", { status: 404 });

    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type))
      return new NextResponse(
        "Invalid image file type ( Only PNG , JPEG , JPG)",
        { status: 403 }
      );

    const byteData = await file.arrayBuffer();
    const buffer = Buffer.from(byteData);
    const path = `./public/${file.name}`;
    await writeFile(path, buffer);

    const vision = require("@google-cloud/vision");

    const client = new vision.ImageAnnotatorClient({
      credentials: {
        private_key: Credentials.private_key,
        client_email: Credentials.client_email,
      },
    });

    const [result] = await client.textDetection(path);
    const detections = result.fullTextAnnotation.text;

    const [colorResults] = await client.imageProperties(path);
    const colors = colorResults.imagePropertiesAnnotation.dominantColors.colors;

    const identificationNumber = searchAfter(
      detections,
      "Thai National ID Card"
    );
    const identificationnumber = searchAfter(
      detections,
      "Identification Number"
    );

    const duplicateData = await IdCard.findOne({
      identificationNumber: identificationNumber || identificationnumber,
    });

    if (duplicateData)
      return NextResponse.json({ message: "This card already exist" });

    const name = searchAfter(detections, "Name");
    const lastName = searchAfter(detections, "Last name");
    const birthDate = searchAfter(detections, "Date of Birth");
    const issueDate = searchBefore(detections, "Date of Issue");
    const expiryDate = searchBefore(detections, "Date of Expiry");

    const idCard = await IdCard.create({
      name,
      identificationNumber: identificationNumber || identificationnumber,
      lastName,
      birthDate,
      issueDate,
      expiryDate,
      bgColor: colors[0],
    });

    return NextResponse.json(idCard);
  } catch (error) {
    console.log("IMAGE_POST", error);
    return new NextResponse("Internal error", { status: 500, error });
  }
}

export async function GET(req, { params }) {
  await dbConnect();

  try {
    const data = await IdCard.find({}).sort({ createdAt: -1 });
    if (data.length !== 0) return NextResponse.json(data?.[0]);
    else
      return new NextResponse(
        { message: "No data available" },
        { status: 404 }
      );
  } catch (error) {
    console.log("CARD_GET", error);
    return new NextResponse.json({ RECENT_CARD_GET: error });
  }
}
