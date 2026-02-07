import Lucide from "@/components/Base/Lucide";
import { Menu } from "@/components/Base/Headless";
import Pagination from "@/components/Base/Pagination";
import { FormSelect, FormCheck } from "@/components/Base/Form";
import Table from "@/components/Base/Table";
import Button from "@/components/Base/Button";
import _ from "lodash";
import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

interface MainTableProps {
  data: any[];
}

function MainTable({ data }: MainTableProps) {
  const navigate = useNavigate();
  const [jenisTab, setJenisTab] = useState<"tender" | "non tender">("tender");

  const filteredData = useMemo(
    () => data.filter((item) => item.jenis_paket === jenisTab),
    [data, jenisTab]
  );

  return (
    <>
      <div className="flex flex-col gap-y-2 px-5 pt-5 sm:flex-row sm:items-center">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant={jenisTab === "tender" ? "primary" : "outline-secondary"}
            className="w-full sm:w-auto"
            onClick={() => setJenisTab("tender")}
          >
            Tender
          </Button>
          <Button
            variant={jenisTab === "non tender" ? "primary" : "outline-secondary"}
            className="w-full sm:w-auto"
            onClick={() => setJenisTab("non tender")}
          >
            Non Tender
          </Button>
        </div>
      </div>
      <div className="flex flex-col justify-between px-5 py-3 border-t border-slate-200/60 sm:items-center sm:flex-row gap-x-2">
        <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2">
          <div className="flex-1 w-full mt-3 xl:mt-0">
            <FormSelect id="department">
              <option value="" selected disabled>
                Nama Paket
              </option>
              {filteredData.map((faker, fakerKey) => (
                <option key={fakerKey} value={fakerKey}>
                  {faker.nama_paket}
                </option>
              ))}
            </FormSelect>
          </div>
          <div className="flex-1 w-full mt-3 xl:mt-0">
            <FormSelect id="department">
              <option value="" selected disabled>
                Jenis Paket
              </option>
              <option value="tender">Tender</option>
              <option value="non tender">Non Tender</option>
            </FormSelect>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2">
          <div>
            <Button
              variant="primary"
              className="w-32 ml-2 flex flex-row justify-center gap-x-2"
            >
              <Lucide
                icon="Search"
                className="w-4 h-4 stroke-[1.3] text-white"
              />
              Cari
            </Button>
          </div>
          <div>
            <Button
              variant="soft-warning"
              className="w-32 ml-2 flex flex-row justify-center gap-x-2"
            >
              <Lucide icon="X" className="w-4 h-4 stroke-[1.3] text-warning" />
              Atur Ulang
            </Button>
          </div>
        </div>
      </div>
      <div className="overflow-auto xl:overflow-visible">
        <Table className="border-b border-slate-200/60">
          <Table.Thead>
            <Table.Tr>
              <Table.Td className="w-5 py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                <FormCheck.Input type="checkbox" />
              </Table.Td>
              <Table.Td className="w-5 py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                No
              </Table.Td>
              <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                Kode Paket
              </Table.Td>
              <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                Nama Paket
              </Table.Td>
              <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                Jenis Paket
              </Table.Td>
              <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                Tahap Paket
              </Table.Td>
              <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                Tgl Dibuat
              </Table.Td>
              <Table.Td className="w-20 py-4 font-medium text-center border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                Aksi
              </Table.Td>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {_.take(filteredData, 10).map((faker, fakerKey) => (
              <Table.Tr key={fakerKey} className="[&_td]:last:border-b-0">
                <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                  <FormCheck.Input type="checkbox" />
                </Table.Td>
                <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                  {fakerKey + 1}
                </Table.Td>
                <Table.Td className="py-4 border-dashed dark:bg-darkmode-600 text-blue-700">
                  <Link to={`/master-lelang/show/${faker.id}`}>{faker.kode_paket}</Link>
                </Table.Td>
                <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                  {faker.nama_paket}
                </Table.Td>
                <Table.Td className="py-4 border-dashed capitalize dark:bg-darkmode-600">
                  {faker.jenis_paket}
                </Table.Td>
                <Table.Td className="py-4 border-dashed capitalize dark:bg-darkmode-600">
                  {faker.tahap}
                </Table.Td>
                <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                  {new Date(faker.dateCreated).toLocaleDateString("id-ID")}
                </Table.Td>
                <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
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
                          onClick={() => navigate(`/master-lelang/edit/${faker.id}`)}
                        >
                          <Lucide icon="CheckSquare" className="w-4 h-4 mr-2" />{" "}
                          Ubah
                        </Menu.Item>
                        <Menu.Item className="text-danger">
                          <Lucide icon="Trash2" className="w-4 h-4 mr-2" />
                          Hapus
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
    </>
  );
}

export default MainTable;
