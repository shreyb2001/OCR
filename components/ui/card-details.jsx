import React from "react";
import { generateColorFromRGB } from "@/helpers";

const CardDetails = ({ data }) => {
  const generatedColor = generateColorFromRGB(
    [
      data?.bgColor?.[0].color.red,
      data?.bgColor?.[0].color.green,
      data?.bgColor?.[0].color.blue,
    ],
    0.3
  );

  return (
    <div
      className={`rounded-xl border font-mono text-card-foreground shadow mt-3 flex items-center p-6 `}
      style={{ backgroundColor: generatedColor }}
    >
      <div>
        <p className="font-semibold text-3xl py-2">
          {data?.identificationNumber}
        </p>
        <p className="text-2xl tracking-wide">{data?.name}</p>
        <div className="pt-2 font-light">
          <p>DOB : {data?.birthDate}</p>
          <p>Issue Date : {data?.issueDate}</p>
          <p>Expiry Date : {data?.expiryDate}</p>
        </div>
      </div>
    </div>
  );
};

export default CardDetails;
