import { Toaster } from 'react-hot-toast';
import RouteElement from './router/RouteElement';

export default function App() {
  return (
    <>
      <RouteElement />
      <Toaster
        position='bottom-left'
        toastOptions={{
          className: 'dark:bg-slate-900 dark:text-white',
        }}
      />
    </>
  );
}
