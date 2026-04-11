import NoDataImg from "@/public/img/no-data.webp";
import Image from "next/image";

export function NoData() {
  return (
    <div className="flex h-80 items-center justify-center">
      <Image src={NoDataImg} width={200} alt="No data" />
    </div>
  );
}
