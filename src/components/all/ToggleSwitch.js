export const ToggleSwitch = ({ checked, onChange, label }) => (
    <label className="flex items-center space-x-2 cursor-pointer">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="relative inline-block w-10 align-middle select-none">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="hidden"
        />
        <div className={`block w-10 h-6 rounded-full transition-colors duration-200 ease-in ${checked ? 'bg-primary' : 'bg-gray-300'}`}>
          <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in ${checked ? 'transform translate-x-4' : 'transform translate-x-0'}`} />
        </div>
      </div>
    </label>
  );
  
  