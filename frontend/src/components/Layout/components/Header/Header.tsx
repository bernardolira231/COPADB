import SelectComponent from "../Select";

interface HeaderProps {
  onGroupChange?: (groupId: string | null) => void;
}

const Header: React.FC<HeaderProps> = ({ onGroupChange = () => {} }) => {
  return (
    <header className="h-[82px] bg-white border-b border-border-color flex items-center px-6">
      <div className="flex-1"></div>

      <div className="flex items-center gap-4">
        <SelectComponent onGroupChange={onGroupChange} />

        <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center cursor-pointer">
          A {/* Aquí puedes poner inicial o imagen de perfil */}
        </div>
      </div>
    </header>
  );
};

export default Header;
