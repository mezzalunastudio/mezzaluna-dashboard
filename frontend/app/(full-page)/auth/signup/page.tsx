'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import TextInputField from '../../../components/textInputField';
import { signUp, SignUpCredentials } from '../../../../service/user.service';

const SignUpPage = () => {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SignUpCredentials>();

    const onSubmit = async (credentials: SignUpCredentials) => {
        setIsPending(true);
        setError(null);

        try {
            const a = await signUp(credentials); // Call login API function
            //router.push('/');
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
                    <img src="/demo/images/blocks/logos/hyper.svg" alt="hyper" height={50} className="mb-3" />
                    <div className="text-900 text-3xl font-medium mb-3">Create an account</div>
                    <span className="text-600 font-medium line-height-3">Already have an account?</span>
                    <a href="/auth/login" className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">
                        Sign in
                    </a>
                </div>

                <form>
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
                    <TextInputField name="confirmPassword" label="Confirm Password" type="password" placeholder="Enter your password" register={register} registerOptions={{ required: 'Confirm Password is required' }} error={errors.confirmPassword} />
                    <Button label="Create Account" type="submit" className="w-full" />
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;
