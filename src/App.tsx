import { RouterProvider } from "react-router";
import routes from "./router/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { SseProvider } from "./contexts/SseContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SseProvider>
        <RouterProvider router={routes} />
      </SseProvider>
      <TanStackDevtools />
    </QueryClientProvider>
  );
}

export default App;
