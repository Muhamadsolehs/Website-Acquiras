import Lucide from "@/components/Base/Lucide";
import { FormInput, FormSelect } from "@/components/Base/Form";
import categories from "@/fakers/categories";
import kriteria from "@/fakers/kriteria";
import Button from "@/components/Base/Button";
import _ from "lodash";
import { useNavigate, useParams } from "react-router-dom";

function Main() {
  const navigate = useNavigate();
  const { id } = useParams();
  const data = kriteria.fakeKriterias().find((item) => item.id === id);

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        <div className="flex flex-col mt-4 md:mt-0 md:h-10 gap-y-3 md:items-center md:flex-row">
          <div className="text-base font-medium group-[.mode--light]:text-white">
            Ubah Kriteria Penilaian
          </div>
        </div>
        <div className="mt-3.5 grid grid-cols-12 xl:grid-cols-10 gap-y-7 lg:gap-y-10 gap-x-6">
          <div className="relative flex flex-col col-span-12 gap-y-7">
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
                          <div className="font-medium">Kategori</div>
                          <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                            Wajib Diisi
                          </div>
                        </div>
                      </div>
                    </label>
                    <div className="flex-1 w-full mt-3 xl:mt-0">
                      <FormSelect id="category">
                        {categories.fakeCategories().map((faker, fakerKey) => (
                          <option key={fakerKey} value={fakerKey}>
                            {faker.name}
                          </option>
                        ))}
                      </FormSelect>
                    </div>
                  </div>
                  <div className="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
                    <label className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
                      <div className="text-left">
                        <div className="flex items-center">
                          <div className="font-medium">Nama Kriteria</div>
                          <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                            Wajib Diisi
                          </div>
                        </div>
                      </div>
                    </label>
                    <div className="flex-1 w-full mt-3 xl:mt-0">
                      <FormInput
                        type="text"
                        placeholder="Nama Kriteria"
                        value={data?.name}
                      />
                    </div>
                  </div>
                  <div className="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
                    <label className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
                      <div className="text-left">
                        <div className="flex items-center">
                          <div className="font-medium">Kategori</div>
                          <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                            Wajib Diisi
                          </div>
                        </div>
                      </div>
                    </label>
                    <div className="flex-1 w-full mt-3 xl:mt-0">
                      <FormSelect id="category">
                        <option value="">Aktif</option>
                        <option value="">Tidak Aktif</option>
                      </FormSelect>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-end gap-3 mt-1 md:flex-row">
              <Button
                onClick={() => navigate("/penilaian")}
                variant="outline-secondary"
                className="w-full border-slate-300/80 bg-white/80 md:w-56 py-2.5 rounded-[0.5rem] dark:bg-darkmode-400"
              >
                <Lucide icon="PenLine" className="stroke-[1.3] w-4 h-4 mr-2" />
                Batalkan
              </Button>
              <Button
                variant="primary"
                className="w-full md:w-56 py-2.5 rounded-[0.5rem]"
              >
                <Lucide icon="PenLine" className="stroke-[1.3] w-4 h-4 mr-2" />
                Simpan Data
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
