const Footerpage = () => {
  return (
    <div className="w-full h-20 bg-[hsl(241,89%,11%)] shadow-inner flex items-center px-8">
      <div className="flex justify-between w-full text-white text-sm">

        {/* ซ้าย */}
        <div>
          <span className="text-2xl">เอกสาร</span>
        </div>

        {/* กลาง */}
        <div>
          <span className=" text-2xl">https:donate.app</span>
        </div>

        {/* ขวา */}
        <div>
          <a className="text-2xl bg-linear-to-r from-white via-[#5E84FF] to-[#005EFF] bg-clip-text text-transparent font-semibold">
            donate.app
          </a>
        </div>

      </div>
    </div>
  );
};

export default Footerpage;
