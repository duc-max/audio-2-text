"use client";

import { useState, useContext } from "react";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
  ChevronUpIcon,
} from "@heroicons/react/20/solid";
import "./Header.css";
import { Switch } from "antd";
import { Context } from "../../context/Context";

const products = [
  {
    name: "Analytics",
    description: "Get a better understanding of your traffic",
    href: "#",
    icon: ChartPieIcon,
  },
  {
    name: "Engagement",
    description: "Speak directly to your customers",
    href: "#",
    icon: CursorArrowRaysIcon,
  },
  {
    name: "Security",
    description: "Your customers’ data will be safe and secure",
    href: "#",
    icon: FingerPrintIcon,
  },
  {
    name: "Integrations",
    description: "Connect with third-party tools",
    href: "#",
    icon: SquaresPlusIcon,
  },
  {
    name: "Automations",
    description: "Build strategic funnels that will convert",
    href: "#",
    icon: ArrowPathIcon,
  },
];
const callsToAction = [
  { name: "Watch demo", href: "#", icon: PlayCircleIcon },
  { name: "Contact sales", href: "#", icon: PhoneIcon },
];

export default function Headertw() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDarkMode, handleThemeChange, hover, setHover } =
    useContext(Context);
  return (
    <header
      className=" header-container py-1 border-b border-orange-500 rounded"
      style={{ backgroundColor: isDarkMode ? "#1f1f1f" : "#fff" }}
    >
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8 "
      >
        <div className="flex lg:flex-1">
          <a href="#" className=" -m-1.5 p-1.5 no-underline">
            <span className="sr-only">BKAV</span>
            <img
              alt=""
              src="/assets/Logo_Bkav.svg.png"
              className="h-8 w-auto"
            />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <a
            href="#"
            className="hover:text-[rgb(239,91,30)]  no-underline text-sm font-semibold leading-6 text-gray-900"
            style={{
              color: !isDarkMode ? "#1f1f1f" : "#fff",
            }}
          >
            Giới thiệu
          </a>
          {/* <Popover className="relative"> */}
          {/* <PopoverButton
              onClick={() => setHover(!hover)}
              className="flex items-center gap-x-1 text-sm font-semibold leading-6 "
              style={{
                color: !isDarkMode ? "#1f1f1f" : "#fff",
              }}
            >
              <a
                href="#"
                className="hover:text-[rgb(239,91,30)]  no-underline text-sm font-semibold leading-6 text-gray-900"
                style={{
                  color: !isDarkMode ? "#1f1f1f" : "#fff",
                }}
              >
                Sản phẩm khác
              </a>

              {!hover ? (
                <ChevronDownIcon
                  onMouseOver={() => console.log("hover")}
                  aria-hidden="true"
                  className="h-5 w-5 flex-none text-gray-400"
                />
              ) : (
                <ChevronUpIcon
                  onMouseOver={() => console.log("hover")}
                  aria-hidden="true"
                  className="h-5 w-5 flex-none text-gray-400"
                />
              )}
            </PopoverButton> */}

          {/* <PopoverPanel
              transition
              className={`absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl ${
                isDarkMode ? "bg-zinc-900" : "bg-gray-50"
              }`}
            >
              <div
                className={`p-4  overflow-scroll  ${
                  isDarkMode ? "bg-zinc-900" : "bg-gray-50"
                } rounded-3xl`}
              >
                {products.map((item) => (
                  <div
                    key={item.name}
                    className="group relative flex items-center gap-x-6 rounded-lg p-1 text-sm leading-6 "
                  >
                    <div
                      className={`flex h-11 w-11 flex-none items-center justify-center rounded-lg ${
                        !isDarkMode ? "bg-gray-50" : "bg-[rgb(23,23,23)]"
                      }  group-hover:bg-white`}
                    >
                      <item.icon
                        aria-hidden="true"
                        className=" h-6 w-6 text-gray-600 group-hover:text-[rgb(239,91,30)]  "
                      />
                    </div>
                    <div className="flex-auto">
                      <a
                        href={item.href}
                        className={`hover:text-[rgb(239,91,30)] block font-semibold ${
                          !isDarkMode
                            ? "text-gray-900"
                            : "text-[rgb(255,255,255)]"
                        } no-underline`}
                      >
                        {item.name}
                        <span className="absolute inset-0" />
                      </a>
                      <p className="mt-1 text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div> */}
          {/* <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                {callsToAction.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="hover:text-[rgb(239,91,30)] flex items-center justify-center no-underline gap-x-2.5 p-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-100"
                  >
                    <item.icon
                      aria-hidden="true"
                      className=" hover:text-[rgb(239,91,30)] h-5 w-5 flex-none "
                      style={{
                        color: !isDarkMode ? "#1f1f1f" : "#fff",
                      }}
                    />
                    {item.name}
                  </a>
                ))}
              </div> */}
          {/* </PopoverPanel>
          </Popover> */}
          <a
            href="#"
            className="hover:text-[rgb(239,91,30)] no-underline text-sm font-semibold leading-6 text-gray-900"
            style={{
              color: !isDarkMode ? "#1f1f1f" : "#fff",
            }}
          >
            Bộ chuyển đổi
          </a>
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Switch
            style={{ backgroundColor: isDarkMode ? "#ef5b1e" : "" }}
            checkedChildren="Sáng"
            unCheckedChildren="Tối  "
            onChange={handleThemeChange}
            checked={isDarkMode}
          />
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden header-menu--wrapper"
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel
          className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto  px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 border-l border-orange-500 rounded"
          style={{
            backgroundColor: isDarkMode ? "#1f1f1f" : "#fff",
          }}
        >
          <div className="flex items-center justify-between">
            <a
              href="#"
              className="hover:text-[rgb(239,91,30)] no-underline -m-1.5 p-1.5"
            >
              <span className="sr-only">BKAV</span>
              <img
                alt=""
                src="assets/Logo_Bkav.svg.png"
                className="h-8 w-auto"
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <a
                  href="#"
                  className="hover:text-[rgb(239,91,30)] no-underline -mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7  "
                  style={{
                    color: !isDarkMode ? "#1f1f1f" : "#fff",
                  }}
                >
                  Giới thiệu
                </a>
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton
                    className="group flex w-full block rounded-lg px-3 items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 "
                    style={{
                      color: !isDarkMode ? "#1f1f1f" : "#fff",
                    }}
                  >
                    Sản phẩm khác
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="h-5 w-5 flex-none group-data-[open]:rotate-180"
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {[...products, ...callsToAction].map((item) => (
                      <DisclosureButton
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="hover:text-[rgb(239,91,30)] no-underline block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7"
                        style={{
                          color: !isDarkMode ? "#1f1f1f" : "#fff",
                        }}
                      >
                        {item.name}
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                </Disclosure>
                <a
                  href="#"
                  className="hover:text-[rgb(239,91,30)] no-underline -mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7  "
                  style={{
                    color: !isDarkMode ? "#1f1f1f" : "#fff",
                  }}
                >
                  Bộ chuyển đổi
                </a>
              </div>
              <div className="py-6">
                <Switch
                  style={{ backgroundColor: isDarkMode ? "#ef5b1e" : "" }}
                  checkedChildren="Sáng"
                  unCheckedChildren="Tối"
                  onChange={handleThemeChange}
                  checked={isDarkMode}
                />
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
