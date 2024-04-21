import React from "react";
import NavMenu from "./_CommonComponent/NavMenu";
import { HStack } from "@chakra-ui/react";

export default function AfterLoginlayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="container flex mt-10 mx-auto safe-top safe-left safe-right safe-bottom h-lvh bg-red-200">
        <header className="items-end flex-col flex-grow bg-orange-300">
          <section className="w-275px h-lvh bg-orange-500">
            <div className=" fixed flex flex-col items-center px-px-8 py-px-0 h-lvh">
              <nav className="flex-1">
                <ul className="list-none">
                  <NavMenu />
                  ???
                </ul>
              </nav>
            </div>
          </section>
        </header>
        <div className="flex items-start flex-col flex-grow">
          <div className="h-full flex justify-between">
            <main>{children}</main>
          </div>
        </div>
      </div>
    </>
  );
}
