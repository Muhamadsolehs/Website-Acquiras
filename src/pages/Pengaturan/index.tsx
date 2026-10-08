import Lucide from "@/components/Base/Lucide";
import { Disclosure, Menu, Popover } from "@/components/Base/Headless";
import Pagination from "@/components/Base/Pagination";
import { FormCheck, FormInput, FormSelect } from "@/components/Base/Form";
import Tippy from "@/components/Base/Tippy";
import users from "@/fakers/users";
import Button from "@/components/Base/Button";
import Table from "@/components/Base/Table";
import { Tab } from "@/components/Base/Headless";
import clsx from "clsx";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

function Main() {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
          <div className="text-base font-medium text-white">
            Pengaturan
          </div>
        </div>
        <div className="flex flex-col gap-8 mt-5">
          <Disclosure.Group>
            <Disclosure className="box box--stacked p-10 mb-5">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex items-center text-dark pb-5 text-[0.94rem] font-medium border-b border-slate-200/60 dark:border-darkmode-400">
                    <Lucide
                      icon={open ? "ChevronUp" : "ChevronDown"}
                      className="w-5 h-5 stroke-[1.3] mr-2"
                    />
                    Pengaturan Umum
                  </Disclosure.Button>
                  <Disclosure.Panel className="mt-5 py-5">
                    <div className="grid w-full grid-cols-3 gap-2 p-5">
                      <div className="cursor-pointer">
                        <div className="col-span-4 sm:col-span-2 xl:col-span-1 flex flex-col items-center justify-center p-5 border relative rounded-[0.6rem] bg-slate-50/50 overflow-hidden dark:bg-darkmode-400">
                          <div className="flex items-center justify-center w-48 h-48 border rounded-full border-primary/10 bg-primary/10">
                            <Lucide
                              icon="UserRound"
                              className="w-32 h-32 text-primary fill-primary/10"
                            />
                          </div>
                          <div className="mt-5 text-center">
                            <div className="text-2xl font-medium">Pengguna</div>
                          </div>
                        </div>
                      </div>
                      <div className="cursor-pointer">
                        <div className="col-span-4 sm:col-span-2 xl:col-span-1 flex flex-col items-center justify-center p-5 border relative rounded-[0.6rem] bg-slate-50/50 overflow-hidden dark:bg-darkmode-400">
                          <div className="flex items-center justify-center w-48 h-48 border rounded-full border-primary/10 bg-primary/10">
                            <Lucide
                              icon="UserRoundCheck"
                              className="w-32 h-32 text-primary fill-primary/10"
                            />
                          </div>
                          <div className="mt-5 text-center">
                            <div className="text-2xl font-medium">Peran</div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="cursor-pointer"
                        onClick={() => navigate("/dashboard/profile")}
                      >
                        <div className="col-span-4 sm:col-span-2 xl:col-span-1 flex flex-col items-center justify-center p-5 border relative rounded-[0.6rem] bg-slate-50/50 overflow-hidden dark:bg-darkmode-400">
                          <div className="flex items-center justify-center w-48 h-48 border rounded-full border-primary/10 bg-primary/10">
                            <Lucide
                              icon="UserRoundCog"
                              className="w-32 h-32 text-primary fill-primary/10"
                            />
                          </div>
                          <div className="mt-5 text-center">
                            <div className="text-2xl font-medium">Profile</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
            <Disclosure className="box box--stacked p-10 mb-5">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex items-center text-dark pb-5 text-[0.94rem] font-medium border-b border-slate-200/60 dark:border-darkmode-400">
                    <Lucide
                      icon={open ? "ChevronUp" : "ChevronDown"}
                      className="w-5 h-5 stroke-[1.3] mr-2"
                    />
                    Pengaturan Layout & Tampilan
                  </Disclosure.Button>
                  <Disclosure.Panel className="mt-5 py-5">
                    <div className="grid w-full grid-cols-3 gap-2 p-5">
                      <div className="cursor-pointer">
                        <div className="col-span-4 sm:col-span-2 xl:col-span-1 flex flex-col items-center justify-center p-5 border relative rounded-[0.6rem] bg-slate-50/50 overflow-hidden dark:bg-darkmode-400">
                          <div className="flex items-center justify-center w-48 h-48 border rounded-full border-primary/10 bg-primary/10">
                            <Lucide
                              icon="FileType"
                              className="w-32 h-32 text-primary fill-primary/10"
                            />
                          </div>
                          <div className="mt-5 text-center">
                            <div className="text-2xl font-medium">Template</div>
                          </div>
                        </div>
                      </div>
                      <div className="cursor-pointer">
                        <div className="col-span-4 sm:col-span-2 xl:col-span-1 flex flex-col items-center justify-center p-5 border relative rounded-[0.6rem] bg-slate-50/50 overflow-hidden dark:bg-darkmode-400">
                          <div className="flex items-center justify-center w-48 h-48 border rounded-full border-primary/10 bg-primary/10">
                            <Lucide
                              icon="LayoutTemplate"
                              className="w-32 h-32 text-primary fill-primary/10"
                            />
                          </div>
                          <div className="mt-5 text-center">
                            <div className="text-2xl font-medium">Tema</div>
                          </div>
                        </div>
                      </div>
                      <div className="cursor-pointer">
                        <div className="col-span-4 sm:col-span-2 xl:col-span-1 flex flex-col items-center justify-center p-5 border relative rounded-[0.6rem] bg-slate-50/50 overflow-hidden dark:bg-darkmode-400">
                          <div className="flex items-center justify-center w-48 h-48 border rounded-full border-primary/10 bg-primary/10">
                            <Lucide
                              icon="LayoutDashboard"
                              className="w-32 h-32 text-primary fill-primary/10"
                            />
                          </div>
                          <div className="mt-5 text-center">
                            <div className="text-2xl font-medium">Layout</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </Disclosure.Group>
        </div>
      </div>
    </div>
  );
}

export default Main;
