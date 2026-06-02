import AuthBrandHeader from './AuthBrandHeader'
import LoginForm from './LoginForm'

export default function LoginScreen() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-blue-950 text-white flex flex-col">
      <AuthBrandHeader />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <LoginForm />
      </div>
    </main>
  )
}
