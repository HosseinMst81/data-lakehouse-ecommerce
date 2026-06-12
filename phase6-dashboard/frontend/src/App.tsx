import { Button } from "./components/ui/button";

function App() {
  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <h1 className="text-3xl font-bold text-blue-600">Dashboard Ready</h1>
      </div>
      <Button variant={"destructive"} color={'#faf'}>
        CHECK SHADCN BUtton{" "}
      </Button>
    </>
  );
}

export default App;
