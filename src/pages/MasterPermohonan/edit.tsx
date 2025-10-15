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
import { useLocation, useParams } from "react-router-dom";

function Main() {
    const [subcategory, setSubcategory] = useState(["0"]);
    const [editorData, setEditorData] = useState("<p>Content of the editor.</p>");

    const { id } = useParams();
    const data = _.find(permohonan.fakePermohonans(), { id: id });


    return (
        <div className="grid grid-cols-12 gap-y-10 gap-x-6">
            <div className="col-span-12">
                <div className="flex flex-col mt-4 md:mt-0 md:h-10 gap-y-3 md:items-center md:flex-row">
                    <div className="text-base font-medium group-[.mode--light]:text-white">
                        Edit Permohonan
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
                                    Informasi Pemohon
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
                                            <FormInput type="text" placeholder="Pemohon" value={data?.pemohon?.name} readOnly />
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
                                            <FormInput type="text" placeholder="Pemohon" value={data?.pemohon?.email} readOnly />
                                        </div>
                                    </div>
                                    <div className="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
                                        <label className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
                                            <div className="text-left">
                                                <div className="flex items-center">
                                                    <div className="font-medium">No Telepon Pemohon</div>
                                                    <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                                                        Required
                                                    </div>
                                                </div>
                                            </div>
                                        </label>
                                        <div className="flex-1 w-full mt-3 xl:mt-0">
                                            <FormInput type="text" placeholder="Pemohon" value={data?.pemohon?.no} readOnly />
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
                                    Permohonan
                                </div>
                                <div className="mt-5">
                                    <div className="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
                                        <label className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
                                            <div className="text-left">
                                                <div className="flex items-center">
                                                    <div className="font-medium">No. Tiket</div>
                                                    <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                                                        Required
                                                    </div>
                                                </div>
                                            </div>
                                        </label>
                                        <div className="flex-1 w-full mt-3 xl:mt-0">
                                            <FormInput type="text" value={data?.no_ticket} readOnly placeholder="No Tiket" />
                                        </div>
                                    </div>
                                    <div className="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
                                        <label className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
                                            <div className="text-left">
                                                <div className="flex items-center">
                                                    <div className="font-medium">Judul Permohonan</div>
                                                    <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                                                        Required
                                                    </div>
                                                </div>
                                            </div>
                                        </label>
                                        <div className="flex-1 w-full mt-3 xl:mt-0">
                                            <FormInput type="text" placeholder="Judul Permohonan" value={data?.title}/>
                                        </div>
                                    </div>
                                    <div className="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
                                        <label className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
                                            <div className="text-left">
                                                <div className="flex items-center">
                                                    <div className="font-medium">Deskripsi Permohonan</div>
                                                    <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                                                        Required
                                                    </div>
                                                </div>
                                            </div>
                                        </label>
                                        <div className="flex-1 w-full mt-3 xl:mt-0">
                                            <ClassicEditor
                                                value={data?.title ?? ""}
                                                onChange={setEditorData}
                                            />
                                            <FormHelp className="text-right">
                                                Maximum character 0/2000
                                            </FormHelp>
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
                                    Upload Dokumen Pendukung
                                </div>
                                <div className="mt-5">
                                    <div className="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
                                        <label className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
                                            <div className="text-left">
                                                <div className="flex items-center">
                                                    <div className="font-medium">Dokumen</div>
                                                    <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                                                        Required
                                                    </div>
                                                </div>
                                                <div className="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80 dark:text-slate-400">
                                                    Dokumen dapat berupa PDF, Image, File Excel atau apapun.
                                                </div>
                                            </div>
                                        </label>
                                        <div className="flex-1 w-full mt-3 xl:mt-0">
                                            <div className="border border-dashed rounded-md border-slate-300/80">
                                                <div className="grid grid-cols-9 gap-5 px-5 pt-5 sm:grid-cols-10">
                                                    {_.take(products.fakeProducts(), 5).map(
                                                        (faker, fakerKey) => (
                                                            <div
                                                                key={fakerKey}
                                                                className="relative h-24 col-span-3 cursor-pointer md:col-span-2 image-fit zoom-in"
                                                            >
                                                                <img
                                                                    className="rounded-lg"
                                                                    alt="Tailwise - Admin Dashboard Template"
                                                                    src={faker.images[0].path}
                                                                />
                                                                <Tippy
                                                                    content="Remove this image?"
                                                                    className="absolute top-0 right-0 w-5 h-5 -mt-2 -mr-2 bg-white rounded-full"
                                                                >
                                                                    <div className="flex items-center justify-center w-full h-full text-white border rounded-full bg-danger/80 border-danger/50">
                                                                        <Lucide
                                                                            icon="X"
                                                                            className="w-4 h-4 stroke-[1.3]"
                                                                        />
                                                                    </div>
                                                                </Tippy>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                                <div className="relative flex items-center justify-center px-4 pb-4 mt-5 cursor-pointer">
                                                    <Lucide icon="Image" className="w-4 h-4 mr-2" />
                                                    <span className="mr-1 text-primary">
                                                        Upload a file
                                                    </span>{" "}
                                                    or drag and drop
                                                    <FormInput
                                                        id="horizontal-form-1"
                                                        type="file"
                                                        className="absolute top-0 left-0 w-full h-full opacity-0"
                                                    />
                                                </div>
                                            </div>
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
