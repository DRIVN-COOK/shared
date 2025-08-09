import { useState } from 'react';

export function LoginForm({ onSubmit }: { onSubmit: (email:string, password:string)=>void }) {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(email, password); }} className="flex flex-col gap-3">
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mot de passe" type="password" />
      <button type="submit">Se connecter</button>
    </form>
  );
}

export function RegisterForm({ onSubmit }: { onSubmit: (p:{email:string;password:string;firstName?:string;lastName?:string})=>void }) {
  const [form, setForm] = useState({ email:'', password:'', firstName:'', lastName:'' });
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form); }} className="flex flex-col gap-3">
      <input value={form.firstName} onChange={e=>setForm({...form, firstName:e.target.value})} placeholder="Prénom" />
      <input value={form.lastName} onChange={e=>setForm({...form, lastName:e.target.value})} placeholder="Nom" />
      <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="Email" />
      <input value={form.password} onChange={e=>setForm({...form, password:e.target.value})} placeholder="Mot de passe" type="password" />
      <button type="submit">Créer mon compte</button>
    </form>
  );
}
