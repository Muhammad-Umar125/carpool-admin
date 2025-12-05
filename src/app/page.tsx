import LoginForm from './components/LoginForm';

export default function AdminPortalHome() {
  return (
    // fix height issue or is correct
    <div className="flex justify-center items-center h-[93.7vh] bg-gray-100">
      <LoginForm />
    </div>
  );
}
