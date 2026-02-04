import { RouterProvider } from "react-router";
import routes from "./router/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { useNotification } from "./hooks/useNotification";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationListener />
      <RouterProvider router={routes} />
      <TanStackDevtools />
    </QueryClientProvider>
  );
}

function NotificationListener() {
  useNotification();
  return null;
}

export default App;
