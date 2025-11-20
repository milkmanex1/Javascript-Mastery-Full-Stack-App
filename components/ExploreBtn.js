"use client";
//whenever we need state or event handlers in a component, we need to add "use client" at the top of the file
import React from "react";
import Image from "next/image";

const ExploreBtn = () => {
  return (
    <button
      type="button"
      id="explore-btn"
      className="mt-7 mx-auto"
      onClick={() => console.log("click")}
    >
      <a href="#events">
        Explore Events{" "}
        <Image
          src="/icons/arrow-down.svg"
          width={24}
          height={24}
          alt="arrow here"
        ></Image>{" "}
      </a>
    </button>
  );
};

export default ExploreBtn;
