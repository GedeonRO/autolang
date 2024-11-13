export default function ProjectCard() {
  return (
    <div className="bg-section-tabcontent hover:bg-section-tabcontent/50 cursor-pointer w-full h-[250px] rounded-2xl flex flex-col justify-between p-10 ">
      <div className="flex flex-col gap-2 items-start">
        <span>Project 1</span> <span>Autolang</span>
      </div>
      <div className="flex justify-between w-full items-center">
        <span>French, English, Portugese ...</span>
        <div className="bg-button px-4 py-2 rounded-full">
          <span> {"</>"}Web</span>
        </div>
      </div>
    </div>
  );
}
