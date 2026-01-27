import { RouterProvider } from "react-router";
import routes from "./router/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TanStackDevtools } from "@tanstack/react-devtools";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={routes} />
      <TanStackDevtools />
    </QueryClientProvider>
  );
}

export default App;
