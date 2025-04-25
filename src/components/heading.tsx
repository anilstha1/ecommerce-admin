import React from "react";

function Heading({title, description}: {title: string; description: string}) {
  return (
    <div className="">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

export default Heading;
