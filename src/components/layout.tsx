import React, { PropsWithChildren } from "react";
import Image from "next/image";
import Link from "next/link";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex w-screen justify-center items-center">
      <div className="flex flex-col gap-24 mx-12 md:w-3/4 mt-16 lg:w-5/12 max-w-full justify-center items-center">
        <Link href="/" className="flex w-full justify-start">
          <Image src="/static/logo/primary.png" alt="Paul Bokelman" width={50} height={50} />
        </Link>
        {children}
      </div>
    </div>
  );
};
