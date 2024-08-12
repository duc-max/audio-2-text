import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
const Footertw = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gray-800 text-white">
      <div className="container mx-auto py-4 px-6 flex items-center justify-between">
        <span className="text-sm">
          © 2022 Your Company. All rights reserved.
        </span>
        <Disclosure>
          {({ open }) => (
            <>
              <DisclosureButton className="focus:outline-none">
                <ChevronUpIcon
                  className={`h-5 w-5 transform ${open ? "rotate-180" : ""}`}
                />
              </DisclosureButton>
              <DisclosurePanel className="mt-2">
                <ul className="flex space-x-4">
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-white">
                      Contact Us
                    </a>
                  </li>
                </ul>
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
      </div>
    </footer>
  );
};

export default Footertw;
