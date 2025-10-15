import Lucide from "@/components/Base/Lucide";
import { Menu, Popover } from "@/components/Base/Headless";
import Pagination from "@/components/Base/Pagination";
import { FormCheck, FormInput, FormSelect } from "@/components/Base/Form";
import Tippy from "@/components/Base/Tippy";
import users from "@/fakers/users";
import Button from "@/components/Base/Button";
import Table from "@/components/Base/Table";
import clsx from "clsx";
import _ from "lodash";
import permohonan from "@/fakers/permohonan";
import kriteria from "@/fakers/kriteria";
import { useNavigate } from "react-router-dom";

function Main() {
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-12 gap-y-10 gap-x-6">
            <div className="col-span-12">
                <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
                    <div className="text-base font-medium group-[.mode--light]:text-white">
                        Setting Penilaian
                    </div>
                    <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 md:ml-auto">
                        <Button
                            onClick={() => {
                                navigate("/penilaian/add")
                            }}
                            variant="primary"
                            className="group-[.mode--light]:!bg-white/[0.12] group-[.mode--light]:!text-slate-200 group-[.mode--light]:!border-transparent dark:group-[.mode--light]:!bg-darkmode-900/30 dark:!box"
                        >
                            <Lucide icon="PenLine" className="stroke-[1.3] w-4 h-4 mr-2" />{" "}
                            Add Kriteria Penilaian
                        </Button>
                        <Button
                            onClick={() => {
                                navigate("/penilaian/setting")
                            }}
                            variant="primary"
                            className="group-[.mode--light]:!bg-white/[0.12] group-[.mode--light]:!text-slate-200 group-[.mode--light]:!border-transparent dark:group-[.mode--light]:!bg-darkmode-900/30 dark:!box"
                        >
                            <Lucide icon="PenLine" className="stroke-[1.3] w-4 h-4 mr-2" />{" "}
                            Setting Aturan Kriteria
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col gap-8 mt-3.5">
                    <div className="flex flex-col box box--stacked">
                        <div className="flex flex-col p-5 sm:items-center sm:flex-row gap-y-2">
                            <div>
                                <div className="relative">
                                    <Lucide
                                        icon="Search"
                                        className="absolute inset-y-0 left-0 z-10 w-4 h-4 my-auto ml-3 stroke-[1.3] text-slate-500"
                                    />
                                    <FormInput
                                        type="text"
                                        placeholder="Search data..."
                                        className="pl-9 sm:w-64 rounded-[0.5rem]"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 sm:ml-auto">
                                <Menu>
                                    <Menu.Button
                                        as={Button}
                                        variant="outline-secondary"
                                        className="w-full sm:w-auto"
                                    >
                                        <Lucide
                                            icon="Download"
                                            className="stroke-[1.3] w-4 h-4 mr-2"
                                        />
                                        Export
                                        <Lucide
                                            icon="ChevronDown"
                                            className="stroke-[1.3] w-4 h-4 ml-2"
                                        />
                                    </Menu.Button>
                                    <Menu.Items className="w-40">
                                        <Menu.Item>
                                            <Lucide icon="FileBarChart" className="w-4 h-4 mr-2" />{" "}
                                            PDF
                                        </Menu.Item>
                                        <Menu.Item>
                                            <Lucide icon="FileBarChart" className="w-4 h-4 mr-2" />
                                            CSV
                                        </Menu.Item>
                                    </Menu.Items>
                                </Menu>
                                <Popover className="inline-block">
                                    {({ close }) => (
                                        <>
                                            <Popover.Button
                                                as={Button}
                                                variant="outline-secondary"
                                                className="w-full sm:w-auto"
                                            >
                                                <Lucide
                                                    icon="ArrowDownWideNarrow"
                                                    className="stroke-[1.3] w-4 h-4 mr-2"
                                                />
                                                Filter
                                                <div className="flex items-center justify-center h-5 px-1.5 ml-2 text-xs font-medium border rounded-full bg-slate-100 dark:bg-darkmode-400">
                                                    3
                                                </div>
                                            </Popover.Button>
                                            <Popover.Panel placement="bottom-end">
                                                <div className="p-2">
                                                    <div>
                                                        <div className="text-left text-slate-500">
                                                            Position
                                                        </div>
                                                        <FormSelect className="flex-1 mt-2">
                                                            {_.take(users.fakeUsers(), 5).map(
                                                                (faker, fakerKey) => (
                                                                    <option key={fakerKey} value={faker.position}>
                                                                        {faker.position}
                                                                    </option>
                                                                )
                                                            )}
                                                        </FormSelect>
                                                    </div>
                                                    <div className="mt-3">
                                                        <div className="text-left text-slate-500">
                                                            Department
                                                        </div>
                                                        <FormSelect className="flex-1 mt-2">
                                                            {_.take(users.fakeUsers(), 5).map(
                                                                (faker, fakerKey) => (
                                                                    <option
                                                                        key={fakerKey}
                                                                        value={faker.department}
                                                                    >
                                                                        {faker.department}
                                                                    </option>
                                                                )
                                                            )}
                                                        </FormSelect>
                                                    </div>
                                                    <div className="flex items-center mt-4">
                                                        <Button
                                                            variant="secondary"
                                                            onClick={() => {
                                                                close();
                                                            }}
                                                            className="w-32 ml-auto"
                                                        >
                                                            Close
                                                        </Button>
                                                        <Button variant="primary" className="w-32 ml-2">
                                                            Apply
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Popover.Panel>
                                        </>
                                    )}
                                </Popover>
                            </div>
                        </div>
                        <div className="overflow-auto xl:overflow-visible">
                            <Table className="border-b border-slate-200/60">
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Td className="w-60 py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                                            <FormCheck.Input type="checkbox" />
                                        </Table.Td>
                                        <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                                            No
                                        </Table.Td>
                                        <Table.Td className="py-4 w-20 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                                            Kriteria
                                        </Table.Td>
                                        <Table.Td className="py-4 font-medium border-t text-center bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                                            Status
                                        </Table.Td>
                                        <Table.Td className="w-20 py-4 font-medium text-center border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                                            Action
                                        </Table.Td>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {_.take(kriteria.fakeKriterias(), 10).map((faker, fakerKey) => (
                                        <Table.Tr key={fakerKey} className="[&_td]:last:border-b-0">
                                            <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                                                <FormCheck.Input type="checkbox" />
                                            </Table.Td>
                                            <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                                                {fakerKey + 1}
                                            </Table.Td>
                                            <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                                                {faker.name}
                                            </Table.Td>
                                            <Table.Td className="py-4 text-center border-dashed dark:bg-darkmode-600">
                                                {faker.status ? (
                                                    <span className="inline-flex items-center gap-1 bg-success/30 text-xs px-2 py-1.5 rounded-full">
                                                        <Lucide
                                                            icon="CheckCircle"
                                                            className="stroke-dark w-4 h-4"
                                                        />
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 bg-danger/30 text-xs px-2 py-1.5 rounded-full">
                                                        <Lucide
                                                            icon="XCircle"
                                                            className="stroke-dark w-4 h-4"
                                                        />
                                                    </span>
                                                )
                                                }
                                            </Table.Td>
                                            <Table.Td className="relative py-4 border-dashed dark:bg-darkmode-600">
                                                <div className="flex items-center justify-center">
                                                    <Menu className="h-5">
                                                        <Menu.Button className="w-5 h-5 text-slate-500">
                                                            <Lucide
                                                                icon="MoreVertical"
                                                                className="w-5 h-5 stroke-slate-400/70 fill-slate-400/70"
                                                            />
                                                        </Menu.Button>
                                                        <Menu.Items className="w-40">
                                                            <Menu.Item
                                                                onClick={() => {
                                                                    navigate(`/penilaian/edit/${faker.id}`);
                                                                }}>
                                                                <Lucide
                                                                    icon="CheckSquare"
                                                                    className="w-4 h-4 mr-2"
                                                                />{" "}
                                                                Edit
                                                            </Menu.Item>
                                                            <Menu.Item className="text-danger">
                                                                <Lucide
                                                                    icon="Trash2"
                                                                    className="w-4 h-4 mr-2"
                                                                />
                                                                Delete
                                                            </Menu.Item>
                                                        </Menu.Items>
                                                    </Menu>
                                                </div>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </div>
                        <div className="flex flex-col-reverse flex-wrap items-center p-5 flex-reverse gap-y-2 sm:flex-row">
                            <Pagination className="flex-1 w-full mr-auto sm:w-auto">
                                <Pagination.Link>
                                    <Lucide icon="ChevronsLeft" className="w-4 h-4" />
                                </Pagination.Link>
                                <Pagination.Link>
                                    <Lucide icon="ChevronLeft" className="w-4 h-4" />
                                </Pagination.Link>
                                <Pagination.Link>...</Pagination.Link>
                                <Pagination.Link>1</Pagination.Link>
                                <Pagination.Link active>2</Pagination.Link>
                                <Pagination.Link>3</Pagination.Link>
                                <Pagination.Link>...</Pagination.Link>
                                <Pagination.Link>
                                    <Lucide icon="ChevronRight" className="w-4 h-4" />
                                </Pagination.Link>
                                <Pagination.Link>
                                    <Lucide icon="ChevronsRight" className="w-4 h-4" />
                                </Pagination.Link>
                            </Pagination>
                            <FormSelect className="sm:w-20 rounded-[0.5rem]">
                                <option>10</option>
                                <option>25</option>
                                <option>35</option>
                                <option>50</option>
                            </FormSelect>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Main;
