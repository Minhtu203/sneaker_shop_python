import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';

const InputTextz = (props) => {
  const { label, ...prop } = props;
  return (
    <div className={`w-full h-12 relative flex items-center`}>
      <FloatLabel className="w-full">
        <InputText
          id={label}
          className="w-full h-12 rounded-md p-4 border-2 border-[var(--primary-blue)] outline-none"
          {...prop}
        />
        <label htmlFor={label} className="text-[var(--primary-blue)] flex flex-row ml-2">
          {label}
        </label>
      </FloatLabel>
    </div>
  );
};

export default InputTextz;
