import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { FieldError, RegisterOptions, UseFormRegister } from 'react-hook-form';

interface TextInputFieldProps {
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    register: UseFormRegister<any>;
    registerOptions?: RegisterOptions;
    error?: FieldError;
}

const TextInputField = ({ name, label, type = 'text', placeholder, register, registerOptions, error }: TextInputFieldProps) => {
    return (
        <div className="field mb-3">
            <label htmlFor={name} className="block text-900 font-medium mb-2">
                {label}
            </label>
            <InputText id={name} type={type} placeholder={placeholder} {...register(name, registerOptions)} className={classNames('w-full', { 'p-invalid': error })} />
            {error && <small className="p-error">{error.message}</small>}
        </div>
    );
};

export default TextInputField;
