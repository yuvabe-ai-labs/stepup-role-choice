import { useState } from "react";
import { Search, Bell, Menu, ChevronLeft, ChevronRight, ChevronDown, X } from "lucide-react";

interface Internship {
  id: number;
  title: string;
  company: string;
  companyLogo: string;
  image: string;
  backgroundColor: string;
  postedDate: string;
  hasActualLogo: boolean;
}

const internships: Internship[] = [
  {
    id: 1,
    title: "Senior UI Developer",
    company: "Yuvabe",
    companyLogo: "https://api.builder.io/api/v1/image/assets/TEMP/a85bf719d0e6fc81fbdf53ca8ce0207e373177ba?width=62",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/405844cd829a87d5934931a3b97d713a1abdcaa6?width=632",
    backgroundColor: "#DAC8FF",
    postedDate: "1d ago",
    hasActualLogo: true,
  },
  {
    id: 2,
    title: "Senior UI Developer",
    company: "Upasana",
    companyLogo: "",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/06be6f19d7ec056429ebed6cdca40c11e26998ca?width=502",
    backgroundColor: "#F4FFD5",
    postedDate: "1d ago",
    hasActualLogo: false,
  },
  {
    id: 3,
    title: "Senior UI Developer",
    company: "Yuvabe",
    companyLogo: "https://api.builder.io/api/v1/image/assets/TEMP/a85bf719d0e6fc81fbdf53ca8ce0207e373177ba?width=62",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/405844cd829a87d5934931a3b97d713a1abdcaa6?width=632",
    backgroundColor: "#DAC8FF",
    postedDate: "1d ago",
    hasActualLogo: true,
  },
  {
    id: 4,
    title: "Barista Intern",
    company: "Marc's Cafe",
    companyLogo: "",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/5c612fef6a0fbd3487588554555830a911b37fad?width=628",
    backgroundColor: "#FFF3E3",
    postedDate: "2d ago",
    hasActualLogo: false,
  },
  {
    id: 5,
    title: "Senior UI Developer",
    company: "Upasana",
    companyLogo: "",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/06be6f19d7ec056429ebed6cdca40c11e26998ca?width=502",
    backgroundColor: "#F4FFD5",
    postedDate: "1d ago",
    hasActualLogo: false,
  },
  {
    id: 6,
    title: "Senior UI Developer",
    company: "Yuvabe",
    companyLogo: "https://api.builder.io/api/v1/image/assets/TEMP/7f2f6f6ae8fb0dfbf5060bfd73829f3d83cf6481?width=62",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/98d74c6e2904091bb14c0045c471b09a640c2f5c?width=632",
    backgroundColor: "#DAC8FF",
    postedDate: "1d ago",
    hasActualLogo: true,
  },
];

export default function Index() {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-20 py-4 md:py-5 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <svg
              className="w-24 md:w-32 lg:w-[139px]"
              viewBox="0 0 139 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.7263 27.0538C21.9086 27.0541 21.1162 26.7708 20.484 26.2522C19.8518 25.7336 19.419 25.0119 19.2594 24.2099C19.0998 23.408 19.2232 22.5755 19.6086 21.8544C19.994 21.1333 20.6176 20.5681 21.373 20.2553C22.1285 19.9424 22.969 19.9012 23.7514 20.1386C24.5339 20.3761 25.2097 20.8776 25.6638 21.5575C26.1179 22.2375 26.3222 23.0539 26.2418 23.8676C26.1613 24.6813 25.8012 25.4419 25.2228 26.0199C24.8951 26.3478 24.5059 26.608 24.0775 26.7854C23.6491 26.9628 23.19 27.054 22.7263 27.0538Z"
                fill="#0694A2"
              />
              <path
                d="M3.53952 8.21758C2.72098 8.21816 1.92758 7.93482 1.29458 7.41588C0.661571 6.89693 0.228147 6.1745 0.0681952 5.37174C-0.0917571 4.56899 0.0316647 3.73561 0.41742 3.01367C0.803175 2.29173 1.42738 1.72593 2.18363 1.41273C2.93987 1.09952 3.78134 1.05831 4.56457 1.2961C5.3478 1.5339 6.02432 2.03599 6.47878 2.71677C6.93324 3.39755 7.13752 4.21489 7.05678 5.02943C6.97605 5.84398 6.6153 6.60531 6.03604 7.18363C5.70883 7.51233 5.31974 7.77294 4.89124 7.95041C4.46274 8.12788 4.00332 8.21868 3.53952 8.21758Z"
                fill="#0694A2"
              />
              <path
                d="M22.5701 8.11338C21.7524 8.11365 20.9599 7.83035 20.3278 7.31178C19.6956 6.7932 19.2628 6.07144 19.1032 5.26951C18.9435 4.46758 19.0669 3.63511 19.4523 2.91398C19.8378 2.19285 20.4613 1.62769 21.2168 1.31482C21.9722 1.00195 22.8128 0.960741 23.5952 1.19821C24.3776 1.43568 25.0535 1.93713 25.5076 2.6171C25.9617 3.29707 26.1659 4.11347 26.0855 4.92717C26.0051 5.74087 25.645 6.5015 25.0666 7.07943C24.7389 7.40755 24.3498 7.66778 23.9214 7.84521C23.4929 8.02263 23.0337 8.11376 22.5701 8.11338Z"
                fill="#0694A2"
              />
              <path
                d="M3.6283 27.0546C2.92976 27.0544 2.24695 26.8472 1.66614 26.4591C1.08533 26.0709 0.632576 25.5194 0.365074 24.8741C0.0975716 24.2288 0.0273234 23.5187 0.163204 22.8335C0.299085 22.1483 0.634997 21.5188 1.12851 21.0244C1.28047 20.873 1.44707 20.7371 1.62585 20.6186L1.79926 20.5074C1.93014 20.4321 2.06102 20.3667 2.18208 20.3078C2.24752 20.2784 2.31624 20.2489 2.38822 20.2227C2.52875 20.1693 2.67313 20.1267 2.82012 20.0951L2.90846 20.069H2.96409L3.74936 20.0133C3.85895 20.0181 3.96819 20.0291 4.07656 20.0461H4.12237H4.22053H4.25325H4.28924H4.4921C5.87081 20.0254 7.18522 19.4596 8.14788 18.4724C9.11054 17.4852 9.64311 16.157 9.62912 14.7782V14.7389V14.6964C9.62912 14.6604 9.62912 14.6211 9.62912 14.5818C9.62912 14.5426 9.62912 14.4935 9.62912 14.4477V14.3692C9.62912 14.3005 9.62911 14.235 9.60948 14.1663L9.66838 13.3778C9.66838 13.3581 9.66838 13.3385 9.66838 13.3189L9.68474 13.2698C9.70955 13.1257 9.74454 12.9836 9.78944 12.8444C9.81371 12.7741 9.84212 12.7053 9.87451 12.6383C9.93602 12.5037 10.0048 12.3727 10.0806 12.2456C10.1134 12.19 10.1461 12.1344 10.1854 12.0788C10.3038 11.899 10.4397 11.7313 10.5911 11.5782C10.9113 11.2225 11.3006 10.9357 11.7351 10.7351C12.1696 10.5346 12.6404 10.4244 13.1188 10.4115C13.5972 10.3985 14.0733 10.4829 14.5181 10.6596C14.9628 10.8363 15.367 11.1016 15.7061 11.4393C16.0452 11.777 16.3121 12.1802 16.4905 12.6243C16.669 13.0684 16.7552 13.5441 16.7441 14.0225C16.733 14.501 16.6248 14.9722 16.4259 15.4075C16.2271 15.8428 15.9418 16.2332 15.5874 16.5548C15.4346 16.7052 15.2681 16.8411 15.0901 16.9606L14.9199 17.0685C14.7964 17.1427 14.6686 17.2094 14.5371 17.2681C14.4702 17.3017 14.4014 17.3312 14.331 17.3565C14.1916 17.4102 14.0483 17.4529 13.9023 17.4841L13.8173 17.507H13.7616L12.9665 17.5626C12.8749 17.5626 12.7768 17.5626 12.6721 17.5332H12.6033H12.5052H12.4757H12.4365H12.2303C10.8511 17.553 9.53582 18.1184 8.57245 19.1057C7.60908 20.093 7.07607 21.4217 7.09006 22.8011V22.8436V22.8829C7.09006 22.9221 7.09006 22.9581 7.09006 22.9974C7.09006 23.0366 7.09006 23.0857 7.09006 23.1315C7.08798 23.173 7.08798 23.2144 7.09006 23.2559C7.09343 23.3093 7.09343 23.3628 7.09006 23.4162V23.4358L7.03116 24.1917C7.03116 24.1917 7.00499 24.2931 6.99517 24.3225C6.96208 24.4702 6.91946 24.6156 6.86756 24.7577C6.84378 24.8261 6.81536 24.8928 6.78249 24.9573C6.72032 25.0914 6.65488 25.2223 6.57963 25.3532C6.54691 25.4056 6.50764 25.4677 6.46511 25.5299C6.3463 25.7046 6.21275 25.8688 6.06593 26.0207C5.73839 26.349 5.34924 26.6093 4.92081 26.7867C4.49238 26.9642 4.03312 27.0552 3.5694 27.0546H3.6283Z"
                fill="#0694A2"
              />
              <path
                d="M13.1654 27.0547C12.4669 27.0545 11.7841 26.8472 11.2032 26.4591C10.6224 26.071 10.1697 25.5195 9.90218 24.8742C9.63468 24.2289 9.56443 23.5188 9.70031 22.8336C9.83619 22.1484 10.1721 21.5188 10.6656 21.0244C10.8202 20.8738 10.9877 20.7369 11.1662 20.6154L11.3364 20.514C11.4594 20.4381 11.5873 20.3703 11.7192 20.3111C11.7868 20.2784 11.8555 20.249 11.9253 20.2228C12.0638 20.1707 12.206 20.1292 12.3507 20.0985L12.4914 20.0592L13.2897 20.0003C13.3846 20.0003 13.4861 20.0003 13.5908 20.0297H13.6497H13.7544H14.0292C15.4099 20.0082 16.7258 19.4403 17.6887 18.4505C18.6515 17.4606 19.1828 16.1296 19.1662 14.7488V14.5852V14.5655C19.1662 14.5263 19.1662 14.487 19.1662 14.4477V14.3365C19.1662 14.2743 19.1662 14.2122 19.1466 14.15L19.2022 13.3843C19.2022 13.3647 19.2349 13.2698 19.2415 13.2437C19.2766 13.0965 19.3192 12.9513 19.3691 12.8085C19.3953 12.7365 19.4247 12.6711 19.4574 12.6023V12.1901C19.6863 12.1428 19.7147 12.097 19.7454 12.0527C19.8667 11.8731 20.0036 11.7044 20.1544 11.5488C20.8257 10.9243 21.7135 10.5853 22.6302 10.6032C23.5469 10.6212 24.4207 10.9947 25.0671 11.6449C25.7135 12.2952 26.0819 13.1712 26.0945 14.088C26.107 15.0047 25.7627 15.8905 25.1343 16.5582C24.9816 16.7087 24.8151 16.8445 24.637 16.9639L24.5192 17.0359L24.457 17.0751C24.3366 17.1477 24.212 17.2132 24.084 17.2715C24.0153 17.3009 23.9466 17.3336 23.8779 17.3598C23.7363 17.4101 23.5921 17.4527 23.446 17.4874L23.3544 17.5103H23.2987L22.5135 17.5627C22.394 17.557 22.275 17.545 22.1568 17.5267H22.0521H22.0161H21.9474H21.7642C21.0803 17.5356 20.4048 17.6793 19.7764 17.9494C19.1481 18.2196 18.5791 18.6109 18.102 19.101C17.6249 19.5911 17.2491 20.1705 16.9961 20.8059C16.743 21.4414 16.6177 22.1205 16.6272 22.8044V22.8436V22.8829C16.6305 22.9232 16.6305 22.9637 16.6272 23.004C16.6272 23.0432 16.6272 23.0858 16.6272 23.125C16.6272 23.1643 16.6272 23.2003 16.6272 23.2428C16.6359 23.3025 16.6413 23.3626 16.6435 23.4228L16.6272 24.1982L16.5944 24.3193C16.5594 24.469 16.5157 24.6164 16.4636 24.761C16.4407 24.8265 16.4112 24.8886 16.385 24.9508V24.9737C16.3263 25.1021 16.2596 25.2266 16.1855 25.3467L16.0775 25.5234C15.7581 25.9988 15.3258 26.3875 14.8193 26.6548C14.3128 26.922 13.7479 27.0594 13.1752 27.0547H13.1654Z"
                fill="#0694A2"
              />
              <path
                d="M3.6283 17.5168C2.92976 17.5166 2.24695 17.3094 1.66614 16.9213C1.08533 16.5332 0.632575 15.9816 0.365074 15.3363C0.0975716 14.691 0.0273234 13.9809 0.163204 13.2957C0.299084 12.6105 0.634997 11.981 1.12851 11.4866C1.28214 11.3348 1.44975 11.1979 1.62912 11.0776C1.68147 11.0416 1.74037 11.0056 1.80253 10.9696C1.92553 10.8966 2.05221 10.83 2.18208 10.77C2.2508 10.7406 2.31624 10.7079 2.39149 10.6817C2.52927 10.63 2.67026 10.5874 2.81358 10.5541L2.90192 10.5312H2.951L3.74936 10.4755C3.85897 10.482 3.96818 10.494 4.07656 10.5115H4.10274H4.20744H4.48556C5.86626 10.4926 7.18301 9.9265 8.14675 8.93761C9.11048 7.94872 9.64244 6.61783 9.62584 5.2371V5.20111V5.16184C9.62245 5.11828 9.62245 5.07452 9.62584 5.03096C9.62584 4.99497 9.62584 4.95898 9.62584 4.92299V4.81501C9.62584 4.74957 9.6193 4.68413 9.60621 4.61869L9.65856 3.87595V3.85959C9.65856 3.84323 9.69128 3.74507 9.69128 3.74507C9.72552 3.59307 9.76923 3.44336 9.82216 3.29681C9.84806 3.2277 9.87755 3.15999 9.91051 3.09395C9.95994 2.95953 10.0179 2.82839 10.0839 2.70131V2.68168L10.1788 2.5279C10.2978 2.35051 10.4337 2.18504 10.5845 2.03383C10.9283 1.67492 11.3439 1.39255 11.8042 1.20516C12.2645 1.01777 12.7591 0.929583 13.2558 0.946347C13.7525 0.963111 14.24 1.08445 14.6866 1.30245C15.1333 1.52044 15.5289 1.83019 15.8476 2.21146C16.1664 2.59273 16.4012 3.03696 16.5366 3.51512C16.672 3.99329 16.7051 4.49464 16.6336 4.98644C16.5621 5.47824 16.3876 5.94944 16.1217 6.36925C15.8557 6.78906 15.5042 7.14805 15.0901 7.42278C15.0344 7.46205 14.9886 7.48822 14.9395 7.51767H14.9134C14.7921 7.59173 14.6664 7.65838 14.5371 7.71726C14.4699 7.75024 14.4011 7.77973 14.331 7.8056C14.1901 7.85813 14.0458 7.90077 13.8991 7.93321L13.8042 7.95939H13.7518L12.9665 8.01174C12.8569 8.00732 12.7477 7.99639 12.6393 7.97902H12.6033H12.5019H12.2271C11.5426 7.98798 10.8666 8.13184 10.2378 8.40239C9.60898 8.67293 9.0397 9.06483 8.56254 9.55567C8.08539 10.0465 7.70972 10.6266 7.45705 11.2628C7.20438 11.899 7.07967 12.5788 7.09006 13.2633V13.3025V13.3385C7.0931 13.3788 7.0931 13.4193 7.09006 13.4596V13.5839C7.09006 13.6166 7.09006 13.6592 7.09006 13.7017C7.09006 13.7443 7.09006 13.8162 7.10642 13.8751L7.05079 14.6473L7.03116 14.7062L7.01153 14.7749C6.9797 14.9261 6.93706 15.0748 6.88392 15.2199C6.86102 15.2854 6.8283 15.3541 6.79558 15.4261C6.7355 15.5559 6.66889 15.6825 6.59599 15.8056L6.48801 15.979C6.36671 16.1567 6.23102 16.3242 6.08229 16.4796C5.75475 16.8079 5.3656 17.0682 4.93717 17.2457C4.50874 17.4231 4.04948 17.5141 3.58576 17.5136L3.6283 17.5168Z"
                fill="#0694A2"
              />
            </svg>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-14">
            <a href="#" className="text-gray-600 text-base font-medium hover:text-gray-800">
              Internships
            </a>
            <a href="#" className="text-gray-600 text-base font-medium hover:text-gray-800">
              Courses
            </a>
            <a href="#" className="text-gray-600 text-base font-medium hover:text-gray-800">
              Units
            </a>
          </nav>

          {/* Desktop Search and User */}
          <div className="hidden lg:flex items-center gap-16">
            {/* Search Bar */}
            <div className="flex items-center gap-2 px-4 py-3 rounded-full border border-gray-400 bg-gray-50 w-[270px]">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent text-sm text-gray-400 outline-none flex-1"
              />
            </div>

            {/* Notification and Profile */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Bell className="w-5 h-5 text-gray-800" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </div>

              <div className="flex items-center gap-2 px-1.5 py-1.5 rounded-full bg-[#F0F5FF]">
                <Menu className="w-10 h-10 text-gray-500" />
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/f9777af9919a8398ec98bb885f57c6c1a7cb455b?width=80"
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden p-2">
            <Menu className="w-6 h-6 text-gray-800" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-20 py-4 md:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 relative">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-[300px] flex-shrink-0">
            <div className="border border-gray-200 rounded-[20px] p-7">
              <div className="flex items-center justify-between mb-7">
                <h2 className="text-xl font-medium text-gray-800">Filters</h2>
                <button className="text-sm font-medium text-blue-500 px-1.5 py-1">Reset all</button>
              </div>

              {/* Units Filter */}
              <div className="mb-7">
                <h3 className="text-sm font-medium text-gray-500 mb-5">Units</h3>
                <div className="relative">
                  <button className="w-full flex items-center justify-between px-4 py-2 rounded-[15px] border border-gray-400 bg-white text-xs text-gray-300">
                    <span>Select Units</span>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </button>
                </div>
                <div className="mt-4 space-y-4">
                  {["Yuvabe", "Upasana", "Auromics Trust", "Tapasya"].map((unit) => (
                    <label key={unit} className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded-md border-gray-300" />
                      <span className="text-xs text-gray-500">{unit}</span>
                    </label>
                  ))}
                  <button className="text-xs font-medium text-blue-500">+63 More</button>
                </div>
              </div>

              {/* Industry Filter */}
              <div className="mb-7">
                <h3 className="text-sm font-medium text-gray-500 mb-5">Industry</h3>
                <div className="relative">
                  <button className="w-full flex items-center justify-between px-4 py-2 rounded-[15px] border border-gray-400 bg-white text-xs text-gray-300">
                    <span>Select Industry type</span>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </button>
                </div>
                <div className="mt-4 space-y-4">
                  {[
                    "IT Services & Consulting",
                    "Software Products",
                    "Education & Training",
                    "Engineering & Construction",
                  ].map((industry) => (
                    <label key={industry} className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded-md border-gray-300" />
                      <span className="text-xs text-gray-500">{industry}</span>
                    </label>
                  ))}
                  <button className="text-xs font-medium text-blue-500">+18 More</button>
                </div>
              </div>

              {/* Apply Button */}
              <button className="w-full mt-7 py-2.5 px-7 rounded-[15px] border border-teal-500 text-teal-500 text-xs font-medium hover:bg-teal-50 transition-colors">
                Apply
              </button>
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          {showFilters && (
            <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setShowFilters(false)}>
              <div
                className="absolute left-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-medium text-gray-800">Filters</h2>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                {/* Same filter content as desktop */}
                <div className="mb-7">
                  <h3 className="text-sm font-medium text-gray-500 mb-5">Units</h3>
                  <div className="mt-4 space-y-4">
                    {["Yuvabe", "Upasana", "Auromics Trust", "Tapasya"].map((unit) => (
                      <label key={unit} className="flex items-center gap-2.5 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 rounded-md border-gray-300" />
                        <span className="text-xs text-gray-500">{unit}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button className="w-full mt-7 py-2.5 px-7 rounded-[15px] border border-teal-500 text-teal-500 text-xs font-medium">
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* Vertical Separator */}
          <div className="hidden lg:block absolute left-[308px] top-[32px] w-[5px] h-10 bg-gray-300"></div>

          {/* Internships Grid */}
          <div className="flex-1">
            <h1 className="text-sm md:text-base font-medium text-gray-600 mb-4 md:mb-6">
              Explore 249 internships just for you
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mb-6 md:mb-8">
              {internships.map((internship) => (
                <div
                  key={internship.id}
                  className="border border-gray-300 rounded-[11px] bg-white overflow-hidden group hover:shadow-lg transition-shadow"
                >
                  <div
                    className="relative h-[201px] rounded-[10px] m-1 overflow-hidden"
                    style={{ backgroundColor: internship.backgroundColor }}
                  >
                    <img
                      src={internship.image}
                      alt={internship.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{
                        transform:
                          internship.id === 4 ? "scale(1.1) translate(-14%, -14%)" : "scale(1.4) translate(-14%, -14%)",
                      }}
                    />
                    <div className="absolute inset-0 bg-[rgba(17,25,40,0.5)]"></div>

                    <div className="absolute top-5 left-6">
                      <span className="inline-block px-2.5 py-1.5 rounded-[10px] bg-white text-[10px] text-gray-500">
                        {internship.postedDate}
                      </span>
                    </div>

                    <div className="absolute bottom-12 left-6">
                      <h3 className="text-white text-[26px] font-normal leading-tight max-w-[124px]">
                        {internship.title}
                      </h3>
                    </div>

                    <div className="absolute bottom-5 left-6">
                      <div className="flex gap-1">
                        <div className="w-6 h-2 bg-white rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      </div>
                    </div>

                    <div className="absolute bottom-12 right-6">
                      <ChevronRight className="w-2 h-3 text-white" />
                    </div>
                  </div>

                  <div className="p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {internship.hasActualLogo ? (
                        <img
                          src={internship.companyLogo}
                          alt={internship.company}
                          className="w-[30px] h-[30px] rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-[30px] h-[30px] rounded-full border border-gray-500 bg-white flex items-center justify-center">
                          <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                        </div>
                      )}
                      <span className="text-sm text-gray-800">{internship.company}</span>
                    </div>

                    <button
                      className="px-3 md:px-4 py-2 md:py-2.5 rounded-[15px] text-white text-xs font-medium hover:opacity-90 transition-opacity"
                      style={{
                        background: "linear-gradient(135deg, #C94100 0%, #FFB592 100%)",
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 md:gap-4">
              <button className="w-[30px] h-[30px] rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <ChevronLeft className="w-4 h-4 text-gray-300" />
              </button>

              <button className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-orange-100 border border-orange-600 flex items-center justify-center">
                <span className="text-orange-600 font-semibold text-sm md:text-base">1</span>
              </button>

              <button className="w-8 md:w-10 h-8 md:h-10 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                <span className="font-semibold text-sm md:text-base">2</span>
              </button>

              <button className="w-8 md:w-10 h-8 md:h-10 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                <span className="font-semibold text-sm md:text-base">3</span>
              </button>

              <button className="hidden md:flex w-10 h-10 rounded-full items-center justify-center">
                <span className="font-semibold">...</span>
              </button>

              <button className="hidden md:flex w-10 h-10 rounded-full items-center justify-center hover:bg-gray-50 transition-colors">
                <span className="font-semibold">20</span>
              </button>

              <button className="w-[30px] h-[30px] rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// import { ChevronRight } from "lucide-react";
// import Navbar from "@/components/Navbar";
// import { useUnits } from "@/hooks/useUnits";
// import { formatDistanceToNow } from "date-fns";

// const Units = () => {
//   const navigate = useNavigate();
//   const { units, loading, error } = useUnits();

//   const [filters, setFilters] = useState({
//     unitNames: [] as string[],
//     industries: [] as string[],
//     isAurovillian: null as boolean | null,
//   });

//   console.log("[Units] Current filters:", filters);
//   console.log("[Units] Total units loaded:", units.length);

//   // Extract unique values for filters
//   const uniqueUnitNames = Array.from(new Set(units.map((u) => u.unit_name).filter(Boolean))).slice(0, 10);
//   const uniqueIndustries = Array.from(new Set(units.map((u) => u.industry || u.unit_type).filter(Boolean))).slice(
//     0,
//     10,
//   );

//   const toggleFilter = (category: "unitNames" | "industries", value: string) => {
//     console.log("[Units] Toggle filter:", category, value);
//     setFilters((prev) => ({
//       ...prev,
//       [category]: prev[category].includes(value)
//         ? prev[category].filter((v) => v !== value)
//         : [...prev[category], value],
//     }));
//   };

//   const toggleAuroville = (checked: boolean) => {
//     console.log("[Units] Toggle Auroville:", checked);
//     setFilters((prev) => ({
//       ...prev,
//       isAurovillian: checked ? true : null,
//     }));
//   };

//   const resetFilters = () => {
//     console.log("[Units] Reset all filters");
//     setFilters({ unitNames: [], industries: [], isAurovillian: null });
//   };

//   // Apply filters
//   const filteredUnits = units.filter((unit) => {
//     if (filters.unitNames.length > 0 && !filters.unitNames.includes(unit.unit_name)) {
//       return false;
//     }
//     if (filters.industries.length > 0) {
//       const unitIndustry = unit.industry || unit.unit_type;
//       if (!unitIndustry || !filters.industries.includes(unitIndustry)) {
//         return false;
//       }
//     }
//     if (filters.isAurovillian !== null && unit.is_aurovillian !== filters.isAurovillian) {
//       return false;
//     }
//     return true;
//   });

//   console.log("[Units] Filtered units:", filteredUnits.length);

//   const getUnitGradient = (index: number) => {
//     const gradients = [
//       "bg-gradient-to-br from-purple-600 to-blue-600",
//       "bg-gradient-to-br from-teal-600 to-green-600",
//       "bg-gradient-to-br from-orange-600 to-red-600",
//       "bg-gradient-to-br from-blue-600 to-cyan-500",
//       "bg-gradient-to-br from-pink-600 to-purple-600",
//       "bg-gradient-to-br from-gray-700 to-gray-900",
//     ];
//     return gradients[index % gradients.length];
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <div className="flex gap-6 p-6">
//         {/* Left Sidebar - Filters */}
//         <div className="w-80 bg-card border rounded-3xl p-6 h-fit sticky top-6">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-xl font-bold">Filters</h2>
//             <Button
//               variant="ghost"
//               className="text-primary hover:text-primary/80 text-sm font-medium"
//               onClick={resetFilters}
//             >
//               Reset all
//             </Button>
//           </div>

//           {/* Auroville Toggle */}
//           <div className="mb-6 p-4 bg-muted rounded-lg">
//             <div className="flex items-center justify-between">
//               <Label htmlFor="auroville-toggle" className="text-sm font-medium">
//                 Auroville Units Only
//               </Label>
//               <Switch
//                 id="auroville-toggle"
//                 checked={filters.isAurovillian === true}
//                 onCheckedChange={toggleAuroville}
//               />
//             </div>
//           </div>

//           {/* Units Filter */}
//           <div className="mb-6">
//             <h3 className="text-sm font-semibold text-muted-foreground mb-3">Units</h3>
//             <div className="space-y-3 max-h-60 overflow-y-auto">
//               {uniqueUnitNames.map((unitName) => (
//                 <div key={unitName} className="flex items-center space-x-2">
//                   <Checkbox
//                     id={`unit-${unitName}`}
//                     checked={filters.unitNames.includes(unitName)}
//                     onCheckedChange={() => toggleFilter("unitNames", unitName)}
//                   />
//                   <label htmlFor={`unit-${unitName}`} className="text-sm font-medium cursor-pointer line-clamp-1">
//                     {unitName}
//                   </label>
//                 </div>
//               ))}
//             </div>
//             {uniqueUnitNames.length > 10 && (
//               <Button variant="link" className="text-primary text-sm p-0 mt-2">
//                 +{units.length - 10} More
//               </Button>
//             )}
//           </div>

//           {/* Industry Filter */}
//           <div className="mb-6">
//             <h3 className="text-sm font-semibold text-muted-foreground mb-3">Industry</h3>
//             <div className="space-y-3 max-h-60 overflow-y-auto">
//               {uniqueIndustries.map((industry) => (
//                 <div key={industry} className="flex items-center space-x-2">
//                   <Checkbox
//                     id={`industry-${industry}`}
//                     checked={filters.industries.includes(industry)}
//                     onCheckedChange={() => toggleFilter("industries", industry)}
//                   />
//                   <label htmlFor={`industry-${industry}`} className="text-sm font-medium cursor-pointer line-clamp-1">
//                     {industry}
//                   </label>
//                 </div>
//               ))}
//             </div>
//             {uniqueIndustries.length > 10 && (
//               <Button variant="link" className="text-primary text-sm p-0 mt-2">
//                 +{uniqueIndustries.length - 10} More
//               </Button>
//             )}
//           </div>

//           <Button
//             className="w-full rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
//             variant="outline"
//             onClick={resetFilters}
//           >
//             Apply
//           </Button>
//         </div>

//         {/* Main Content */}
//         <div className="flex-1">
//           <div className="mb-6">
//             <h1 className="text-3xl font-bold">Explore {filteredUnits.length} Units</h1>
//           </div>

//           {error && (
//             <div className="text-center py-8">
//               <p className="text-destructive">{error}</p>
//             </div>
//           )}

//           {loading ? (
//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//               {Array.from({ length: 6 }).map((_, i) => (
//                 <Card key={i} className="overflow-hidden rounded-3xl">
//                   <Skeleton className="h-48 w-full" />
//                   <CardContent className="p-4">
//                     <Skeleton className="h-6 w-full mb-2" />
//                     <Skeleton className="h-4 w-3/4" />
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           ) : filteredUnits.length === 0 ? (
//             <div className="text-center py-12">
//               <p className="text-muted-foreground">No units found matching your filters.</p>
//               <Button variant="outline" onClick={resetFilters} className="mt-4">
//                 Clear Filters
//               </Button>
//             </div>
//           ) : (
//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//               {filteredUnits.map((unit, index) => {
//                 const gradient = getUnitGradient(index);
//                 const focusAreas =
//                   typeof unit.focus_areas === "object" && unit.focus_areas !== null
//                     ? Object.entries(unit.focus_areas as Record<string, any>).slice(0, 2)
//                     : [];

//                 return (
//                   <Card
//                     key={unit.id}
//                     className="overflow-hidden rounded-3xl hover:shadow-lg transition-all cursor-pointer"
//                     onClick={() => navigate(`/units/${unit.id}`)}
//                   >
//                     {/* Unit Header */}
//                     <div
//                       className={`${gradient} h-48 relative flex flex-col items-center justify-center p-6 text-white`}
//                     >
//                       <Badge className="absolute top-3 left-3 bg-white/90 text-foreground">
//                         {formatDistanceToNow(new Date(unit.created_at), { addSuffix: true })}
//                       </Badge>

//                       {unit.is_aurovillian && (
//                         <Badge className="absolute top-3 right-3 bg-green-500 text-white">Auroville</Badge>
//                       )}

//                       <h3 className="text-xl font-bold text-center mb-2">{unit.unit_name}</h3>
//                       <p className="text-sm text-white/80">{unit.unit_type}</p>

//                       {focusAreas.length > 0 && (
//                         <div className="mt-3 flex flex-wrap gap-2 justify-center">
//                           {focusAreas.map(([key]) => (
//                             <Badge key={key} variant="secondary" className="bg-white/20 text-white text-xs">
//                               {key}
//                             </Badge>
//                           ))}
//                         </div>
//                       )}

//                       <ChevronRight className="absolute right-4 bottom-4 w-6 h-6" />
//                     </div>

//                     {/* Unit Footer */}
//                     <CardContent className="p-4">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-2">
//                           <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
//                             <img src={unit.image} alt={`${unit.unit_name} logo`} />
//                           </div>
//                           <span className="text-sm font-medium line-clamp-1">{unit.unit_name}</span>
//                         </div>

//                         <Button
//                           size="sm"
//                           className="bg-orange-500 hover:bg-orange-600 text-white rounded-3xl"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             navigate(`/units/${unit.id}`);
//                           }}
//                         >
//                           View
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Units;
