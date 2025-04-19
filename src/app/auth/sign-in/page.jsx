'use client';

import { Button, Label, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (res.ok) {
      router.push('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold text-center">Sign In</h2>

      {error && <p className="text-red-600 text-sm text-center">{error}</p>}

      <div>
        <Label htmlFor="email" value="Your email" />
        <TextInput
          id="email"
          type="email"
          name="email"
          placeholder="name@example.com"
          required
          onChange={handleChange}
          value={formData.email}
        />
      </div>

      <div>
        <Label htmlFor="password" value="Password" />
        <TextInput
          id="password"
          type="password"
          name="password"
          required
          onChange={handleChange}
          value={formData.password}
        />
      </div>

      <Button type="submit" gradientDuoTone="greenToBlue">Sign In</Button>
    </form>
  );
}
