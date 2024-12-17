'use client';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { login, LoginCredentials } from '../../../../service/user.service';
import TextInputField from '../../../components/textInputField';

const Login = () => {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [checked, setChecked] = useState(false);
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginCredentials>();

    const onSubmit = async (credentials: LoginCredentials) => {
        setIsPending(true);
        setError(null);

        try {
            await login(credentials); // Call login API function
            router.push('/');
        } catch (err: any) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
            <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
                <div className="text-center mb-5">
                    {/* <img src="/demo/images/blocks/logos/hyper.svg" alt="hyper" height={50} className="mb-3" /> */}
                    <div className="text-900 text-3xl font-medium mb-3">Sign in to your account</div>
                    <span className="text-600 font-medium line-height-3">Don&apos;t have an account?</span>
                    <a href="/auth/signup" className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">
                        Sign up
                    </a>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        register={register}
                        registerOptions={{
                            required: 'Email is required',
                            pattern: { value: /^\S+@\S+$/, message: 'Invalid email format' }
                        }}
                        error={errors.email}
                    />
                    <TextInputField name="password" label="Password" type="password" placeholder="Enter your password" register={register} registerOptions={{ required: 'Password is required' }} error={errors.password} />

                    <div className="flex align-items-center justify-content-between mb-5 gap-5">
                        <div className="flex align-items-center">
                            <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"></Checkbox>
                            <label htmlFor="rememberme1">Remember me</label>
                        </div>
                        <a href="/password/forgot" className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                            Forgot password?
                        </a>
                    </div>
                    <Button label={isPending ? 'Signing In...' : 'Sign In'} type="submit" className="w-full" disabled={isPending} />
                    {error && <p className="text-center text-red-500">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default Login;
