import React from "react";
import NavMenu from "./_CommonComponent/NavMenu";
import RQProvider from "./_CommonComponent/RQProvider";

export default function AfterLoginlayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="container flex  mx-auto safe-top safe-left safe-right safe-bottom h-lvh">
        <RQProvider>
          <header className="items-end mt-10 mb-1 flex-col flex-grow-0 justify-center w-1/6">
            <section className="flex h-lvh justify-center pt-5">
              <div className=" fixed flex flex-col items-center px-px-8 py-px-0 h-lvh">
                <nav className="flex-1 justify-center">
                  <ul className="list-none">
                    <NavMenu />
                  </ul>
                </nav>
              </div>
            </section>
          </header>

          <div className="mt-16 mb-2 flex items-start flex-col flex-grow">
            <div className="w-full h-full flex justify-between">
              <main className="w-full ">{children}</main>
            </div>
          </div>
        </RQProvider>
      </div>
    </>
  );
}
