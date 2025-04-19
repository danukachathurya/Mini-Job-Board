'use client';

import { useState } from 'react';
import { Button, Label, TextInput } from 'flowbite-react';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert('Registered successfully');
      console.log('User:', data.user);
    } catch (err) {
      console.error('Registration error:', err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="name" value="Your Name" />
        <TextInput
          id="name"
          name="name"
          type="text"
          required
          onChange={handleChange}
          value={formData.name}
        />
      </div>

      <div>
        <Label htmlFor="email" value="Your Email" />
        <TextInput
          id="email"
          name="email"
          type="email"
          required
          onChange={handleChange}
          value={formData.email}
        />
      </div>

      <div>
        <Label htmlFor="password" value="Password" />
        <TextInput
          id="password"
          name="password"
          type="password"
          required
          onChange={handleChange}
          value={formData.password}
        />
      </div>

      <Button type="submit" gradientDuoTone="purpleToPink">
        Sign Up
      </Button>
    </form>
  );
}
