import Lucide from "@/components/Base/Lucide";
import TomSelect from "@/components/Base/TomSelect";
import { ClassicEditor } from "@/components/Base/Ckeditor";
import {
    FormLabel,
    FormCheck,
    FormInput,
    FormInline,
    FormSelect,
    FormSwitch,
    InputGroup,
    FormHelp,
} from "@/components/Base/Form";
import Alert from "@/components/Base/Alert";
import Tippy from "@/components/Base/Tippy";
import products from "@/fakers/products";
import categories from "@/fakers/categories";
import permohonan from "@/fakers/permohonan";
import Button from "@/components/Base/Button";
import Table from "@/components/Base/Table";
import { useEffect, useState } from "react";
import clsx from "clsx";
import _ from "lodash";
import { Disclosure } from "@/components/Base/Headless";
import { FormInputIcon } from "lucide-react";
import { useParams } from "react-router-dom";

function Main() {
    const [subcategory, setSubcategory] = useState(["0"]);
    const [editorData, setEditorData] = useState("<p>Content of the editor.</p>");

    const { id } = useParams();
    const data = permohonan.fakePermohonans().find((item) => item.id == id);

    return (
        <div className="grid grid-cols-12 gap-y-10 gap-x-6">
            <div className="col-span-12">
                <div className="flex flex-col mt-4 md:mt-0 md:h-10 gap-y-3 md:items-center md:flex-row">
                    <div className="text-base font-medium group-[.mode--light]:text-white">
                        Edit Pemohon
                    </div>
                </div>
                <div className="mt-3.5 grid grid-cols-12 xl:grid-cols-10 gap-y-7 lg:gap-y-10 gap-x-6">
                    <div className="relative flex flex-col col-span-12 lg:col-span-9 xl:col-span-8 gap-y-7">
                        <div className="flex flex-col p-5 box box--stacked">
                            <div className="p-5 border rounded-[0.6rem] border-slate-200/60 dark:border-darkmode-400">
                                <div className="flex items-center pb-5 text-[0.94rem] font-medium border-b border-slate-200/60 dark:border-darkmode-400">
                                    <Lucide
                                        icon="ChevronDown"
                                        className="w-5 h-5 stroke-[1.3] mr-2"
                                    />{" "}
                                    Informasi Umum
                                </div>
                                <div className="mt-5">
                                    <div className="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
                                        <label className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
                                            <div className="text-left">
                                                <div className="flex items-center">
                                                    <div className="font-medium">Nama Pemohon</div>
                                                    <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                                                        Required
                                                    </div>
                                                </div>
                                            </div>
                                        </label>
                                        <div className="flex-1 w-full mt-3 xl:mt-0">
                                            <FormInput type="text" placeholder="Nama Pemohon" value={data?.pemohon?.name} />
                                        </div>
                                    </div>
                                    <div className="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
                                        <label className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
                                            <div className="text-left">
                                                <div className="flex items-center">
                                                    <div className="font-medium">Email Pemohon</div>
                                                    <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                                                        Required
                                                    </div>
                                                </div>
                                            </div>
                                        </label>
                                        <div className="flex-1 w-full mt-3 xl:mt-0">
                                            <FormInput type="text" placeholder="Email Pemohon" value={data?.pemohon?.email} />
                                        </div>
                                    </div>
                                    <div className="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
                                        <label className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
                                            <div className="text-left">
                                                <div className="flex items-center">
                                                    <div className="font-medium">No Telepon</div>
                                                    <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                                                        Required
                                                    </div>
                                                </div>
                                            </div>
                                        </label>
                                        <div className="flex-1 w-full mt-3 xl:mt-0">
                                            <FormInput type="text" placeholder="No Telepon" value={data?.pemohon?.no} />
                                        </div>
                                    </div>
                                    <div className="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
                                        <label className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
                                            <div className="text-left">
                                                <div className="flex items-center">
                                                    <div className="font-medium">Instansi</div>
                                                    <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                                                        Required
                                                    </div>
                                                </div>
                                            </div>
                                        </label>
                                        <div className="flex-1 w-full mt-3 xl:mt-0">
                                            <FormInput type="text" placeholder="Instansi" value={data?.pemohon?.instance} />
                                        </div>
                                    </div>
                                    <div className="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
                                        <label className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
                                            <div className="text-left">
                                                <div className="flex items-center">
                                                    <div className="font-medium">Satker</div>
                                                    <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                                                        Required
                                                    </div>
                                                </div>
                                            </div>
                                        </label>
                                        <div className="flex-1 w-full mt-3 xl:mt-0">
                                            <FormInput type="text" placeholder="Satker" value={data?.pemohon?.satker} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col p-5 box box--stacked">
                            <div className="p-5 border rounded-[0.6rem] border-slate-200/80 dark:border-darkmode-400">
                                <div className="flex items-center pb-5 text-[0.94rem] font-medium border-b border-slate-200/80 dark:border-darkmode-400">
                                    <Lucide
                                        icon="ChevronDown"
                                        className="w-5 h-5 stroke-[1.3] mr-2"
                                    />{" "}
                                    Security
                                </div>
                                <div className="mt-5">
                                    <div className="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
                                        <label className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
                                            <div className="text-left">
                                                <div className="flex items-center">
                                                    <div className="font-medium">Password</div>
                                                    <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                                                        Required
                                                    </div>
                                                </div>
                                            </div>
                                        </label>
                                        <div className="flex-1 w-full mt-3 xl:mt-0">
                                            <FormInput type="text" placeholder="Password" />
                                        </div>
                                    </div>
                                    <div className="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
                                        <label className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
                                            <div className="text-left">
                                                <div className="flex items-center">
                                                    <div className="font-medium">Konfirmasi Password</div>
                                                    <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                                                        Required
                                                    </div>
                                                </div>
                                            </div>
                                        </label>
                                        <div className="flex-1 w-full mt-3 xl:mt-0">
                                            <FormInput type="text" placeholder="Konfirmasi Password" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-end gap-3 mt-1 md:flex-row">
                            <Button
                                variant="outline-secondary"
                                className="w-full border-slate-300/80 bg-white/80 md:w-56 py-2.5 rounded-[0.5rem] dark:bg-darkmode-400"
                            >
                                <Lucide icon="PenLine" className="stroke-[1.3] w-4 h-4 mr-2" />
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                className="w-full md:w-56 py-2.5 rounded-[0.5rem]"
                            >
                                <Lucide icon="PenLine" className="stroke-[1.3] w-4 h-4 mr-2" />
                                Save
                            </Button>
                        </div>
                    </div>
                    <div className="relative order-first col-span-12 lg:order-last lg:col-span-3 xl:col-span-2">
                        <div className="sticky top-[104px]">
                            <div className="relative p-5 mt-7 border rounded-[0.6rem] bg-warning/[0.07] dark:bg-darkmode-600 border-warning/[0.15] dark:border-0 group-[.mode--light]:bg-white">
                                <Lucide
                                    icon="Lightbulb"
                                    className="absolute top-0 right-0 w-12 h-12 mt-5 mr-3 text-warning/80"
                                />
                                <h2 className="text-lg font-medium">Tips</h2>
                                <div className="mt-4 font-medium">Price</div>
                                <div className="mt-2 text-xs leading-relaxed text-slate-600/90 dark:text-slate-400">
                                    <div>
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt, quis!
                                    </div>
                                    <div className="mt-2">
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa, a! Reiciendis dolore aspernatur ullam vero?
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Main;
