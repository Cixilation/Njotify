// InputForm.tsx
import InputField from '../styledComponents/InputField';

export function InputForm({ type, name, onChange }: { type: string; name:string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="mb-15 wpercent50">
      <p className="fs-14 b600 white">{type}</p>
      {type.includes('Password') ? (
        <InputField placeholder={type} type="password" onChange={onChange} name={name} />
      ) : (
        <InputField placeholder={type} type="text" onChange={onChange} name={name}/>
      )}
    </div>
  );
};
