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

  return (
    <>
      <div className="flex flex-col justify-between px-5 py-3 border-t border-slate-200/60 sm:items-center sm:flex-row gap-x-2">
        <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2">
          <div className="flex-1 w-full mt-3 xl:mt-0">
            <FormSelect id="department">
              <option value="" selected disabled>
                Nama Paket
              </option>
              {data.map((faker, fakerKey) => (
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
                Penyedia
              </Table.Td>
              <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                Skenario Penayangan
              </Table.Td>
              <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                Nomor Paket
              </Table.Td>
              <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                Paket
              </Table.Td>
              <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                Tgl Berlaku
              </Table.Td>
              <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                Tgl Status
              </Table.Td>
              <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                Durasi Sanksi
              </Table.Td>
              <Table.Td className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                Status
              </Table.Td>
              {/* <Table.Td className="w-20 py-4 font-medium text-center border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-400">
                Aksi
              </Table.Td> */}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {_.take(data, 10).map((faker, fakerKey) => (
              <Table.Tr key={fakerKey} className="[&_td]:last:border-b-0">
                <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                  <FormCheck.Input type="checkbox" />
                </Table.Td>
                <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                  {fakerKey + 1}
                </Table.Td>
                <Table.Td className="py-4 border-dashed dark:bg-darkmode-600 ">
                  {faker.nama_perusahaan}
                </Table.Td>
                <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                  {faker.skenario}
                </Table.Td>
                <Table.Td className="py-4 border-dashed capitalize dark:bg-darkmode-600">
                  {faker.no_paket}
                </Table.Td>
                <Table.Td className="py-4 border-dashed capitalize dark:bg-darkmode-600">
                  {faker.paket}
                </Table.Td>
                <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                  {new Date(faker.masa_blacklist).toLocaleDateString("id-ID")}
                </Table.Td>
                <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                  {new Date(faker.tanggal_blacklist).toLocaleDateString(
                    "id-ID",
                  )}
                </Table.Td>
                <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                  {faker.duration_blacklist}
                </Table.Td>
                <Table.Td className="py-4 border-dashed text-red-700 dark:bg-darkmode-600">
                  {faker.status}
                </Table.Td>
                {/* <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                  <Link
                    className="text-blue-700 hover:underline"
                    to={`/daftar-hitam/detail/${faker.id}`}
                  >
                    Lihat Detail
                  </Link>
                </Table.Td> */}
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
