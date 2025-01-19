

export const MenuItems = ({text, icon:Icon,active, cursor, onClick}) => {
    return (
      <div className="divide-y">
        <div
          className={`p-4 flex items-center gap-3 border-b cursor-${cursor}  ${
            active ? "text=-black" : "text-gray-700"
          } `}
        onClick={onClick} >
          <Icon className="w-5 h-5 font-semibold" />
          <span className="font-bold text-sm">{text}</span>
        </div>
      </div>
    );
}


export const SubMenuItems = ({ text, active, onClick }) => {
    return (
      <div
        className={`pl-12 pr-4 py-3 text-sm cursor-pointer hover:bg-gray-100 ${
          active ? "text=-black" : "text-gray-600"
        }`}
        onClick={onClick}
      >
        <div className="flex justify-between items-center">
          <span className="hover:font-medium">{text}</span>
        </div>
      </div>
    );
};
