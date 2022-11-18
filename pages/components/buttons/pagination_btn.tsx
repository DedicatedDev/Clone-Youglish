export default function PaginationBtn(props: {
  title: string;
  onClick(): void;
}) {
  return (
    <div
      className="px-4 py-2 m-2 bg-blue-500 rounded-md cursor-pointer select-none active:bg-indigo-200"
      onClick={props.onClick}
    >
      {props.title}
    </div>
  );
}
