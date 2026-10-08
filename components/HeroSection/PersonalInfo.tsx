import { Code } from "lucide-react";

const MacFolderIcon = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className="shrink-0"
    aria-hidden="true"
    focusable="false"
  >
    <path fill="#8BD5FF" d="M2 5a2 2 0 0 1 2-2h5l2 2h9a2 2 0 0 1 2 2v12H2Z" />
    <path fill="#38A9F5" d="M2 8h20v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z" />
    <path fill="#64C5FF" d="M2 8h20v2H2Z" />
  </svg>
);

/** Confirmed featured project under the hero. */
const PersonalInfo = () => (
  <div className="col-span-2 my-5 flex items-center justify-between gap-4 rounded-xl border p-4">
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="bg-success/20 absolute -inset-1 animate-pulse rounded-full" />
        <div className="bg-success relative z-10 h-2 w-2 rounded-full" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-medium tracking-wider uppercase">
          Featured Project
        </span>
        <span className="flex items-center gap-1 text-sm font-medium">
          <MacFolderIcon size={16} />
          Distributed File Storage System
        </span>
      </div>
    </div>
    <Code size={18} className="text-content-secondary" aria-hidden />
  </div>
);

export default PersonalInfo;
