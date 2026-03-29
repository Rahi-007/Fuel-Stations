import LoginForm from "./LoginForm";

const page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full space-y-4">
        {/* <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to continue to FuelMap.
          </p>
        </div> */}

        <div className="rounded-lg bg-card">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default page;
