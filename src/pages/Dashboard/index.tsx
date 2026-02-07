import Lucide from "@/components/Base/Lucide";
import { Menu } from "@/components/Base/Headless";
import { FormSelect, FormInput } from "@/components/Base/Form";
import Tippy from "@/components/Base/Tippy";
import users from "@/fakers/users";
import Button from "@/components/Base/Button";
import { Tab } from "@/components/Base/Headless";
import ReportBarChart6 from "@/components/ReportBarChart6";
import ReportBarChart1 from "@/components/ReportBarChart1";
import _ from "lodash";
import Litepicker from "@/components/Base/Litepicker";
import { useState } from "react";

function Main() {
  const [generalReportFilter, setGeneralReportFilter] = useState<string>();
  const salesPerformance = () => {
    return [
      "bg-opacity-50",
      "bg-opacity-40",
      "bg-opacity-30",
      "bg-opacity-20",
      "bg-opacity-10",
    ][_.random(0, 4)];
  };

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        <div className="flex items-center h-10">
          <div className="text-base font-medium group-[.mode--light]:text-white">
            Dashboard Laporan
          </div>
        </div>
        <div className="grid grid-cols-12 gap-5 mt-3.5">
          <div className="flex flex-col col-span-12 p-5 sm:col-span-6 xl:col-span-3 box box--stacked">
            {/* <Menu className="absolute top-0 right-0 mt-5 mr-5">
                            <Menu.Button className="w-5 h-5 text-slate-500">
                                <Lucide
                                    icon="MoreVertical"
                                    className="w-6 h-6 stroke-slate-400/70 fill-slate-400/70"
                                />
                            </Menu.Button>
                            <Menu.Items className="w-40">
                                <Menu.Item>
                                    <Lucide icon="Copy" className="w-4 h-4 mr-2" /> Copy Link
                                </Menu.Item>
                                <Menu.Item>
                                    <Lucide icon="Trash" className="w-4 h-4 mr-2" />
                                    Delete
                                </Menu.Item>
                            </Menu.Items>
                        </Menu> */}
            <div className="flex items-center">
              <div className="w-[54px] h-[54px] p-0.5 border border-primary/80 rounded-full bg-slate-50 cursor-pointer">
                <div className="w-full h-full p-1 bg-white border rounded-full border-slate-300/70">
                  <Lucide icon="FileSpreadsheet" className="w-full h-full" />
                </div>
              </div>
              <div className="ml-4">
                <div className="-mt-0.5 text-lg font-medium text-primary">
                  Vendor
                </div>
                <div className="mt-0.5 text-slate-500">Data Vendor</div>
              </div>
            </div>
            <div className="px-4 py-2.5 mt-16 border border-dashed rounded-[0.6rem] border-slate-300/80 box shadow-sm">
              <div className="flex items-center">
                <div className="text-xl font-medium leading-tight">Total</div>
              </div>
              <div className="mt-1 text-base text-slate-500">1000</div>
            </div>
          </div>
          <div className="flex flex-col col-span-12 p-5 sm:col-span-6 xl:col-span-3 box box--stacked">
            <div className="flex items-center">
              <div className="w-[54px] h-[54px] p-0.5 border border-success/80 rounded-full bg-slate-50 cursor-pointer">
                <div className="w-full h-full p-1 bg-white border rounded-full border-green-300">
                  <Lucide icon="Files" className="w-full h-full text-success" />
                </div>
              </div>
              <div className="ml-4">
                <div className="-mt-0.5 text-lg font-medium text-success">
                  Lelang
                </div>
                <div className="mt-0.5 text-slate-500">Data Lelang</div>
              </div>
            </div>
            <div className="px-4 py-2.5 mt-16 border border-dashed rounded-[0.6rem] border-slate-300/80 box shadow-sm">
              <div className="flex items-center">
                <div className="text-xl font-medium leading-tight">Total</div>
              </div>
              <div className="mt-1 text-base text-slate-500">1000</div>
            </div>
          </div>
          <div className="flex flex-col col-span-12 p-5 sm:col-span-6 xl:col-span-3 box box--stacked">
            <div className="flex items-center">
              <div className="w-[54px] h-[54px] p-0.5 border border-warning/80 rounded-full bg-slate-50 cursor-pointer">
                <div className="w-full h-full p-1 bg-white border rounded-full border-yellow-300">
                  <Lucide
                    icon="FileType"
                    className="w-full h-full text-warning"
                  />
                </div>
              </div>
              <div className="ml-4">
                <div className="-mt-0.5 text-lg font-medium text-warning">
                 Lelang Tender
                </div>
                <div className="mt-0.5 text-slate-500">Lelang Tender</div>
              </div>
            </div>
            <div className="px-4 py-2.5 mt-16 border border-dashed rounded-[0.6rem] border-slate-300/80 box shadow-sm">
              <div className="flex items-center">
                <div className="text-xl font-medium leading-tight">Total</div>
              </div>
              <div className="mt-1 text-base text-slate-500">1000</div>
            </div>
          </div>
          <div className="flex flex-col col-span-12 p-5 sm:col-span-6 xl:col-span-3 box box--stacked">
            <div className="flex items-center">
              <div className="w-[54px] h-[54px] p-0.5 border border-danger/80 rounded-full bg-slate-50 cursor-pointer">
                <div className="w-full h-full p-1 bg-white border rounded-full border-red-300">
                  <Lucide
                    icon="FileText"
                    className="w-full h-full text-danger"
                  />
                </div>
              </div>
              <div className="ml-4">
                <div className="-mt-0.5 text-lg font-medium text-danger">
                  Lelang Non Tender
                </div>
                <div className="mt-0.5 text-slate-500">
                 Non Tender
                </div>
              </div>
            </div>
            <div className="px-4 py-2.5 mt-16 border border-dashed rounded-[0.6rem] border-slate-300/80 box shadow-sm">
              <div className="flex items-center">
                <div className="text-xl font-medium leading-tight">Total</div>
              </div>
              <div className="mt-1 text-base text-slate-500">1000</div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-12 xl:col-span-8">
        <div>
          <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
            <div className="text-base font-medium">Laporan Lelang</div>
          </div>
          <div className="p-5 mt-3.5 box box--stacked">
            <div className="flex flex-col lg:items-center lg:flex-row gap-y-5">
              <div className="flex flex-col sm:items-center sm:flex-row gap-x-3 gap-y-2">
                <div className="relative">
                  <Lucide
                    icon="CalendarCheck2"
                    className="absolute inset-y-0 left-0 z-10 w-4 h-4 my-auto ml-3 stroke-[1.3]"
                  />
                  <FormSelect className="sm:w-44 pl-9">
                    <option value="custom-date">Pilih Tanggal</option>
                    <option value="daily">Harian</option>
                    <option value="weekly">Mingguan</option>
                    <option value="monthly">Bulanan</option>
                    <option value="yearly">Tahunan</option>
                  </FormSelect>
                </div>
                <div className="relative">
                  <Lucide
                    icon="Calendar"
                    className="absolute inset-y-0 left-0 z-10 w-4 h-4 my-auto ml-3 stroke-[1.3]"
                  />
                  <Litepicker
                    value={generalReportFilter}
                    onChange={(e) => {
                      setGeneralReportFilter(e.target.value);
                    }}
                    options={{
                      autoApply: false,
                      singleMode: false,
                      numberOfColumns: 2,
                      numberOfMonths: 2,
                      showWeekNumbers: true,
                      dropdowns: {
                        minYear: 1990,
                        maxYear: null,
                        months: true,
                        years: true,
                      },
                    }}
                    className="pl-9 sm:w-64 rounded-[0.3rem]"
                  />
                </div>
              </div>
              <div className="flex items-center lg:ml-auto gap-3.5">
                <a href="" className="flex items-center text-slate-500">
                  <Lucide icon="Printer" className="w-3.5 h-3.5 stroke-[1.7]" />
                  <div className="ml-1.5 whitespace-nowrap underline decoration-dotted decoration-slate-300 underline-offset-[3px]">
                    Export ke PDF
                  </div>
                </a>
                <a href="" className="flex items-center text-primary">
                  <Lucide
                    icon="ExternalLink"
                    className="w-3.5 h-3.5 stroke-[1.7]"
                  />
                  <div className="ml-1.5 whitespace-nowrap underline decoration-dotted decoration-primary/30 underline-offset-[3px]">
                    Lihat Laporan Lengkap
                  </div>
                </a>
              </div>
            </div>
            <div className="mt-5">
              <ReportBarChart6 height={280} />
            </div>
            <div className="flex flex-wrap items-center justify-center mt-5 gap-y-3 gap-x-5">
              <div className="flex items-center text-slate-500">
                <div className="w-2 h-2 mr-2 border rounded-full border-primary/60 bg-primary/60"></div>{" "}
                Tender
              </div>
              <div className="flex items-center text-slate-500">
                <div className="w-2 h-2 mr-2 border rounded-full border-slate-500/60 bg-slate-500/60"></div>{" "}
                Non Tender
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-12 md:col-span-6 xl:col-span-4">
        <div>
          <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
            <div className="text-base font-medium">Data Lelang</div>
          </div>
          <div className="p-5 mt-3.5 box box--stacked">
            <Tab.Group className="mt-1">
              <Tab.List
                variant="boxed-tabs"
                className="w-3/4 mx-auto shadow-sm rounded-[0.6rem]"
              >
                <Tab className="first:rounded-l-[0.6rem] last:rounded-r-[0.6rem] [&[aria-selected='true']_button]:text-current">
                  <Tab.Button
                    className="w-full text-slate-500 whitespace-nowrap rounded-[0.6rem]"
                    as="button"
                  >
                    Harian
                  </Tab.Button>
                </Tab>
                <Tab className="first:rounded-l-[0.6rem] last:rounded-r-[0.6rem] [&[aria-selected='true']_button]:text-current">
                  <Tab.Button
                    className="w-full text-slate-500 whitespace-nowrap rounded-[0.6rem]"
                    as="button"
                  >
                    Bulanan
                  </Tab.Button>
                </Tab>
                <Tab className="first:rounded-l-[0.6rem] last:rounded-r-[0.6rem] [&[aria-selected='true']_button]:text-current">
                  <Tab.Button
                    className="w-full text-slate-500 whitespace-nowrap rounded-[0.6rem]"
                    as="button"
                  >
                    Tahunan
                  </Tab.Button>
                </Tab>
              </Tab.List>
              <Tab.Panels className="mt-10">
                <Tab.Panel>
                  <div className="w-4/5 mx-auto">
                    <ReportBarChart1 className="relative z-10" height={195} />
                  </div>
                  <div className="flex flex-wrap items-center justify-center mt-4 gap-y-3 gap-x-5">
                    <div className="flex items-center text-slate-500">
                      <div className="w-2 h-2 mr-2 border rounded-full border-warning/20 bg-warning/20"></div>{" "}
                      Lelang
                    </div>
                  </div>
                  <Button className="w-full mt-6 border-dashed border-slate-300 hover:bg-slate-50 dark:hover:bg-darkmode-400">
                    <Lucide
                      icon="ExternalLink"
                      className="stroke-[1.3] w-4 h-4 mr-2"
                    />{" "}
                    Lihat Laporan Lengkap
                  </Button>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
