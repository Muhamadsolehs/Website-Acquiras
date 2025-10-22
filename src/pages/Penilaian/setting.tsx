import Lucide from "@/components/Base/Lucide";
import { FormCheck } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import kriteria from "@/fakers/kriteria";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

function Main() {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        <div className="flex flex-col mt-4 md:mt-0 md:h-10 gap-y-3 md:items-center md:flex-row">
          <div className="text-base font-medium group-[.mode--light]:text-white">
            Setting Aturan Kriteria
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
                  Aturan <span className="text-danger ml-2">X</span>
                </div>
                <div className="mt-5">
                  <div className="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
                    <div className="flex-1 w-full mt-3 xl:mt-0">
                      {kriteria.fakeKriterias().map((faker, fakerKey) => (
                        <FormCheck className="mr-4 mt-5" key={fakerKey}>
                          <FormCheck.Input
                            id={`condition-${fakerKey}`}
                            type="checkbox"
                            name="horizontal_radio_button"
                            value="horizontal-radio-chris-evans"
                          />
                          <FormCheck.Label htmlFor={`condition-${fakerKey}`}>
                            {faker.name}
                          </FormCheck.Label>
                        </FormCheck>
                      ))}
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
