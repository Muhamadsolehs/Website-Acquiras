import Lucide from "@/components/Base/Lucide";
import TomSelect from "@/components/Base/TomSelect";
import { Link, useLocation } from "react-router-dom";
import {
  FormLabel,
  FormCheck,
  FormInput,
  FormSelect,
  FormSwitch,
  FormHelp,
} from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import _, { first, set } from "lodash";
import { fetchUserInfo } from "@/utils/auth";
import useLogout from "@/hooks/useLogout";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
const profile = "src/assets/images/avatar/person_1.png";

function Main() {
  const { updateUser } = useAuth();
  const { logout } = useLogout();
  const [profileImage, setProfileImage] = useState(profile);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  })

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);


  const handleChange = (e: any) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchUserInfo();
        setForm({
          firstName: data.given_name || "",
          lastName: data.family_name || "",
          email: data.email || "",
        });
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    })();
  }, []);

  const handleSumbit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateUser(form)
      toast.success("Profile updated successfully!", {
        description: "Your changes have been saved.",
        icon: <Lucide icon="CheckCircle2" className="w-5 h-5 text-success" />,
      });
    } catch (err) {
      toast.error("Update failed!", {
        description: "Please check your connection or try again later.",
        icon: <Lucide icon="AlertTriangle" className="w-5 h-5 text-danger" />,
      });
      console.log(err);
    }
  }


  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
          <div className="text-base font-medium group-[.mode--light]:text-white">
            Settings
          </div>
          <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 md:ml-auto">
            <Button
              variant="primary"
              className="group-[.mode--light]:!bg-white/[0.12] group-[.mode--light]:!text-slate-200 group-[.mode--light]:!border-transparent dark:group-[.mode--light]:!bg-darkmode-900/30 dark:!box"
            >
              <Lucide
                onClick={logout}
                icon="ExternalLink"
                className="stroke-[1.3] w-4 h-4 mr-3"
              />{" "}
              Logout
            </Button>
          </div>
        </div>
        <div className="mt-3.5 grid grid-cols-12 gap-y-10 gap-x-6">
          <div className="relative col-span-12 xl:col-span-3">
            <div className="sticky top-[104px]">
              <div className="flex flex-col px-5 pt-5 pb-6 box box--stacked">
                <Link
                  to="/profile"
                  className={clsx([
                    "flex items-center py-3 first:-mt-3 last:-mb-3 [&.active]:text-primary [&.active]:font-medium hover:text-primary",
                    { active: queryParams.get("page") === null },
                  ])}
                >
                  <Lucide
                    icon="AppWindow"
                    className="stroke-[1.3] w-4 h-4 mr-3"
                  />{" "}
                  Profile Info
                </Link>
                <Link
                  to="/profile?page=security"
                  className={clsx([
                    "flex items-center py-3 first:-mt-3 last:-mb-3 [&.active]:text-primary [&.active]:font-medium hover:text-primary",
                    { active: queryParams.get("page") === "security" },
                  ])}
                >
                  <Lucide
                    icon="KeyRound"
                    className="stroke-[1.3] w-4 h-4 mr-3"
                  />{" "}
                  Security
                </Link>
                <Link
                  to="/profile?page=two-factor-authentication"
                  className={clsx([
                    "flex items-center py-3 first:-mt-3 last:-mb-3 [&.active]:text-primary [&.active]:font-medium hover:text-primary",
                    {
                      active:
                        queryParams.get("page") === "two-factor-authentication",
                    },
                  ])}
                >
                  <Lucide
                    icon="ShieldCheck"
                    className="stroke-[1.3] w-4 h-4 mr-3"
                  />{" "}
                  Two-factor Authentication
                </Link>
                <Link
                  to="/profile?page=account-deactivation"
                  className={clsx([
                    "flex items-center py-3 first:-mt-3 last:-mb-3 [&.active]:text-primary [&.active]:font-medium hover:text-primary",
                    {
                      active:
                        queryParams.get("page") === "account-deactivation",
                    },
                  ])}
                >
                  <Lucide icon="Trash2" className="stroke-[1.3] w-4 h-4 mr-3" />{" "}
                  Account Deactivation
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col col-span-12 xl:col-span-9 gap-y-7">
            <div className="p-1.5 box flex flex-col box--stacked">
              <div className="h-60 relative w-full rounded-[0.6rem] bg-gradient-to-b from-theme-1/95 to-theme-2/95">
                <div
                  className={clsx([
                    "w-full h-full relative overflow-hidden",
                    "before:content-[''] before:absolute before:inset-0 before:bg-texture-white before:-mt-[50rem]",
                    "after:content-[''] after:absolute after:inset-0 after:bg-texture-white after:-mt-[50rem]",
                  ])}
                ></div>
                <div className="absolute inset-x-0 top-0 w-32 h-32 mx-auto mt-36">
                  <div className="w-full h-full overflow-hidden border-[6px] box border-white rounded-full image-fit">
                    <img
                      alt="Tailwise - Admin Dashboard Template"
                      src={profileImage}
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-5 h-5 mb-2.5 mr-2.5 border-2 border-white rounded-full bg-success box"></div>
                </div>
              </div>
              <div className="p-5 flex flex-col sm:flex-row gap-y-3 sm:items-end rounded-[0.6rem] bg-slate-50 pt-12 dark:bg-darkmode-500">
                <Button
                  variant="outline-primary"
                  className="sm:ml-auto border-primary/50 relative overflow-hidden "
                >
                  <Lucide
                    icon="Image"
                    className="stroke-[1.3] w-4 h-4 mr-2.5 cursor-pointer"
                  />{" "}
                  <span>
                    Ganti Foto
                  </span>
                  <FormInput
                    id="horizontal-form-1"
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    name="profile"
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </Button>
              </div>
            </div>
            {queryParams.get("page") === null && (
              <form onSubmit={handleSumbit}>
                <div className="flex flex-col p-5 box box--stacked">
                  <div className="pb-5 mb-6 font-medium border-b border-dashed border-slate-300/70 text-[0.94rem]">
                    Profile Info
                  </div>
                  <div>
                    <div className="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
                      <label className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
                        <div className="text-left">
                          <div className="flex items-center">
                            <div className="font-medium">Full Name</div>
                            <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                              Required
                            </div>
                          </div>
                          <div className="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80 dark:text-slate-400">
                            Enter your full legal name as it appears on your
                            official identification.
                          </div>
                        </div>
                      </label>
                      <div className="flex-1 w-full mt-3 xl:mt-0">
                        <div className="flex flex-col items-center md:flex-row">
                          <FormInput
                            value={form.firstName}
                            name="firstName"
                            onChange={handleChange}
                            type="text"
                            className="first:rounded-b-none first:md:rounded-bl-md first:md:rounded-r-none [&:not(:first-child):not(:last-child)]:-mt-px [&:not(:first-child):not(:last-child)]:md:mt-0 [&:not(:first-child):not(:last-child)]:md:-ml-px [&:not(:first-child):not(:last-child)]:rounded-none last:rounded-t-none last:md:rounded-l-none last:md:rounded-tr-md last:-mt-px last:md:mt-0 last:md:-ml-px focus:z-10"
                            placeholder="John"
                          />
                          <FormInput
                            value={form.lastName}
                            name="lastName"
                            onChange={handleChange}
                            type="text"
                            className="first:rounded-b-none first:md:rounded-bl-md first:md:rounded-r-none [&:not(:first-child):not(:last-child)]:-mt-px [&:not(:first-child):not(:last-child)]:md:mt-0 [&:not(:first-child):not(:last-child)]:md:-ml-px [&:not(:first-child):not(:last-child)]:rounded-none last:rounded-t-none last:md:rounded-l-none last:md:rounded-tr-md last:-mt-px last:md:mt-0 last:md:-ml-px focus:z-10"
                            placeholder="Smith"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
                      <label className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-60 xl:mr-14">
                        <div className="text-left">
                          <div className="flex items-center">
                            <div className="font-medium">Email</div>
                            <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                              Required
                            </div>
                          </div>
                          <div className="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80 dark:text-slate-400">
                            Please provide a valid email address that you have
                            access to.
                          </div>
                        </div>
                      </label>
                      <div className="flex-1 w-full mt-3 xl:mt-0">
                        <FormInput
                          type="text"
                          className="form-control"
                          placeholder="Email"
                          value={form.email}
                          name="email"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex pt-5 mt-6 border-t border-dashed md:justify-end border-slate-300/70">
                    <Button
                      type="submit"
                      variant="outline-primary"
                      className="w-full px-4 border-primary/50 md:w-auto"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </form>
            )}
            {queryParams.get("page") === "security" && (
              <div className="flex flex-col p-5 box box--stacked">
                <div className="pb-5 mb-6 font-medium border-b border-dashed border-slate-300/70 text-[0.94rem]">
                  Security
                </div>
                <div>
                  <div className="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
                    <label className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-64 xl:mr-14">
                      <div className="text-left">
                        <div className="flex items-center">
                          <div className="font-medium">Current Password</div>
                          <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                            Required
                          </div>
                        </div>
                        <div className="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80 dark:text-slate-400">
                          Enter your current password to verify your identity.
                        </div>
                      </div>
                    </label>
                    <div className="flex-1 w-full mt-3 xl:mt-0">
                      <FormInput type="text" placeholder="P**********d" />
                    </div>
                  </div>
                  <div className="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
                    <label className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-64 xl:mr-14">
                      <div className="text-left">
                        <div className="flex items-center">
                          <div className="font-medium">New Password</div>
                          <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                            Required
                          </div>
                        </div>
                        <div className="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80 dark:text-slate-400">
                          Create a new password for your account.
                        </div>
                      </div>
                    </label>
                    <div className="flex-1 w-full mt-3 xl:mt-0">
                      <FormInput type="text" placeholder="P**********d" />
                    </div>
                  </div>
                  <div className="flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
                    <label className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-64 xl:mr-14">
                      <div className="text-left">
                        <div className="flex items-center">
                          <div className="font-medium">
                            Confirm New Password
                          </div>
                          <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                            Required
                          </div>
                        </div>
                        <div className="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80 dark:text-slate-400">
                          Please re-enter the new password you've just chosen.
                        </div>
                      </div>
                    </label>
                    <div className="flex-1 w-full mt-3 xl:mt-0">
                      <FormInput type="text" placeholder="P**********d" />
                      <div className="mt-4 text-slate-500">
                        <div className="font-medium">
                          Password requirements:
                        </div>
                        <ul className="flex flex-col gap-1 pl-3 mt-2.5 list-disc text-slate-500">
                          <li className="pl-0.5">
                            Passwords must be at least 8 characters long.
                          </li>
                          <li className="pl-0.5">
                            Include at least one numeric digit (0-9).
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex pt-5 mt-6 border-t border-dashed md:justify-end border-slate-300/70">
                  <Button
                    variant="outline-primary"
                    className="w-full px-4 border-primary/50 md:w-auto"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
            {queryParams.get("page") === "two-factor-authentication" && (
              <div className="flex flex-col p-5 box box--stacked">
                <div className="flex items-center pb-5 mb-6 font-medium border-b border-dashed border-slate-300/70 text-[0.94rem]">
                  Two-Factor Authentication (2FA)
                  <div className="flex items-center text-xs font-medium rounded-md text-success bg-success/10 border border-success/10 px-1.5 py-px ml-3">
                    <span className="-mt-px">Enabled</span>
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">
                    Enhance your account security by enabling Two-Factor
                    Authentication in the settings.
                  </div>
                  <div className="flex-col block pt-5 mt-2 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0">
                    <label className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:w-64 xl:mr-14">
                      <div className="text-left">
                        <div className="flex items-center">
                          <div className="font-medium">Account Password</div>
                          <div className="ml-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                            Required
                          </div>
                        </div>
                        <div className="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80 dark:text-slate-400">
                          Enter your current password to verify your identity.
                        </div>
                      </div>
                    </label>
                    <div className="flex-1 w-full mt-3 xl:mt-0">
                      <FormInput type="text" placeholder="P**********d" />
                      <FormHelp>
                        This is the password you use to log in to your account.
                      </FormHelp>
                    </div>
                  </div>
                </div>
                <div className="flex pt-5 mt-6 border-t border-dashed md:justify-end border-slate-300/70">
                  <Button
                    variant="outline-primary"
                    className="w-full px-4 border-primary/50 md:w-auto"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
            {queryParams.get("page") === "account-deactivation" && (
              <div className="flex flex-col p-5 box box--stacked">
                <div className="flex items-center pb-5 mb-6 font-medium border-b border-dashed border-slate-300/70 text-[0.94rem]">
                  Account Deactivation
                </div>
                <div>
                  <div className="leading-relaxed">
                    When you initiate the account deletion process, you'll no
                    longer have access to Front account services, and your
                    personal data will be permanently removed. You have a 10-day
                    window to cancel the deletion if needed.
                  </div>
                  <FormCheck className="mt-5">
                    <FormCheck.Input
                      id="checkbox-switch-1"
                      type="checkbox"
                      value=""
                    />
                    <FormCheck.Label htmlFor="checkbox-switch-1">
                      Confirm that I want to delete my account.
                    </FormCheck.Label>
                  </FormCheck>
                </div>
                <div className="flex flex-col-reverse gap-3 pt-5 mt-6 border-t border-dashed md:flex-row md:justify-end border-slate-300/70">
                  <Button
                    variant="outline-secondary"
                    className="w-full px-4 md:w-auto"
                  >
                    Learn More
                  </Button>
                  <Button
                    variant="outline-danger"
                    className="w-full px-4 border-danger/50 bg-danger/5 md:w-auto"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
