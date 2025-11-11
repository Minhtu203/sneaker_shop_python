const ToggleButonz = ({ checked, onChange }) => (
  <div
    className={`relative inline-block w-12 h-6 rounded-full cursor-pointer transition duration-200 ease-in-out ${
      checked ? 'bg-[var(--primary-blue)]' : 'bg-gray-300'
    }`}
    onClick={() => onChange({ value: !checked })}
  >
    <div
      className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition transform duration-200 ease-in-out ${
        checked ? 'translate-x-6' : 'translate-x-0'
      }`}
    ></div>
  </div>
);

export default ToggleButonz;
