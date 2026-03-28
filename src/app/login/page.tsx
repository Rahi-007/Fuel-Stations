import LoginForm from "./LoginForm";

const page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to continue to FuelMap.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default page;
