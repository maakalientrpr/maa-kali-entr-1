import Image from "next/image";
import { CheckIcon } from "lucide-react";

export default function CateringService() {
  return (
    <div className="mx-10 my-10 p-10 rounded-xl bg-white grid grid-cols-1 sm:grid-cols-2 gap-10 items-center shadow-md">
      {/* Left Section */}
      <div className="flex flex-col gap-5">
        <h2 className="text-3xl font-semibold">Premium Catering Services</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          From intimate family gatherings to grand celebrations, our expert
          chefs create memorable dining experiences with authentic flavours and
          beautiful presentation.
        </p>

        <ul className="space-y-2 text-sm">
          <li className="flex gap-2 items-start">
            <CheckIcon className="text-orange-500 w-5 h-5" />
            Multi-cuisine menus (Indian, Chinese, Continental)
          </li>

          <li className="flex gap-2 items-start">
            <CheckIcon className="text-orange-500 w-5 h-5" />
            Vegetarian & Non-vegetarian options
          </li>

          <li className="flex gap-2 items-start">
            <CheckIcon className="text-orange-500 w-5 h-5" />
            Live counters and custom setups
          </li>

          <li className="flex gap-2 items-start">
            <CheckIcon className="text-orange-500 w-5 h-5" />
            Professional service staff included
          </li>
        </ul>

      </div>

      {/* Right Section */}
      <div className="w-full flex justify-center">
        <Image
          src={"/catering.jpg"}
          alt="Catering Service Image"
          width={500}
          height={400}
          className="rounded-lg object-cover shadow"
          
        />
      </div>
    </div>
  );
}
